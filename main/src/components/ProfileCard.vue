<template>
  <div class="profile-card">
    <div class="name">
      {{ name }}
    </div>
    <hr>
    <div>
      角色ID：{{ id }}
    </div>
    <div>
      使用皮肤：
      <img v-if="this.skinused" :src="this.skinused.url" />
      <span v-else>
        未上传皮肤
      </span>
    </div>
    <br>
    <br>
    <center>

      <q-btn color="primary" @click="changename = true">
        修改角色名
      </q-btn>

      &ensp;

      <q-btn color="primary" @click="changeskin = true">
        修改皮肤
      </q-btn>

      &ensp;

      <q-btn color="red" @click="del = true">
        删除角色
      </q-btn>

    </center>
  </div>

  <q-dialog v-model="del">
    <q-card>
      <q-card-section>
        <div class="text-h6">警告</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <center>
          你真的要删除这个角色吗？<br>
          <b>{{ name }}</b> 将会永久失去！（真的很久！）
        </center>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="确认" color="primary" v-close-popup @click="delprofile(id)" />
        <q-btn flat label="取消" v-close-popup color="red" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="changename">
    <q-card>
      <q-card-section>
        <div class="text-h6">修改用户名</div>
      </q-card-section>

      <q-card-section class="qt-none">
        <q-input label="新的角色名" v-model="newname"></q-input>
        <br>
        <div>即你的新游戏内ID。由于本角色的UUID不变，所以游戏不会将其作为新玩家对待。</div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="确认" color="primary" v-close-popup @click="cpname(id)" />
        <q-btn flat label="取消" v-close-popup color="red" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="changeskin">
    <q-card>
      <q-toolbar>
        <q-toolbar-title>修改皮肤</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section class="qt-none">
        <q-tabs v-model="skinform" active-color="primary">
          <!-- 手动上传后端有防跨域处理，故只有前后端一体部署的时候方可使用 -->
          <q-tab name="手动上传" v-if="$yggApi == hosts">手动上传</q-tab>
          <q-tab name="正版">从正版账号</q-tab>
          <q-tab name="LS">从LittleSkin</q-tab>
          <q-tab name="DEL">删除皮肤</q-tab>
        </q-tabs>
        <br>
        <!-- {{ skinform }} -->
        <template v-if="skinform == '手动上传'">
          <q-select outlined v-model="skintype" :options="skintypeopti" label="材质类型" />
          <q-file v-model="skinfile" label="点击上传文件" accept=".png" />

          <q-card-actions align="center">
            <q-btn flat label="确认" color="primary" v-close-popup @click="uploadskin(id)" />
          </q-card-actions>
        </template>
        <template v-if="skinform == '正版'">
          <q-input label="正版账户用户名" v-model="mojang"></q-input>
          <br>
          <q-card-actions align="center">
            <q-btn flat label="确认" color="primary" v-close-popup @click="fromMojang(id)" />
          </q-card-actions>
        </template>
        <template v-if="skinform == 'LS'">
          <q-input label="LittleSkin材质ID" v-model="littleSkin"></q-input>
          <br>
          <div>“材质id”指的是littleSkin皮肤站的材质页面url结尾的那串数字。例如：https://littleskin.cn/skinlib/show/2713，则其材质id为2713。需要材质公开可见；服务器会检查其材质类型。</div>
          <br>
          <q-card-actions align="center">
            <q-btn flat label="确认" color="primary" v-close-popup @click="fromLS(id)" />
          </q-card-actions>
        </template>

        <template v-if="skinform == 'DEL'">
          <q-select outlined v-model="skindel" :options="skindelopt" label="材质类型" />

          <q-card-actions align="center">
            <q-btn flat label="确认" color="primary" v-close-popup @click="delSkin(id)" />
          </q-card-actions>
        </template>
      </q-card-section>
    </q-card>
  </q-dialog>

</template>

<script>
import { api } from 'src/boot/axios';
import { defineComponent, ref } from 'vue';
import { Cookies, Notify, Loading, QSpinnerGrid } from 'quasar';

