<template>
  <q-page class="flex flex-center">
    <q-btn @click="logout">登出</q-btn>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { Cookies, Notify } from 'quasar';

export default defineComponent({
  name: 'IndexPage',
  data(){
    return{
      webTitle: ""
    }
  },
  methods:{
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
});
</script>

<style scoped>
h1{
  font-size: 32px;
}
</style>
