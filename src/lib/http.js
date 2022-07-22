/**
 * HTTP Agent
 */

import instance from './axios'
import ssoWeb from './sso'
import Vue from 'vue'

// Add request interceptor
instance.interceptors.request.use(
  // Do something before request is sent
  config => {
    config.headers = {
      ...config.headers,
      // 后端 MDP 框架接口鉴权要求有此 header
      'x-requested-with': 'XMLHttpRequest',
    }
    return config
  },
  // Do something with request error
  error => {
    return Promise.reject(error)
  },
)

// Add response interceptor
instance.interceptors.response.use(
  // Do something with response data
  response => {
    const DATA = response.data;
    const CODE = DATA.code;
    const FILTER_API_CODE = {
      '/api/v1/m/salary/auth/monitor/alive': [],
      '/api/v1/m/salary/dataset/preview/result': [2, 111], //轮询获取预览结果。111:任务正在执行中
      '/api/v1/m/salary/audit/submit': [],                 //提交数据稽核查询
      '/api/v1/m/salary/audit/detailResult': [],           //数据稽核轮询查询结果
    }
    const REQ_API = response.config.url;
    if ( CODE !== 0 && !filterApiIncludeReqApi(FILTER_API_CODE, REQ_API, CODE) ) {
      if (CODE === 50102) {
        // 50102：ssoid过期需要重新登录
        window.location.href = ssoWeb.getLoginUrl();
      } else {
        // const MSG = DATA.msg || DATA.message;
        // !Vue.prototype.$mtd.confirmVisible && Vue.prototype.$mtd.confirm({
          //   title: '提示',
          //   type: 'warning',
          //   message: `api: ${REQ_API}<br>code: ${DATA.code}<br>message: ${MSG}`,
          //   okButtonText: '我知道了',
          //   dangerouslyUseHTMLString: true
          // })
        exceptionPrompt(response);
      }
      return DATA //不在过滤池中的异常接口返回data
    } else if ( '/api/v1/m/salary/dataset/preview/result' !== REQ_API && filterApiIncludeReqApi(FILTER_API_CODE, REQ_API, CODE) ){
      return response; //过滤池中的接口返回response
    } else {
      return DATA;
    }
    
  },
  // Do something with response error
  error => {
    if (error.response && error.response.status === 401) {
      return (window.location.href = ssoWeb.getLoginUrl())
    }
    return Promise.reject(error)
  },
)

export default instance

function filterApiIncludeReqApi(filterApiCode, reqApi, code) {
  if (!filterApiCode[reqApi]) {
    return false;
  } else {
    if (filterApiCode[reqApi].length === 0) {
      return true;
    } else {
      return filterApiCode[reqApi].includes(code);
    }
  }
}

export function exceptionPrompt(response, exceptionPromptRepeat = false) {
  const DATA = response.data;
  const REQ_API = response.config.url;
  const MSG = DATA.msg || DATA.message;

  if (exceptionPromptRepeat) {
    Vue.prototype.$mtd.confirm({
      title: '提示',
      type: 'warning',
      message: `api: ${REQ_API}<br>code: ${DATA.code}<br>message: ${MSG}`,
      okButtonText: '我知道了',
      dangerouslyUseHTMLString: true
    })
  } else {
    !Vue.prototype.$mtd.confirmVisible && Vue.prototype.$mtd.confirm({
      title: '提示',
      type: 'warning',
      message: `api: ${REQ_API}<br>code: ${DATA.code}<br>message: ${MSG}`,
      okButtonText: '我知道了',
      dangerouslyUseHTMLString: true
    })
  }
  
}