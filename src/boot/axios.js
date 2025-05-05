// src/boot/axios.js

import { boot } from 'quasar/wrappers'
import axios from 'axios'
import qs from 'qs'

const api = axios.create({ baseURL: 'https://api.example.com' })
axios.interceptors.request.use(
	config => {
		if (config.method === 'post') {
			config.data = qs.stringify(config.data)
		}
		return config
	},
	error => {
		Promise.reject(error)
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
