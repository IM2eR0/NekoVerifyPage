<template>
  <q-page>
    <div class="mainbox">
      <h1 v-if="userInfomation.role == 'admin'">
        你正在作为管理员登录！{{ userInfomation.nickName }} ~
      </h1>
      <h1 v-else>
        喝杯茶吧！{{ userInfomation.nickName }} ~
      </h1>

      <div>
        注册时间：{{ regTime }}
      </div>
      <div>
        已拥有角色数量：{{ userInfomation.profiles }}
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { Cookies, Notify } from 'quasar';
import { api } from 'src/boot/axios';

export default defineComponent({
  name: 'IndexPage',
  data() {
    return {
      userInfomation: JSON.parse(sessionStorage.getItem("userInfomation") || "{}"),
      regTime: '',
    }
  },
  beforeMount() {
    if (!sessionStorage.getItem("userInfomation")) {
      api.get(this.$yggApi + "/server/user/" + Cookies.get("uuid"),{
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken")
        }
      })
        .then(
          (res) => {
            res = res["data"]
            sessionStorage.setItem("userInfomation", JSON.stringify(res))
            this.userInfomation = res
          }
        )
    }
  },
  mounted() {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    this.regTime = Intl.DateTimeFormat('zh-CN', options).format(this.userInfomation.regTime);
    console.log(this.userInfomation)

  },
  methods: {

  }
});
</script>

<style scoped>
.mainbox {
  padding-left: 20px;
  padding-right: 20px;
}

h1 {
  font-size: 32px;
  margin: 0;
  /* margin-left: 15px; */
}
</style>
