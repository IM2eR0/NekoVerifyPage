<template>
  <q-page>

  </q-page>
</template>

<script>
import { ref } from 'vue';
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
    this.getInfomation()
  },
  methods: {
    getInfomation() {
      api.get(this.$yggApi + "/server/profile/" + this.$route.query.id).then(
        () => {}
      ).catch(
        (err) => {
          this.getInfomation()
        }
      )
    }
  }
}
</script>
