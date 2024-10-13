import { boot } from 'quasar/wrappers'
import leftDrawer from './leftDrawer'
export default boot(async ({ app }) => {

  // 请修改此项为你的后端地址
  // 如果你使用前后一体，请修改此项为后端显示的地址或反代地址
  // const yggLink = "https://yggdrasil.nekogan.com"
  const yggLink = "http://111.173.82.25:8800"


  app.config.globalProperties.$yggApi = yggLink

  // 版本号，勿动
  app.config.globalProperties.$pageVersion = "NekoVerify v1.2 - hotfix1"
  app.provide('$yggApi', yggLink)
  app.provide('$router', app.config.globalProperties.$router)

  app.config.globalProperties.$leftDrawer = leftDrawer
})
