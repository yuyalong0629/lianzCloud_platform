import { postJson } from '@/api/axios.js'
import api from '@/api/index.js'

/**
 * @description: 查看渠道商的原材料列表
 * @param {type}
 * @return: bomSearch
 */
export function bomSearch(num) {
  return postJson(api.bomearch, {
    'currentPage': num,
    'companyId': localStorage.getItem('companyId'),
    'pageSize': 20
  }).catch(err => {
    console.log(err)
  })
}
