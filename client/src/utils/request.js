import axios from 'axios'
import { Message } from '@arco-design/web-vue'
import config from '@/config/api'

const instance = axios.create({
  baseURL: config.BASE_URL
})

instance.interceptors.response.use(response => {
  return response.data
}, function (error) {
  Message.error(error.response.data.message || error.message)
  return Promise.reject(error)
})

export default instance