import { get, deleted, postJson, put } from '@/api/axios.js'
import api from '@/api/index.js'

/**
 * @description: 初始化table数据
 * @param { currentPage } 当前页
 * @param { pageSize }  每页总数
 * @return: showCustomersPage
 */
export function showCustomersPage({ custDtoCode = '', custDtoIndustry = 0, custDtoLevel = 0, custDtoManager = '', custDtoName = '', custDtoStatus = 0, currentPage = 1, pageSize = 15 }) {
  this.loading = true
  return postJson(api.showCustomersPage, { custDtoCode, custDtoIndustry, custDtoLevel, custDtoManager, custDtoName, custDtoStatus, currentPage, pageSize })
    .then(res => {
      if (res.data.code === 0) {
        this.loading = false
        const recordsList = res.data.data
        // 设置总页数
        this.pagination.total = res.data.data === null ? 0 : Number(recordsList.total)
        // 每次push先清空数组
        this.tabData = []
        const level = ['V1', 'V2', 'V3', 'V4', 'V5']
        recordsList.records.forEach((item) => {
          this.tabData.push({
            key: item.id,
            clientCode: item.custCode,
            clientShortName: item.custShortName,
            clientAbbreviation: item.custManager,
            clientName: item.name,
            clientPhone: item.phone,
            clientIndustryValue: item.custIndustryValue,
            clientLevel: level[item.custLevel - 1],
            clientStatus: item.custStatus
          })
        })
        console.log(this.tabData)
        return false
      }
      this.loading = false
      this.$message.error(res.data.msg)
    })
    .catch(err => {
      console.log(err)
      this.loading = false
      this.$message.error(`请求超时`)
    })
}

/**
 * @description: 客户管理Table列表删除操作
 * @param {params} 客户ID
 * @return: removeCustomer
 */
export function removeCustomer(params) {
  return deleted(api.removeCustomer + `?customerIds=${params}`).then((res) => {
    if (res.data.code === 0) {
      this.loading = false
      this.$message.success('删除成功')
      this.$emit('isDrawer', false)
      return false
    }
    this.loading = false
    this.$message.success(res.data.msg)
  }).catch((err) => {
    console.log(err)
    this.$message.error('请求错误')
    this.loading = false
  })
}

/**
 * @description: 新增客户表单提交
 * @param {custFormData} 表单字段
 * @return: subAddCust
 */
export function subAddCust(params) {
  this.loading = true
  return postJson(api.addCustomerAndMallUser, params).then((res) => {
    console.log(res)
    if (res.data.code === 0) {
      this.loading = false
      this.$message.success('添加成功')
      this.$emit('isDrawer', false)
      return
    }
    this.loading = false
    this.$message.error(res.data.msg)
    this.$emit('isDrawer', true)
  }).catch(err => {
    this.loading = false
    console.log(err)
  })
}

/**
 * @description: 数组对象去重
 * @param {Array<Object>} Array
 * @return: reduceObj
 */
export function reduceObj(objArray) {
  var result = [] // 去重后返回的结果数组
  var temp = {} // 临时对象
  // 将对象数组中每一项的name值作为属性，若temp不拥有此属性时则为temp添加此属性且将其值赋为true，并将这一项push到结果数组中
  for (var i = 0; i < objArray.length; i++) {
    var rePhone = objArray[i].phone
    if (temp[rePhone]) { // 如果temp中已经存在此属性名，则说明遇到重复项
      this.$message.error('请勿重复添加')
      continue // 不继续执行接下来的代码，跳转至循环开头
    }
    temp[rePhone] = true // 为temp添加此属性（myname）且将其值赋为true
    result.push(objArray[i]) // 将这一项复制到结果数组result中去
  }
  return result
}

/**
 * @description: 根据客户ID查看详情
 * @param {custID} 客户ID
 * @return: getCustomerAndMallUser
 */
export function getCustomerAndMallUser(custID) {
  return get(api.getCustomerAndMallUser, { custId: custID }).then((res) => {
    if (res.data.code === 0) {
      console.log(res.data)
      this.customerInfo = res.data.data
    }
  }).catch((err) => {
    console.log(err)
  })
}

/**
 * @description: 获取客户行业字典表
 * @param {String} INDUSTRY
 * @return: getCustIndustry
 */
export function getCustIndustry(params) {
  return get(api.custIndustry + params)
    .then(res => {
      // console.log(res.data)
      this.custIndustryArr = []
      // 设置客户查询初始化选中
      res.data.data.forEach(item => {
        this.custIndustryArr.push({
          id: item.id,
          displayValue: item.displayValue
        })
      })
      console.log(this.custIndustryArr)
    })
    .catch(err => {
      console.log(err)
    })
}

/**
 * @description: 客户详情修改信息
 * @param {Object}  this.custFormData [表单]
 * @return: uploadCustomerAndMallUser
 */
export function uploadCustomerAndMallUser(params) {
  this.loading = true
  return put(api.updateCustomerAndMallUser, params).then((res) => {
    console.log(res)
    if (res.data.code === 0) {
      this.loading = false
      this.$message.success('修改成功')
      this.$emit('isDrawer', false)
      return
    }
    this.loading = false
    this.$message.error(res.data.msg)
    this.$emit('isDrawer', true)
  }).catch(err => {
    this.loading = false
    console.log(err)
  })
}

/**
 * @description: 递归查询ID对应的地址
 * @param {Array} area [地址]
 * @param {String} id [地址ID]
 * @return: searchAddress
 */
export function searchAddress(arr, id) {
  return arr.filter(item => {
    // console.log(item)
    if (item.id === id) {
      this.showAddress.push(item.name)
      console.log(this.showAddress)
      return item
    }
    if (item.childrens) {
      return searchAddress.call(this, item.childrens, id)
    }
  })
}

/**
 * @description: 客户管理条件模糊查询功能
 * @param {Object} params [搜索查询条件]
 * @return: showFuzzyCustomerPages
 */
export function getFuzzyCustomerPages(params) {
  return postJson(api.showCustomersPage, params).then(res => {
    console.log(res)
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
export function custNamefetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value
  function fake() {
    get(api.listCustomerNames + `?custName=${value}`)
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

/**
 * @description: 客户编码模糊搜索
 * @param {String} value [监听选中的值]
 * @param {Function} callback [回调]
 * @return: custCodefetch
 */
export function custCodefetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value
  function fake() {
    get(api.getListCompanyList + `?condition=${value}`)
      .then((res) => {
        if (currentValue === value) {
          const data = []
          data.push(...res.data.data.records.map(item => item.custCode))
          callback(data)
        }
      })
  }
  timeout = setTimeout(fake, 300)
}

/**
 * @description: 客户经理模糊搜索
 * @param {String} value [监听选中的值]
 * @param {Function} callback [回调]
 * @return: custCodefetch
 */
export function custManagerfetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value
  function fake() {
    get(api.getUsersLike + `?username=${value}`)
      .then((res) => {
        // console.log(res.data.data)
        if (currentValue === value) {
          const data = []
          res.data.data.records.forEach(r => {
            data.push({
              value: r.userName,
              text: r.userId
            })
          })
          callback(data)
        }
      })
  }
  timeout = setTimeout(fake, 300)
}
