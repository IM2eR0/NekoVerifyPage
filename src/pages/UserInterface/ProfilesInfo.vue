<template>
  <q-page>

  </q-page>
</template>

<script>
import { ref } from 'vue';
import { Cookies, Loading, QSpinnerGrid } from 'quasar';
import { api } from 'src/boot/axios';

export default {
  name: "ProfileInfo",
  data() {
    return {
      profileId: ref("")
    }
  },
  mounted() {
    this.profileId = this.$route.query.id
    Loading.show({
      pinner: QSpinnerGrid,
      message: '正在加载数据，请稍后...',
    })
    this.getInfomation()
  },
  methods: {
    getInfomation() {
      api.get(this.$yggApi + "/server/profile/" + this.$route.query.id).then(
        (res) => {
          Loading.hide()
        }
      ).catch(
        (err) => {
          this.getInfomation()
        }
      )
    }
  }
}
</script>
