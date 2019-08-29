import api from 'api/index'
import { postJson, get, deleted, put } from 'api/axios'
import Bus from '@/Bus.js'
import { Alert } from 'ant-design-vue'

/**
 * @description: 成品列表商品搜索Tab列表
 * @param {Object} params [params]
 * @param {Number} currentPage [分页查询的第几页]
 * @param {Number} pageSize [分页查询每页多少条数据]
 * @param {Number} custId [搜索公司哪个客户定制的商品custId为0搜索的都是商家标准品custId>0搜索客户订制品]
 * @param {Array} keywords [关键词(产品名称，产品规格)]
 * @param {String} skuCode [产品编码]
 * @param {String} skuType [产品类别（弹簧、原材料、其他等）]
 * @param {String} catIds [商品所属分类]
 * @param {String} springType [弹簧类型]
 * @return: searchGoods
 */
export function searchGoods({ pageSize = 15, currentPage = 1, custId = 0, keywords, skuCode, springType }) {
  this.loading = true
  return postJson(api.searchGoods, { pageSize, currentPage, custId, keywords, skuCode, springType }).then(res => {
    if (res.data.code === 0) {
      this.loading = false
      this.data = []
      this.pagination.total = +res.data.data.total
      res.data.data.records.forEach(e => {
        this.data.push({
          key: e.sku.id,
          id: e.sku.id,
          code: e.sku.code,
          name: e.sku.name,
          time: e.sku.createTime,
          remark: e.sku.remark,
          spec: e.sku.spec,
          cz: e.sku.cz,
          status: e.sku.status === 'NORMAL' ? '正常' : (e.sku.status === 'NORMAL' ? '停用' : '禁用')
        })
      })
      return
    }
    this.loading = false
  }).catch(err => {
    console.log(err)
    this.loading = false
  })
}

/**
 * @description: 查看详情
 * @param {String} params [skuid]
 * @return: viewInfo
 */
export function getViewInfo(params) {
  return get(api.goodsView + `?skuId=${params}`).then(res => {
    if (res.data.code === 0) {
      // console.log(res.data.data)
      this.goodsViewInfo = res.data.data
    }
  }).catch(err => {
    console.log(err)
  })
}

/**
 * @description: 产品编码模糊搜索
 * @param {Number} currentPage [页码]
 * @param {String} name [名称]
 * @param {Number} pageSize [每页条数]
 * @return: listCompanyGoodsName
 */
export function listCompanyGoodsCode(number) {
  return get(api.listCompanyGoodsCode + `?currentPage=${number}&pageSize=10`).then(res => {
    const data = this.selectCodeData
    if (res.data.code === 0) {
      this.selectCodeData = data.concat(res.data.data.records).filter(item => {
        return item !== null
      })
      // console.log(this.selectCodeData)
    }
  }).catch(err => {
    console.log(err)
  })
}

/**
 * @description: 产品名称模糊搜索
 * @param {Number} currentPage [页码]
 * @param {String} name [名称]
 * @param {Number} pageSize [每页条数]
 * @return: listCompanyGoodsName
 */
export function listCompanyGoodsName(num) {
  return get(api.listCompanyGoodsName + `?currentPage=${num}&pageSize=10`).then(res => {
    const data = this.selectData
    if (res.data.code === 0) {
      this.selectData = data.concat(res.data.data.records).filter(item => {
        return item !== null
      })
      // console.log(this.selectData)
    }
  }).catch(err => {
    console.log(err)
  })
}

/**
 * @description: 获取成品分类
 * @param {Objecg} null
 * @return: getGoodsClass
 */
export function getGoodsClass() {
  return get(api.categoryList).then(res => {
    if (res.data.code === 0) {
      this.options = res.data.data
    }
  }).catch(err => {
    console.log(err)
  })
}

/**
 * @description: 获取商品分类所有属性和可选项
 * @param {Object}  params [属性ID]
 * @return: getClassAttr
 */
export function getClassAttr(params) {
  return get(api.catAllAttrAndOptions + '?catId=' + params).catch(err => {
    console.log(err)
  })
}

/**
 * @description: 商家添加原材料
 * @param {Object} params [产品添加Obj]
 * @return: goodsMaterialAdd
 */
