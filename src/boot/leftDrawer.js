import { ref } from "vue";

export default{
  stats: ref(false),
  toggle () {
    this.stats.value = !this.stats.value
  }
}
