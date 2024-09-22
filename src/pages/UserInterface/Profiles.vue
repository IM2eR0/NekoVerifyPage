<template>
  <q-page>
    <div class="yggHeader">
      <h1>
        {{ nickName }} 的 角色列表
      </h1>
      <!-- <div>testbtn</div> -->
      <q-btn color="primary" @click="toolbar = true" round icon="mdi-plus" />
    </div>
    <br><br><br><br><br>
    <hr>
    <br>
    PS:点击角色名可以打开操作页面
    <div class="flex flex-center PClist" style="gap: 20px;">
      <ProfileCard v-for="key in profileList" :key="key.id" v-bind="key"></ProfileCard>
    </div>
  </q-page>

  <q-dialog v-model="toolbar" persistent transition-show="flip-down" transition-hide="flip-up">
    <q-card>
      <q-toolbar>
        <q-toolbar-title>新建角色</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <q-input label="角色名" v-model="new_name"></q-input>
        <br>
        <q-toggle v-model="offlineable" label="是否兼容离线登录？" />
        <br>
        <div>Tips：勾选后，创建的角色的UUID将会采用和离线验证相同的计算方式。如果一个离线验证的服务器计划迁移到外置验证，那么勾选本项，可以使游戏内角色数据仍然保留(前提是ID一致)。</div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" v-close-popup color="red" />
        <q-btn flat label="确认" v-close-popup @click="createNewProfile" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { api } from 'src/boot/axios';
import { defineComponent, ref } from 'vue'
import ProfileCard from 'src/components/ProfileCard.vue';
import { Cookies, Notify, Loading, QSpinnerGrid } from 'quasar';

export default defineComponent({
  name: "UserProfiles",
  components: {
    ProfileCard
  },
  data() {
    return {
      nickName: [],
      profileList: [],
      toolbar: ref(false),
      new_name: ref(""),
      offlineable: ref(true)
    }
  },
  mounted() {
    this.getProfileList()
    this.nickName = JSON.parse(sessionStorage.getItem("userInfomation")).nickName
  },
  methods: {
    createNewProfile() {
      api.put(this.$yggApi + "/server/profiles", {
        name: this.new_name,
        offlineCompatible: this.offlineable
      }, {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken")
        }
      }).then(
        setTimeout(function () {
          location.reload()
        }, 1000)
      ).catch(
        (err) => {
          err = JSON.parse(err.request.response)
          Notify.create({
            type: 'negative',
            message: err.errorMessage || "未知错误",
          })
        }
      )
    },
    getProfileList() {
      Loading.show({
        pinner: QSpinnerGrid,
        message: '正在加载数据，请稍后...',
      })
      this.profileList = []
      api.get(this.$yggApi + "/server/user/" + Cookies.get("uuid"), {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken")
        }
      }).then(
        (res) => {
          res = res.data
          res.profiles.forEach(element => {
            api.get(this.$yggApi + "/server/profile/" + element).then(
              (res) => {
                res = res["data"]
                this.profileList.push({
                  id: res.id,
                  name: res.name,
                  texture: res.properties[0].value
                })
              }
            )
          });
          Loading.hide()
        }
      ).catch(
        () => {
          this.getProfileList()
        }
      )
    }
  }
});
</script>

<style scoped>
.q-page {
  padding: 15px;
}

h1 {
  font-size: 32px;
  margin: 0;
  padding: 0;
}

.yggHeader h1 {
  float: left;
}

.yggHeader .q-btn {
  float: right;
  margin-top: 32px;
}

.PClist {
  padding: 0 15px;
}
</style>
