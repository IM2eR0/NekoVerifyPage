// src/boot/axios.js

import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { yggLink } from './globalV'
import { Loading, Notify, QSpinnerGears } from 'quasar'

const api = axios.create({ baseURL: yggLink })
api.interceptors.request.use(
	config => {
    Loading.show({
      spinner: QSpinnerGears,
      html: true,
      message: '正在与后端服务通信中...<br>(如果加载时间过长请刷新页面)'
    })
		return config
	},
	error => {
		Promise.reject(error)
	}
)

api.interceptors.response.use(
  response => {
    Loading.hide();
    return response;
  },
  err => {
    Loading.hide();
    Notify.create({
      type: 'negative',
      message: err.response.data.errorMessage || "未知错误",
    })
    Promise.reject(err)
  }
)

export default boot(({ app }) => {
  // 通过this.$axios和this.$API在Vue文件（Options API）内使用

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ 这将允许你使用this.$axios（Vue Options API形式）
  //       所以你不需要在每个vue文件中导入axios

  app.config.globalProperties.$api = api
  // ^ ^ ^ 这将允许您使用this.$api（Vue Options API形式）
  //       这样您就可以轻松地根据应用程序的api执行请求
})

export { axios, api }
