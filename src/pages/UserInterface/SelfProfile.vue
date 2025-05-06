<template>
  <q-page>
    <div class="yggHeader">
      <h1>{{ nickName }} 的 个人信息</h1>
    </div>
    <div>
      请牢记此处的信息，<b>管理员为你提供服务</b> 或 <b>日后自行通过救援码重置密码</b> 时均需此处信息。
    </div>
    <hr>
    <q-card class="my-card" flat bordered>
      <q-card-section>
        <div class="text-overline text-orange-9">
          <h5>UUID</h5>
        </div>
        <div class="text-caption text-grey">
          {{ myProfile.id }}
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { Cookies } from 'quasar';
import { api } from 'src/boot/axios';
import { ref } from 'vue';

const nickName = JSON.parse(sessionStorage.getItem("userInfomation")).nickName
const myProfile = ref({})

api.get("/server/users?user=" + Cookies.get("uuid")).then(
  (res) => {
    res = res.data
    myProfile.value = res
  }
)
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

h5 {
  font-size: 20px;
  margin: 0;
  padding: 0;
}

.q-card{
  margin-bottom: 15px;
}
</style>