export default defineComponent({
  name: "ProfileCard",
  data() {
    return {
      hosts: window.location.protocol + '//' + window.location.host,
      del: ref(false),
      changename: ref(false),
      newname: ref(""),
      changeskin: ref(false),
      skinform: ref("正版"),
      skintypeopti: [
        "default", "slim"
      ],
      skintype: ref("default"),
      skinfile: ref(null),
      mojang: ref(""),
      littleSkin: ref(""),
      textinfo: JSON.parse(window.atob(this.texture)),
      skinused: "",
      skindelopt: [
        // "skin", "cape", "all"
        "皮肤", "披风", "全部"
      ],
      skindel: ref("皮肤")
    }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    texture: {
      type: String,
      default: "eyJ0aW1lc3RhbXAiOjE3MTIxODg4NTUwNDEsInByb2ZpbGVJZCI6ImFhMmM0ZTMzNGM0YzNkZTc5NzZhOTliNGZlZDRmOWJhIiwicHJvZmlsZU5hbWUiOiJOZWtvR2FuIiwidGV4dHVyZXMiOnt9fQ=="
    }
  },
  methods: {
    delprofile(id) {
      api.delete(this.$yggApi + "/server/profile/" + id, {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken")
        }
      }).then(
        () => {
          location.reload()
        }
      )
    },
    cpname(id) {
      if (this.newname == "") {
        return Notify.create({
          type: 'negative',
          message: "请输入有效的用户名！",
        })
      }
      api.patch(this.$yggApi + "/server/profile/" + id, {
        name: this.newname,
        texture: {
          type: "none",
          data: {
            capeVisible: true,
            littleskinTid: "",
            profileName: "",
            type: "skin"
          }
        }
      }, {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken")
        }
      }).then(
        () => {
          location.reload()
        }
      ).catch(
        () => {
          Notify.create({
            type: 'negative',
            message: "该用户名已存在：" + this.newname,
          })
        }
      )
    },
    uploadskin(id){
      // console.log(this.skinfile)
      api.put(this.$yggApi + "/server/profile/" + id +"/skin",this.skinfile,{
        headers: {
          "Content-Type": this.skinfile.type,
          "x-skin-model": this.skintype,
          "Authorization": "Bearer " + Cookies.get("accessToken")
        }
      }).then(
        () => {
          location.reload()
        }
      ).catch(
        () => {
          Notify.create({
            type: 'negative',
            message: "上传失败，请联系网站管理员",
          })
        }
      )
    },
    fromMojang(id){
      Loading.show({
        spinner: QSpinnerGrid,
        message: '正在与服务器通信，请稍后...',
      })
      api.patch(this.$yggApi + "/server/profile/" + id, {
        name: "",
        texture: {
          type: "mojang",
          data: {
            capeVisible: true,
            littleskinTid: "",
            profileName: this.mojang,
            type: "skin"
          }
        }
      }, {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken")
        }
      }).then(
        () => {
          location.reload()
        }
      )
    },
    fromLS(id){
      Loading.show({
        spinner: QSpinnerGrid,
        message: '正在与服务器通信，请稍后...',
      })
      api.patch(this.$yggApi + "/server/profile/" + id, {
        name: "",
        texture: {
          type: "littleskin",
          data: {
            capeVisible: true,
            littleskinTid: this.littleSkin,
            profileName: "",
            type: "skin"
          }
        }
      }, {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken")
        }
      }).then(
        () => {
          location.reload()
        }
      )
    },
    delSkin(id){
      Loading.show({
        spinner: QSpinnerGrid,
        message: '正在与服务器通信，请稍后...',
      })
      let stype
      if(this.skindel == "皮肤"){
        stype = "skin"
      }
      if(this.skindel == "披风"){
        stype = "cape"
      }
      if(this.skindel == "全部"){
        stype = "all"
      }
      api.patch(this.$yggApi + "/server/profile/" + id, {
        name: "",
        texture: {
          type: "delete",
          data: {
            capeVisible: true,
            littleskinTid: "",
            profileName: "",
            type: stype
          }
        }
      }, {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken")
        }
      }).then(
        () => {
          setTimeout(
            ()=>{
              location.reload()
            },1000
          )
        }
      )
    }
  },
  mounted() {
    if (Object.keys(this.textinfo.textures).length != 0) {
      this.skinused = this.textinfo.textures.SKIN
    }
  }
});
</script>

<style scoped>
.profile-card {
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, .5);
  padding: 15px;
  border-radius: 15px;
  width: 340px;
  height: 260px;
}

.profile-card .name {
  font-size: 20px;
}
</style>
