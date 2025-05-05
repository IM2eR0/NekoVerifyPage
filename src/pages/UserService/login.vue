<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <div class="mainbox">
          <center>
            <h1>Login</h1>
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
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
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
      password: ref("")
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
        (error) => {
          notif({
            type: 'negative',
            message: '登录失败：' + error.response.data.errorMessage,
            timeout: 1000
          })
        }
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
</style>
