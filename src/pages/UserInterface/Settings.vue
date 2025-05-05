<template>
  <q-page>
    <div class="yggHeader">
      <h1>{{ nickName }} 的 用户设置</h1>
    </div>
    <hr>

    <div class="subsetting">
      <h2>救援代码</h2>
      <hr><br>
      <div>
        如果日后忘记密码，可以使用这里生成的救援代码重置密码，若账号从未生成过救援代码，则无法通过网页自助找回密码。救援代码只会显示一次，应妥善保存。
      </div>
      <br>
      <q-btn label="获取救援代码" color="primary" @click="getCode" />
    </div>

    <div class="subsetting">
      <h2>修改密码</h2>
      <hr><br>
      <div>
        <q-input label="新密码" v-model="npwd" />
      </div>
      <br>
      <q-btn label="提交" color="primary" @click="changePwd" />
    </div>

    <div class="subsetting">
      <h2>⚠️高危地带⚠️</h2>
      <hr><br>
      <center style="color: red;">
        下面的操作十分危险，会导致账户永久消失（包括角色），或是永久性地无法修改任何账户相关内容。
      </center>
      <br>
      <btngroup>
        <q-btn label="刷新令牌" color="primary" @click="refreshValidate = true" />
        &ensp;
        <q-btn label="删除用户" color="red" @click="deleteAccValidate = true" />
      </btngroup>

    </div>

    <div v-if="role == 'admin'">
      <div class="subsetting">
        <h2>管理员：批量获取临时邀请码</h2>
        <hr><br>
        <div>
          临时邀请码拥有30分钟有效期，用后即失效。请按需获取。
        </div>
        <br>

        <q-input v-model="invcodeNum" label="要获取的邀请码数量" type="number" />
        <br>
        <q-btn label="获取" color="primary" @click="getInviteCode" />

      </div>

    </div>

  </q-page>

  <q-dialog v-model="deleteAccValidate" persistent transition-show="flip-down" transition-hide="flip-up">
    <q-card>
      <q-toolbar>
        <q-toolbar-title>删除账户</q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <b>注意：</b><span style="color:red">这会使你永久失去该账号，包括账号内的角色、皮肤等，如果你执意要这么做，请在下方输入你的用户名与密码</span>
        <br>
        <q-input v-model="userName" label="邮箱" type="email" />
        <br>
        <q-input v-model="password" label="密码" type="password" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" v-close-popup color="red" />
        <q-btn flat label="确认" v-close-popup @click="deleteAcc" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="recCode" persistent transition-show="flip-down" transition-hide="flip-up">
    <q-card>
      <q-toolbar>
        <q-toolbar-title>救援代码</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <b>注意：</b>本代码只会显示一次，应妥善保存！
        <h1>{{ rescueCode }}</h1>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="invA" persistent transition-show="flip-down" transition-hide="flip-up">
    <q-card>
      <q-toolbar>
        <q-toolbar-title>邀请码列表</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <b>注意：</b>邀请码将在半小时后过期！
        <br>
        <br>
        <!-- <h1>{{ rescueCode }}</h1> -->
        <div v-for="key in invList" :key="key">
          {{ key }}
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="refreshValidate" persistent transition-show="flip-down" transition-hide="flip-up">
    <q-card>
      <q-toolbar>
        <q-toolbar-title>刷新令牌</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <div>刷新令牌会吊销原先的令牌与UUID，并重新生成一个，使用此功能后会导致客户端要求重新输入密码。<br>如果您已知悉，请点击确认按钮。</div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" v-close-popup color="red" />
        <q-btn flat label="确认" v-close-popup @click="refreshKey" />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script>
import { Cookies, Notify } from 'quasar';
import { api } from 'src/boot/axios';
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: "SettingsPage",
  data() {
    return {
      nickName: JSON.parse(sessionStorage.getItem("userInfomation")).nickName,
      role: JSON.parse(sessionStorage.getItem("userInfomation")).role,
      recCode: ref(false),
      rescueCode: "",
      npwd: ref(""),
      invcodeNum: ref(1),
      invA: ref(false),
      invList: {},
      refreshValidate: ref(false),
      deleteAccValidate: ref(false),
      userName: ref(),
      password: ref()
    }
  },
  methods: {
    getCode() {
      // this.recCode = true
      api.get(this.$yggApi + "/server/users/" + Cookies.get("uuid") + "/rescue-code", {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken")
        }
      }).then(
        (res) => {
          res = res.data
          this.recCode = true;
          this.rescueCode = res.rescueCode
        }
      ).catch(
        (e) => {
          Notify.create({
            type: 'negative',
            message: e.response.data.errorMessage,
          })
          Notify.create({
            type: 'info',
            message: "忘记救援代码？请联系网站管理员",
          })
        }
      )
    },
    changePwd() {
      api.patch(this.$yggApi + "/server/users/" + Cookies.get("uuid"), {
        password: this.npwd
      }, {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken")
        }
      }).then(
        () => {
          Notify.create({
            type: 'positive',
            message: "修改成功！请重新登录！",
            timeout: 3000
          })
          Cookies.remove("accessToken")
          Cookies.remove("uuid")
          this.$router.push("/login")
        }
      ).catch(
        (e) => {
          Notify.create({
            type: 'negative',
            message: "修改失败：" + e.response.data.errorMessage,
          })
        }
      )
    },
    getInviteCode() {
      api.get(this.$yggApi + "/server/inviteCodes?count=" + this.invcodeNum, {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken")
        }
      }).then(
        (res) => {
          this.invList = res.data
          this.invA = true
        }
      )
    },
    refreshKey() {
      api.patch(this.$yggApi + "/server/sessions", {
        accessToken: Cookies.get("accessToken")
      }).then(
        () => {
          Notify.create({
            type: 'positive',
            message: "刷新成功！请重新登录！",
            timeout: 3000
          })
          Cookies.remove("accessToken")
          Cookies.remove("uuid")
          this.$router.push("/login")
        }
      ).catch(
        (e) => {
          Notify.create({
            type: 'negative',
            message: "刷新失败：" + e.response.data.errorMessage,
          })
        }
      )
    },
    deleteAcc() {
      api.delete(this.$yggApi + "/server/users/" + Cookies.get("uuid"), {
          data: {
            username: this.userName,
            password: this.password
          }
      }).then(
        ()=>{
          Notify.create({
            type: 'positive',
            message: "再见！我们期待与你的再次相遇~",
            timeout: 3000
          })
          Cookies.remove("accessToken")
          Cookies.remove("uuid")
          this.$router.push("/login")
        }
      ).catch(
        (e) => {
          Notify.create({
            type: 'negative',
            message: "删除失败：" + e.response.data.errorMessage,
          })
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

h2 {
  font-size: 20px;
  margin: 0;
  padding: 0;
}

.subsetting {
  /* border: 1px solid black; */
  margin: 20px;
  margin-top: 40px;
  padding: 15px;
  border-radius: 15px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, .5);
  background-color: ghostwhite;
}
</style>
