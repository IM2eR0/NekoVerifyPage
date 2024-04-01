<template>
  <q-layout view="hHh LpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>

        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          {{ webTitle }}
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="desktop" elevated>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { api } from 'boot/axios'
import { defineComponent,ref } from 'vue'
import { Cookies, Notify } from 'quasar';

export default defineComponent({
  name: 'MainLayout',
  mounted(){
    if(!Cookies.get("uuid")){
      Notify.create({
        type: 'negative',
        message: 'uuid存储出现异常，请重新登录...'
      });
      this.$router.push('/login')
      Cookies.remove("accessToken")
      Cookies.remove("uuid")
      return
    }
    api.post("http://localhost:5400/server/sessions",{
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
  },
  setup() {
    const leftDrawerOpen = ref(false)
    const webTitle = ref("")
    api.get("http://localhost:5400/server/settings").then(
      (res) => {
        webTitle.value = res['data']["server"]['name'] + " - 管理面板"
      }
    )

    return {
      leftDrawerOpen,
      webTitle,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
