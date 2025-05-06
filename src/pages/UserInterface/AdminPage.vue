<template>
  <q-page>
    <div class="yggHeader">
      <h1>{{ nickName }} 的 管理页面</h1>
    </div>
    <hr>

    <div>
      <div class="subsetting">
        <h2>管理员：重新启动后端服务</h2>
        <hr><br>
        <div>
          你可以通过此处重启后端服务，但无法得知是否重启成功
        </div>
        <br>

        <q-btn label="重启后端服务" color="red" @click="restartNode" />
      </div>
    </div>

    <div>
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

    <div>
      <div class="subsetting">
        <h2>管理员：获取用户详细数据</h2>
        <hr>
        <q-input v-model="userUUID" label="目标用户 UUID" hint="可以在侧边栏的 用户列表 中查询" />
        <br>
        <q-btn label="获取" color="primary" @click="getUserInfomation" />
      </div>
    </div>

    <div>
      <div class="subsetting">
        <h2>管理员：服务器配置信息</h2>
        <hr>
        <q-input v-model="serverConfig" filled type="textarea" readonly disabled rows="24" />
        <br>
        <center>
          <div style="color: red;">
            暂不支持修改，请前往后台直接修改文件（其实就是我懒了不愿意做）
          </div>
        </center>
      </div>
    </div>

  </q-page>

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

  <q-dialog v-model="userInfo" persistent transition-show="flip-down" transition-hide="flip-up">
    <q-card>
      <q-toolbar>
        <q-toolbar-title>用户信息</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <q-card class="my-card" flat bordered>
          <q-card-section>
            <div class="text-overline text-orange-9">
              UUID
            </div>
            <div class="text-caption text-grey">
              {{ userInfoArr.id }}
            </div>
          </q-card-section>
          <q-card-section>
            <div class="text-overline text-orange-9">
              用户名
            </div>
            <div class="text-caption text-grey">
              {{ userInfoArr.nickName }}
            </div>
          </q-card-section>
          <q-card-section>
            <div class="text-overline text-orange-9">
              邮箱
            </div>
            <div class="text-caption text-grey">
              {{ userInfoArr.username }}
            </div>
          </q-card-section>
          <q-card-section>
            <div class="text-overline text-orange-9">
              角色数量
            </div>
            <div class="text-caption text-grey">
              {{ userInfoArr.profiles.length }} / {{ userInfoArr.maxProfileCount }}
            </div>
          </q-card-section>
          <q-card-section>
            <div class="text-overline text-orange-9">
              注册IP
            </div>
            <div class="text-caption text-grey">
              {{ userInfoArr.regIP }}
            </div>
          </q-card-section>
          <q-card-section>
            <div class="text-overline text-orange-9">
              剩余可生成邀请码数量
            </div>
            <div class="text-caption text-grey">
              {{ userInfoArr.remainingInviteCodeCount }}
            </div>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
  </q-dialog>

</template>

<script setup>
import { Cookies, format, Notify } from 'quasar';
import { api } from 'src/boot/axios';
import { ref } from 'vue';

const nickName = JSON.parse(sessionStorage.getItem("userInfomation")).nickName
const serverConfig = ref("{}")
const invA = ref(false)
const invList = ref()
const invcodeNum = ref(0)
const userUUID = ref("")
const userInfo = ref(false)
const userInfoArr = ref({})

api.get("/server/settings", {
  headers: {
    Authorization: "Bearer " + Cookies.get("accessToken")
  }
}).then(
  (res) => {
    res = res.data
    // serverConfig.value = JSON.parse(res,true)
    serverConfig.value = JSON.stringify(res, null, "\t")
  }
)

function restartNode() {
  api.patch("/server", {
    restart: true
  }, {
    headers: {
      Authorization: "Bearer " + Cookies.get("accessToken")
    }
  }).then(
    () => {
      Notify.create({
        type: 'positive',
        message: "后端服务已重启，页面将会自动刷新！",
        timeout: 3000
      })
      setTimeout(() => {
        location.reload()
      }, 3000)
    }
  )
}

function getInviteCode() {
  api.post("/server/invite-codes?count=" + invcodeNum.value, null, {
    headers: {
      Authorization: "Bearer " + Cookies.get("accessToken")
    }
  }).then(
    (res) => {
      invList.value = res.data
      invA.value = true
    }
  )
}

function getUserInfomation() {
  api.get("/server/users/" + userUUID.value, {
    headers: {
      Authorization: "Bearer " + Cookies.get("accessToken")
    }
  }).then(
    (res) => {
      res = res.data
      userInfoArr.value = res
      userInfo.value = true
    }
  ).catch(
    () => {}
  )
}

;
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