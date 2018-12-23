import axios from 'axios'
import interceptors from './interceptors'

export default () => {
  const axiosInstance = axios.create({
    baseURL: process.env.apiAddress,
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
