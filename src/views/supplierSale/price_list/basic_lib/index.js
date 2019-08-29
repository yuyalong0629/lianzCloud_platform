import api from 'api/index'
import { get } from 'api/axios'

/**
 * @description: 渠道商查看所有客户列表
 * @param {String} currentPage [页码]
 * @param {String} pageSize [每页条数]
 * @return: getListCompanyCusts
 */
export function getListCompanyCusts(number, custName = '', orderNum = '') {
  return get(api.getTransactionCust + `?currentPage=${number}&custName=${custName}&orderNum=${orderNum}&pageSize=20`).catch(err => {
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
    get(api.getTransactionCust + `?currentPage=1&custName=${value}&orderNum=''&pageSize=20`)
      .then((res) => {
        if (currentValue === value) {
          const data = []
          data.push(...res.data.data.records)
          callback(data)
        }
      })
  }
  timeout = setTimeout(fake, 300)
}

/**
 * @description: 列表商家所有商品基本信息 getListCompanyBasicPage
 * @param {Object} params [params]
 * @param {Number} currentPage [分页查询的第几页]
 * @param {Number} pageSize [分页查询每页多少条数据]
 * @param {Number} custId [搜索公司哪个客户定制的商品custId为0搜索的都是商家标准品custId>0搜索客户订制品]
 * @param {String} name [undefined]
 * @return: searchGoods
 */
export function searchGoods(currentPage, pageSize, custId) {
  this.loading = true
  return get(api.getListHitoryChanelInfo + `?currentPage=${currentPage}&pageSize=${pageSize}&custId=${custId}&name=`).then(res => {
    if (res.data.code === 0) {
      this.loading = false
      this.data = []
      this.pagination.total = +res.data.data.total
      if (res.data.data.records.length) {
        const factoryName = []
        const modifyTime = []
        res.data.data.records.forEach(e => {
          if (e.sfpMap) {
            for (const key in e.sfpMap) {
              factoryName.push(e.sfpMap[key][0].sellerName)
              modifyTime.push(e.sfpMap[key][0].createTime)
            }
          }
          this.data.push({
            key: e.id,
            name: e.name,
            versionCode: e.versionCode,
            price: e.price,
            creatorTime: e.scplist && e.scplist[0].createTime,
            factoryName: factoryName,
            modifyTime: modifyTime
          })
        })
      }
      return
    }
    this.loading = false
  }).catch(err => {
    console.log(err)
    this.loading = false
  })
}
