<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <div class="mainbox">
          <center>
            <h1>Register</h1>
          </center>
          <q-form @submit="onSubmit" class="center">

            <q-input v-model="email" label="邮箱" />
            <br>
            <q-input v-model="userName" label="游戏内用户名" />
            <br>
            <q-input v-model="password" label="密码" type="password" />
            <br>
            <q-input v-model="password2" label="再次输入一遍密码" type="password" />
            <br>

            <center>
              <q-btn label="注册" type="submit" color="primary" icon="mdi-login" />
              &ensp;
              <q-btn label="已有账号？" to="/login" color="red" icon="mdi-account" />
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
  name: "RegisterPage",
  setup() {
    return {
      userName: ref(""),
      password: ref(""),
      password2: ref(""),
      email: ref(""),
      invitecode: "testcode"
    }
  },
  methods: {
    onSubmit() {
      // console.log(this.userName)
      if (!this.email) {
        return Notify.create({
          type: 'negative',
          message: '注册失败：邮箱不能为空',
          timeout: 1000
        })
      }

      if (!this.userName) {
        return Notify.create({
          type: 'negative',
          message: '注册失败：请输入有效的名称！（名称只能为大小写英文下划线加数字！）',
          timeout: 1000
        })
      }

      if (!this.password) {
        return Notify.create({
          type: 'negative',
          message: '注册失败：请输入密码',
          timeout: 1000
        })
      }

      if (this.password !== this.password2) {
        return Notify.create({
          type: 'negative',
          message: '注册失败：两次输入的密码不一致',
          timeout: 1000
        })
      }

      let notif = Notify.create({
        type: 'ongoing',
        message: '正在注册中...'
      })


      // api.put(this.$yggApi + "/server/users", {
      //   username: this.userName,
      //   password: this.password
      // }).then(
      //   (res) => {
      //     Cookies.set("accessToken", res["data"]["accessToken"])
      //     notif({
      //       type: 'positive',
      //       message: '登录成功！',
      //       timeout: 1000
      //     })
      //     this.$router.push('/')
      //   }
      // ).catch(
      //   (error) => {
      //     notif({
      //       type: 'negative',
      //       message: '登录失败：用户名或密码错误',
      //       timeout: 1000
      //     })
      //   }
      // )
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

.watermark{
  margin: 0;
  padding: 0;
  margin-top: 20px;
}
</style>
