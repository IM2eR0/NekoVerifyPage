import { boot } from 'quasar/wrappers'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({app}) => {
  // something to do
  // app.config.globalProperties.$smartEngin = smartEngin

  app.config.globalProperties.$yggApi = "http://localhost:5400"
  app.config.globalProperties.$pageVersion = "NekoVerify v1.0"

})
