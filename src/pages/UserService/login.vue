<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <div class="mainbox">
          <center>
            <h1>用户登录</h1>
          </center>
          <q-form @submit="onSubmit" class="center">
            <q-input v-model="userName" label="邮箱" type="email" />
            <br>
            <q-input v-model="password" label="密码" type="password" />
            <br>
            <center>

              <q-btn label="登录" type="submit" color="primary" icon="mdi-login" />
              &ensp;
              <q-btn label="注册" to="/register" color="red" icon="mdi-account" />

            </center>
          </q-form>
          <div class="watermark">
            <center>
              {{ $pageVersion }}
            </center>
          </div>
          <div>
            <center>
              <a href="#/login" @click="forgetPwdDialog = true">忘记密码？</a>
            </center>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>

  <q-dialog v-model="forgetPwdDialog" persistent transition-show="flip-down" transition-hide="flip-up">
    <q-card>
      <q-toolbar>
        <q-toolbar-title>忘记密码</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <q-input label="UUID" v-model="uuid"></q-input>
        <br>
        <q-input label="新密码" v-model="newpwd"></q-input>
        <br>
        <q-input label="救援代码" v-model="resCode"></q-input>
        <br>
        <div>Tips：若忘记UUID或救援代码，请联系管理员获取。</div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" v-close-popup color="red" />
        <q-btn flat label="确认" v-close-popup @click="forgetPwd" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { api } from 'boot/axios'
import { Cookies, Notify } from 'quasar';

export default defineComponent({
  name: "LoginPage",
  mounted() {
    if (Cookies.get("accessToken")) {
      this.$router.push('/')
    }
  },
  setup() {
    return {
      userName: ref(""),
      password: ref(""),
      forgetPwdDialog: ref(false),
      uuid: ref(""),
      newpwd: ref(""),
      resCode: ref(""),
    }
  },
  methods: {
    onSubmit() {
      let notif = Notify.create({
        type: 'ongoing',
        message: '正在登录中...'
      })


      api.post(this.$yggApi + "/server/sessions", {
        username: this.userName,
        password: this.password
      }).then(
        (res) => {
          Cookies.set("accessToken", res["data"]["accessToken"])
          Cookies.set("uuid", res["data"]["uuid"])
          notif({
            type: 'positive',
            message: '登录成功！',
            timeout: 1000
          });
          api.get(this.$yggApi + "/server/users/" + Cookies.get("uuid"), {
            headers: {
              Authorization: "Bearer " + Cookies.get("accessToken")
            }
          }).then(
            (res) => {
              res = res["data"]
              sessionStorage.setItem("userInfomation", JSON.stringify(res))
              sessionStorage.setItem("userProfiles", JSON.stringify(res.profiles))
              this.$router.push('/home')
            }
          )
        }
      ).catch(
        () => { }
      )
    },
    forgetPwd() {
      api.patch("/server/users/" + this.uuid + "/password", {
        rescueCode: this.resCode,
        newPassword: this.newpwd
      }).then(
        (res) => {
          if(res){
            Notify.create({
              type: 'positive',
              message: '密码修改成功！',
              timeout: 1000
            })
          }
        }
      ).catch(
        () => {}
      )
    }
  }
});

</script>

<style scoped>
h1 {
  font-size: 32px;
  margin: 0;
  padding: 0;
}

.center {
  margin: 0 auto;
  width: 320px;
}

.q-page {
  background-color: #222222;
}

.mainbox {
  background-color: white;
  padding: 35px;
  border-radius: 15px;
}

.watermark {
  margin: 0;
  padding: 0;
  margin-top: 20px;
}

a {
  color: blue;
  text-decoration: none;
  transition: color .3s;
}
</style>
