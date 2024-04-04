<template>
  <q-layout view="hHh LpR fFf">

    <q-header elevated class="bg-accent text-white" height-hint="0">
      <q-toolbar>

        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          {{ webTitle }}
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="desktop" elevated>

      <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />

      <hr>

      <q-item clickable @click="logout" style="color: red ;">
        <q-item-section avatar>
          <q-icon name="mdi-logout" />
        </q-item-section>
        <q-item-section>
          <q-item-label>退出登录</q-item-label>
        </q-item-section>
      </q-item>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { api } from 'boot/axios'
import { defineComponent, ref, inject } from 'vue'
import { Cookies, Notify } from 'quasar';
import EssentialLink from 'components/EssentialLink.vue'
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'MainLayout',
  components: {
    EssentialLink
  },
  mounted() {
    if(!Cookies.get("accessToken")){
      Notify.create({
        type: 'negative',
        message: '您还未登录，请登录...'
      });
      this.$router.push('/login')
      Cookies.remove("accessToken")
      Cookies.remove("uuid")
      return
    }

    if (!Cookies.get("uuid")) {
      Notify.create({
        type: 'negative',
        message: 'uuid存储出现异常，请重新登录...'
      });
      this.$router.push('/login')
      Cookies.remove("accessToken")
      Cookies.remove("uuid")
      return
    }

    api.post(this.$yggApi+"/server/sessions", {
      accessToken: Cookies.get("accessToken"),
      requestUser: true
    }).then(
      (res) => {
        Cookies.set("accessToken", res["data"]["accessToken"])
        Cookies.set("uuid", res["data"]["uuid"])
      }
    ).catch((error) => {
      Notify.create({
        type: 'negative',
        message: '您未登录，请登录后继续...'
      });
      this.$router.push('/login')
      Cookies.remove("accessToken")
      Cookies.remove("uuid")
      return
    });

    if(this.$router.currentRoute.value.fullPath == "/"){
      this.$router.push("/home")
    }

  },
  setup() {
    const $yggApi = inject('$yggApi')
    const $router = inject('$router')
    const leftDrawerOpen = ref(false)
    const webTitle = ref("")

    if(!Cookies.get("accessToken") || !Cookies.get("uuid")){
      useRouter().push("/login")
      setTimeout(()=>{
        location.reload()
      },500)
    }

    api.get($yggApi + "/server/settings").then(
      (res) => {
        webTitle.value = res['data']["server"]['name'] + " - 管理面板"
      }
    )
    api.get($yggApi + "/server/user/" + Cookies.get("uuid"), {
      headers: {
        Authorization: "Bearer " + Cookies.get("accessToken")
      }
    }).then(
      (res) => {
        res = res["data"]
        sessionStorage.setItem("userInfomation", JSON.stringify(res))
        sessionStorage.setItem("userProfiles", JSON.stringify(res.profiles))
      }
    )
    const linksList = [
      {
        title: '个人信息',
        icon: 'mdi-file-document-outline',
        link: '/home'
      },
      {
        title: '角色列表',
        icon: 'mdi-file-document-outline',
        link: '/profiles'
      },
      {
        title: '配置文件',
        icon: 'mdi-file-document-outline',
        link: '/settings'
      },
    ]



    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      webTitle,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },
  updated() {
    if(this.$router.currentRoute.value.fullPath == "/"){
      this.$router.push("/home")
    }
  },
  methods: {
    logout() {
      this.$router.push('/login')
      Cookies.remove("accessToken")
      Cookies.remove("uuid")
      Notify.create({
        type: 'positive',
        message: '成功登出！',
        timeout: 1000
      })
    }
  }
})
</script>
