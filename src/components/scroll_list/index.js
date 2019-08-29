import api from 'api/index'
import { get } from 'api/axios'

/**
 * @description: 渠道商查看所有客户列表
 * @param {String} currentPage [页码]
 * @param {String} pageSize [每页条数]
 * @return: getListCompanyCusts
 */
export function getListCompanyCusts(number) {
  return get(api.getListCompanyCusts + `?currentPage=${number}&pageSize=20`).catch(err => {
    console.log(err)
  })
}

/**
 * @description: 客户名称模糊搜索
 * @param {String} value [监听选中的值]
 * @param {Function} callback [回调]
 * @return: custNamefetch
 */
let timeout
let currentValue
export function custNamefetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value
  function fake() {
    // get(api.listCustomerNames + `?custName=${value}`)
    get(api.getlistCustShortNames + `?custShortName=${value}`)
      .then((res) => {
        if (currentValue === value) {
          const data = []
          data.push(...res.data.data)
          callback(data)
        }
      })
  }
  timeout = setTimeout(fake, 300)
}
