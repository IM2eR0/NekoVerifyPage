<template>
  <div class="profile-card">
    <div class="name">
      <center @click="showControl = true">{{ name }}</center>
    </div>
    <hr>
    <center>
      <div>
        <canvas ref="skin_container"></canvas>
      </div>
    </center>
  </div>
  <q-dialog v-model="showControl" persistent>
    <q-card>
      <q-bar>
        <div>{{ name }} 的详细设置</div>

        <q-space />

        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip>关闭</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <center>
          <q-btn color="primary" @click="changename = true">
            修改角色名
          </q-btn>
          <br><br>
          <q-btn color="primary" @click="changeskin = true">
            修改皮肤
          </q-btn>
          <br><br>
          <q-btn color="red" @click="del = true">
            删除角色
          </q-btn>
        </center>
      </q-card-section>

    </q-card>
  </q-dialog>
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
          <q-tab name="手动上传">手动上传</q-tab>
          <q-tab name="正版">从正版账号</q-tab>
          <q-tab name="LS">从LittleSkin</q-tab>
          <q-tab name="DEL">删除皮肤</q-tab>
        </q-tabs>
        <br>
        <template v-if="skinform == '手动上传'">
          <q-select outlined v-model="skintype" :options="skintypeopti" label="材质类型" />
          <q-file v-model="skinfile" label="点击上传文件" accept=".png" max-file-size="5120" hint="仅支持png文件，大小需要控制在5kb以内" />

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
          <div>
            “材质id”指的是littleSkin皮肤站的材质页面url结尾的那串数字。例如：https://littleskin.cn/skinlib/show/2713，则其材质id为2713。需要材质公开可见；服务器会检查其材质类型。
          </div>
          <br>
          <q-card-actions align="center">
            <q-btn flat label="确认" color="primary" v-close-popup @click="fromLS(id)" />
          </q-card-actions>
        </template>

        <template v-if="skinform == 'DEL'">
          <q-select outlined v-model="skindel" :options="skindelopt" label="材质类型" />

          <q-card-actions align="center">
            <q-btn flat label="确认" color="primary" v-close-popup @click="delSkin(id)"/>
          </q-card-actions>
        </template>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { api } from 'src/boot/axios';
import { defineComponent, ref } from 'vue';
import { Cookies, Notify } from 'quasar';

export default defineComponent({
  name: "ProfileCard",
  data() {
    return {
      showControl: ref(false),
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
      api.delete(this.$yggApi + "/server/profiles/" + id, {
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
      api.patch("/server/profiles/" + id, {
        name: this.newname
      }, {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken")
        }
      }).then(
        () => {
          location.reload()
        }
      ).catch(
        () => {}
      )
    },
    uploadskin(id) {
      api.put(this.$yggApi + "/server/profiles/" + id + "/textures/skin", this.skinfile, {
        headers: {
          "Content-Type": "image/png",
          "x-skin-model": this.skintype,
          "Authorization": "Bearer " + Cookies.get("accessToken")
        }
      }).then(
        () => {
          location.reload()
        }
      ).catch(
        (err) => {}
      )
    },
    fromMojang(id) {
      api.patch(this.$yggApi + "/server/profiles/" + id + "/textures?operation=copyFromOfficial", {
        profileName: this.mojang
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
    fromLS(id) {
      api.patch(this.$yggApi + "/server/profiles/" + id + "/textures?operation=importFromLittleskin", {
        littleskinTid: this.littleSkin
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
    delSkin(id) {
      let stype
      if (this.skindel == "皮肤") {
        stype = "skin"
      }
      if (this.skindel == "披风") {
        stype = "cape"
      }
      if (this.skindel == "全部") {
        stype = "all"
      }
      api.delete(this.$yggApi + "/server/profiles/" + id + "/textures/" + stype, {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken")
        }
      }).then(
        () => {
          setTimeout(
            () => {
              location.reload()
            }, 1000
          )
        }
      )
    }
  },
  mounted() {
    let skinViewer = new skinview3d.SkinViewer({
      canvas: this.$refs["skin_container"],
      width: 150,
      height: 250,
    })

    api.get(this.$yggApi + "/server/profiles/" + this.id).then(
      (res) => {
        var infomation = res.data
        var skinUrl = JSON.parse(window.atob(infomation.properties[0].value)).textures.SKIN.url ? JSON.parse(window.atob(infomation.properties[0].value)).textures.SKIN.url : ""
        skinViewer.loadSkin(skinUrl)

      }
    )
  }
});
</script>

<style scoped>
.profile-card {
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, .5);
  padding: 15px;
  border-radius: 15px;
  width: 340px;
  height: 340px;
  transition: all .3s;
}

.profile-card .name {
  font-size: 20px;
}

.profile-card:hover {
  scale: 1.1;
  background-color: rgb(243, 243, 243);
  cursor: pointer;
}
</style>
