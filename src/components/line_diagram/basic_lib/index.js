import { get } from '@/api/axios.js'
import api from '@/api/index.js'

/**
 * @description: 获取工序列表
 * @param {String} code [工序编码]
 * @param {String} name [工序名称]
 * @return: getProcessList
 */
export function getProcessList(code = '', name = '') {
  this.loading = true
  return get(api.processList + '?code=' + code + '&name=' + name).then((res) => {
    if (res.data.code === 0) {
      this.loading = false
      this.data = []
      res.data.data.forEach(e => {
        this.data.push({
          key: e.id,
          name: e.name
        })
      })
    }
  }).catch(err => {
    console.log(err)
  })
}
