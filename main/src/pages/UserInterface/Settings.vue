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
        <!-- <q-input label="旧密码" v-model="opwd" type="password" /> -->
        <q-input label="新密码" v-model="npwd" />
        <!-- <q-input label="再次输入一次新密码" v-model="npwda" type="password" /> -->
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
      <!-- <q-btn label="获取救援代码" color="primary" @click="getCode" /> -->
      因为太危险了所以没做 :p，或许以后会出现呢？
    </div>

    <div v-if="role == 'admin'">

      <!-- <div class="subsetting">
        <h2>管理员：封禁用户</h2>
        <hr><br>
        <div>
          多次封禁时长不叠加。将封禁时长设为0，即可视为解封用户。封禁会强制注销该用户的所有会话。被封禁期间，无法登录、无法删除用户，也不能使用该用户的邀请码注册新用户。
        </div>
        <br>
        <q-input label="用户UUID、角色UUID或角色名称" v-model="npwd" />
        <q-input label="封禁时长(min)" v-model="npwd" />

      </div> -->

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
      invList: {}
    }
  },
  methods: {
    getCode() {
      // this.recCode = true
      api.get(this.$yggApi + "/server/user/" + Cookies.get("uuid") + "/rescueCode", {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken")
        }
      }).then(
        (res) => {
          res = res.data
          // console.log(res);
          this.recCode = true;
          this.rescueCode = res.rescueCode
        }
      ).catch(
        () => {
          Notify.create({
            type: 'negative',
            message: "你已经有一个救援代码了！在使用之前无法获取新的救援代码！",
          })
          Notify.create({
            type: 'info',
            message: "忘记救援代码？请联系网站管理员",
          })
        }
      )
    },
    changePwd() {
      api.patch(this.$yggApi + "/server/user/" + Cookies.get("uuid"), {
        data: {
          nickName: "",
          password: this.npwd,
          username: ""
        },
        operation: "modify"
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
        () => {
          Notify.create({
            type: 'negative',
            message: "修改失败：新旧密码不能相同！",
          })
        }
      )
    },
    getInviteCode(){
      api.get(this.$yggApi + "/server/inviteCodes?count=" + this.invcodeNum,{
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken")
        }
      }).then(
        (res) => {
          this.invList = res.data
          this.invA = true
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
