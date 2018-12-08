import axios from 'axios'
import config from '../config/main'
import interceptors from './interceptors'

export default () => {
  const axiosInstance = axios.create({
    baseURL: config.apiAddress,
    withCredentials: false,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': $nuxt.$store.state.auth.token
    }
  })

  interceptors.setup(axiosInstance)

  return axiosInstance
}
