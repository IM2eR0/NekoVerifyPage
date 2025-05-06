<template>
  <q-page>
    <div class="q-pa-md">
    <q-table
      title="用户列表"
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </div>
  </q-page>
</template>

<script setup>
import { Cookies } from 'quasar';
import { api } from 'src/boot/axios';
import { ref } from 'vue';

const columns = [
  {
    name: 'name',
    required: true,
    label: '用户名',
    align: 'left',
    field: row => row.nickName,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'role', align: 'left', label: '用户组', field: 'role', sortable: true },
  { name: 'regTime', align: 'left', label: '注册时间', field: 'regTime', sortable: true },
  { name: 'id', align: 'left', label: 'UUID', field: 'id' }
]

const rows = ref([])

api.get("/server/users?after=1&count=100",{
  headers: {
    Authorization: "Bearer " + Cookies.get("accessToken")
  }
}).then(
  (res) => {
    res = res.data
    for (let key in res){
      rows.value.push(res[key])
    }
  }
)
;
</script>

<style scoped>
.q-page {
  padding: 15px;
}
</style>