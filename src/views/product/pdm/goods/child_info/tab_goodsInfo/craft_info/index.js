import { get } from '@/api/axios.js'
import api from '@/api/index.js'

/**
 * @description: 获取工序列表
 * @param {String} code [工序编码]
 * @param {String} name [工序名称]
 * @return: getProcessList
 */
export function getCraftLineList(code = '', name = '') {
  this.loading = true
  return get(api.craftLineList + '?code=' + code + '&name=' + name).then((res) => {
    if (res.data.code === 0) {
      this.loading = false
      this.data = []
      res.data.data.forEach(e => {
        console.log(e)
        this.data.push({
          key: e.id,
          code: e.groupCode,
          name: e.name
        })
        console.log(this.data)
      })
    }
  }).catch(err => {
    console.log(err)
  })
}

/**
 * @description: 工艺详情
 * @param {String} ID [工艺ID]™¡
 * @return: craftLineInfo
 */
export function craftLineInfo(params) {
  return get(api.craftLineInfo + params).then(res => {
    if (res.data.code === 0) {
      this.getList = []
      if (res.data.data.map || res.data.data.craftProcessIds) {
        // 序列化所有工序对象Tab列表
        for (const item in res.data.data.map) {
          this.newData.push(res.data.data.map[item])
        }
        // 通过工艺ID获取所对应的工序对象
        res.data.data.craftProcessIds.split(',').forEach(e => {
          const getCraftProcessIds = this.newData.filter(i => {
            return i.id === e
          })[0]
          this.getList.push(getCraftProcessIds)
          // console.log(this.getList)
        })
      }
    }
  }).catch(err => {
    console.log(err)
  })
}
