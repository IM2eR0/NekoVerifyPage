import { boot } from 'quasar/wrappers'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({app}) => {
  // something to do
  // app.config.globalProperties.$smartEngin = smartEngin

  const yggLink = "http://localhost:5400"
  app.config.globalProperties.$yggApi = yggLink
  app.config.globalProperties.$pageVersion = "NekoVerify v1.0"
  app.provide('$yggApi', yggLink)
})
