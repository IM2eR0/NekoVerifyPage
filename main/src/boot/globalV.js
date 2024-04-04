import { boot } from 'quasar/wrappers'
export default boot(async ({app}) => {

  // 请修改此项为你的后端地址
  // 如果你使用前后一体，请修改此项为后端显示的地址或反代地址
  const yggLink = "http://gmod.ltd:54030"

  app.config.globalProperties.$yggApi = yggLink

  // 版本号，勿动
  app.config.globalProperties.$pageVersion = "NekoVerify v1.0"
  app.provide('$yggApi', yggLink)
  app.provide('$router', app.config.globalProperties.$router)

})