export function goodsSkuAdd(params) {
  return postJson(api.goodsSkuAdd, params).then(res => {
    if (res.data.code === 0) {
      this.loading = false
      this.$message.success('添加成功')
      // this.$emit('isDrawer', false)
      // Bus.$emit('active', '3')
      this.setSkuId = res.data.data.id
      return false
    }
    this.$message.error(res.data.msg)
    this.$emit('isDrawer', true)
    this.loading = false
  }).catch(err => {
    console.log(err)
  })
}

/**
 * @description: 渠道商商品删除
 * @param {params} 客户ID
 * @return: removeCustomer
 */
export function bomDelete(params) {
  return deleted(api.bomDelete + `?skuIds=${params}`).then((res) => {
    if (res.data.code === 0) {
      this.loading = false
      this.$message.success('删除成功')
      this.$emit('isDrawer', false)
      return false
    }
    this.loading = false
    this.$message.success(res.data.msg)
    this.$emit('isDrawer', true)
  }).catch((err) => {
    console.log(err)
    this.$message.error('请求错误')
    this.loading = false
  })
}

/**
 * @description: 商家修改产品
 * @param {Object} params [产品添加Obj]
 * @return: goodsMaterialAdd
 */
export function goodsSkuUpload(params) {
  return put(api.goodsUpdate, params).then(res => {
    if (res.data.code === 0) {
      this.loading = false
      this.$message.success(res.data.data)
      // this.$emit('isDrawer', false)
      // Bus.$emit('active', '3')
      return false
    }
    this.$message.error(res.data.msg)
    this.$emit('isDrawer', true)
    this.loading = false
  }).catch(err => {
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
export function goodsCodefetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value
  console.log(currentValue)
  function fake() {
    get(api.listCompanyGoodsCode + `?code=${value}&currentPage=1&pageSize=50`)
      .then((res) => {
        console.log(res)
        if (currentValue === value) {
          const data = []
          data.push(...res.data.data.records)
          console.log(data)
          callback(data)
        }
      })
  }
  timeout = setTimeout(fake, 300)
}

/**
 * @description: 产品名称模糊搜索
 * @param {Number} currentPage [页码]
 * @param {String} name [名称]
 * @param {Number} pageSize [每页条数]
 * @return: listCompanyGoodsName
 */
export function goodsNamefetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value
  // console.log(currentValue)
  function fake() {
    get(api.listCompanyGoodsName + `?name=${value}&currentPage=1&pageSize=50`)
      .then((res) => {
        // console.log(res)
        if (currentValue === value) {
          const data = []
          data.push(...res.data.data.records)
          // console.log(data)
          callback(data)
        }
      })
  }
  timeout = setTimeout(fake, 300)
}

/**
 * @description: 商家修改产品
 * @param {Object} params [产品添加Obj]
 * @return: goodsMaterialAdd
 */
export function setBomAndCraft(params) {
  return put(api.setBomAndCraft, params).then(res => {
    if (res.data.code === 0) {
      this.loading = false
      this.$message.success('设置成功')
      this.$emit('isDrawer', false)
      this.$emit('setDispatchInfo', res.data.data)
      return false
    }
    this.$message.error(res.data.msg)
    this.$emit('isDrawer', true)
    this.loading = false
  }).catch(err => {
    console.log(err)
  })
}

/**
 * @description: 产品材质信息
 * @param {string} SPRING_CZ
 * @return: custIndustry
 */
export function custIndustry() {
  return get(api.custIndustry + 'SPRING_CZ')
}

/**
 * @description: 获取报价
 * @param {string} params [skuid]
 * @return: getBomAndCraftPrices
 */
export function getBomAndCraftPrices(params) {
  return get(api.getBomAndCraftPrices + params)
}

/**
 * @description: 设置报价
 * @param {string} skuId [产品ID]
 * @param {string} price [基础报价]
 * @param {string} params [Body]
 * @return: postBomAndCraftPrices
 */
export function postBomAndCraftPrices(path, price, params) {
  return postJson(api.getBomAndCraftPrices + path + `?basePrice=${price}`, params)
}
