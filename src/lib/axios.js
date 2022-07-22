/**
 * Axios Instance
 */

import axios from 'axios'

/*
 * @see Full config:  https://github.com/axios/axios#request-config
 */
const config = {
  baseURL: process.env.VUE_APP_API_HOST || '',
  timeout: Number(process.env.VUE_APP_HTTP_TIMEOUT), // Timeout
  withCredentials: true, // Check Cross-Site Access-Control
}

const instance = axios.create(config)

export default instance
