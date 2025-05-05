<template>
  <q-page class="flex flex-center">
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
          注册IP：{{ regIP }}
        </div>
        <div>
          已拥有角色数量：{{ Object.keys(profiles).length }}
        </div>

        <h2>
          {{ hitokoto }}
        </h2>

        <br>
        <div>
          本站的 Yggdrasil API 认证服务器地址
        </div>
        <div>
          <i>{{ yggUrl }}</i>
        </div>
        <br>
        快捷添加：

        <!-- <q-btn draggable="true" style="background-color: white;" type="a" :href="yggUrl">
          将此按钮拖至启动器
        </q-btn> -->
        <a class="q-btn authlib" draggable="true" style="background-color: white;" :href="'authlib-injector:yggdrasil-server:'+yggUrl">
          <div>
            将我拖至启动器
          </div>
        </a>

        <br>
        <br>

        <div class="githubs">
          <b><a target="_blank"
            href="https://github.com/IM2eR0/NekoVerifyPage">{{ $pageVersion }}</a></b> &ensp; Made by NekoGan
        </div>
        <div class="githubs">
          <b><a target="_blank"
            href="https://github.com/yige233/nodeYggdrasil">{{ $yggdrasilVersion }}</a></b> &ensp; Made by yige233
        </div>
        <div>
          背景图片来源：Pixiv 105774306_p0
        </div>
    </div>
    <div class="LISTBTN" v-if="!$leftDrawer.stats.value">
      <q-btn flat round icon="mdi-format-list-bulleted" @click="$leftDrawer.toggle()" style="color: white;"/>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { Loading, QSpinnerGrid } from 'quasar';
import { api } from 'src/boot/axios';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    Loading.show({
      spinner: QSpinnerGrid,
      message: '正在加载数据，请稍后...',
    })
  },
  data() {
    return {
      userInfomation: [],
      regTime: '',
      profiles: [],
      hitokoto: '',
      regIP: '',
      yggUrl: /*window.location.protocol + "//" +*/ this.$yggApi + "/yggdrasil"
    }
  },
  beforeMount(){
    this.userInfomation = JSON.parse(sessionStorage.getItem("userInfomation"))
    this.profiles = JSON.parse(sessionStorage.getItem("userProfiles"))
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
    api.get("https://v1.hitokoto.cn/").then(
      (res) => {
        res = res.data
        this.hitokoto = "『" + res.hitokoto + "』" + "——" + (res.from_who || "") + "「" + res.from + "」"
        Loading.hide()
      }
    ).catch(
      () => {
        Loading.hide()
      }
    )

    if (this.userInfomation.regIP == "::1" || this.userInfomation.regIP == "127.0.0.1") {
      this.regIP = "局域网"
    } else {
      this.regIP = this.userInfomation.regIP
    }
  },
  methods: {

  }
});
</script>

<style scoped>
.q-page {
  margin: 0;
  padding: 0;
  background-image: url("../assets/105774306_p0.jpg");
}

.mainbox {
  background-color: rgba(255, 255, 255, .4);
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  text-align: center;
  padding: 50px;
  border-radius: 15px;
  /* border: 2px dotted black; */
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, .5);
  transition: background-color .3s;
}

.mainbox:hover{
  background-color: rgba(255, 255, 255, .6);
}

h1 {
  font-size: 32px;
  margin: 0;
  /* margin-left: 15px; */
}

h2 {
  font-size: 24px;
  margin: 0;
  /* margin-left: 15px; */
}

.authlib{
  border-radius: 3px;
}
.authlib div{
  padding: 0;
  margin: 0;
  padding-top: 2px;
}
.authlib:hover{
  cursor: pointer;
}
.LISTBTN{
  /* background-color: rgba(0, 0, 0, 0) !important; */
  position: fixed;
  left: 5px;
  top: 5px;
}
.githubs a{
  color: blueviolet;
  text-decoration: none;
}
</style>
