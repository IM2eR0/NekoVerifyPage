<template>
  <div class="profile-card">
    <div class="name">
      {{ name }}
    </div>
    <hr>
    <div>
      角色ID：{{ id }}
    </div>
    <br>
    <div>

      <q-btn color="primary">
        修改角色
      </q-btn>

      &ensp;

      <q-btn color="red" @click="del = true">
        删除角色
      </q-btn>

    </div>
  </div>

  <q-dialog v-model="del">
    <q-card>
      <q-card-section>
        <div class="text-h6">警告</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        你真的要删除这个角色吗？<br>
        <b>{{ name }}</b> 将会永久失去！（真的很久！）
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="确认" color="primary" v-close-popup @click="delprofile(id)" />
        <q-btn flat label="取消" v-close-popup color="red" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { api } from 'src/boot/axios';
import { defineComponent, ref } from 'vue';
import { Cookies, Notify } from 'quasar';

export default defineComponent({
  name: "ProfileCard",
  data() {
    return {
      del: ref(false)
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
    }
  },
  methods: {
    delprofile(id) {
      // console.log(id);
      api.delete(this.$yggApi + "/server/profile/" + id, {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken")
        }
      }).then(
        () => {
          location.reload()
        }
      )
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
