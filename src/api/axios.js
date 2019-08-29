import axios from 'axios'
import qs from 'qs'
import notification from 'ant-design-vue/es/notification'
import router from '@/router/router'

axios.defaults.timeout = 30000

// 请求拦截器
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('ACCESS_TOKEN')
    const companyId = localStorage.getItem('companyId')
    if (token) {
      config.headers['AUTH-TOKEN'] = token
    }
    if (companyId) {
      config.headers['companyId'] = companyId
    }
    return config
  },
  error => {
    return Promise.error(error)
  })

// response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.code === 101) {
      localStorage.clear()
      router.replace('/login')
    }
    if (response.data.code === 102) {
      notification.error({
        message: response.data.msg
      })
    }
    return response
  },
  error => {
    if (error.response) {
      const data = error.response.data
      const token = localStorage.getItem('ACCESS_TOKEN')
      console.log(data)
      if (error.response.status === 403) {
        notification.error({
          message: '登录超时',
          description: data.msg
        })
        router.replace('/exception/403')
        return
      }
      if (error.response.status === 404) {
        notification.error({
          message: '客户端错误',
          description: data.msg
        })
        router.replace('/exception/404')
        return
      }
      if (error.response.status === 500) {
        notification.error({
          message: '服务器请求超时',
          description: '请返回重新登录'
        })
        if (token) {
          // localStorage.removeItem('ACCESS_TOKEN')
          setTimeout(() => {
            router.replace('/exception/500')
          }, 500)
        }
        return
      }
    }
    return Promise.reject(error)
  }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, parameter) {
  return axios({
    url: url,
    method: 'get',
    params: parameter,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * post方法，对应post请求 form-data
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, parameter) {
  return axios({
    url: url,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * delete方法，对应deleted请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function deleted(url, parameter) {
  return axios({
    url: url,
    method: 'delete',
    data: parameter,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * delete方法，对应deleted Json请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function deletedJson(url, parameter) {
  return axios({
    url: url,
    method: 'delete',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
}

/**
 * post方法
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function postJson(url, parameter) {
  return axios({
    url: url,
    method: 'post',
    data: JSON.stringify(parameter),
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
}

/**
 * @description: put方法
 * @param {String} url [请求url地址]
 * @param {Object} parameter [请求时携带的参数]
 * @return: put
 */
export function put(url, parameter) {
  return axios({
    url: url,
    method: 'put',
    data: JSON.stringify(parameter),
    headers: {
      'Content-Type': 'application/json;charset=utf-8 '
    }
  })
}

/**
 * @description: POST
 * @param {String} url [请求url地址]
 * @param {Object} parameter [请求时携带的参数]
 * @return: uploadPost
 */
export function uploadPost(url, parameter) {
  return axios({
    url: url,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
