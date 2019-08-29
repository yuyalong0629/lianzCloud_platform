/**
 * @description 时间格式的转化 等一些过滤
 * @author 宋江伟 2019-7-31
 */

import Vue from 'vue'
import { status, moneyType, instorageType, puStorageStatus } from './menu'
import { formatDate } from './data.js'

/**
 * @description 时间格式过滤
 * @time 2019/7/31 16:14
 */
Vue.filter('formatDate', function (time) {
  var date = new Date(time)
  return formatDate(date, 'yyyy-MM-dd')
})

/**
 * @description 订单状态过滤
 */
Vue.filter('stateFilter', value => {
  let state
  status.forEach(item => {
    if (item.value === value) {
      state = item
    }
  })
  if (state) {
    return state.label
  } else {
    return ''
  }
})

/**
 * @description 金币转换
 */
Vue.filter('moneyFilter', val => {
  let dataMoney
  moneyType.forEach(item => {
    if (item.value === val) {
      dataMoney = item
    }
  })
  if (dataMoney) {
    return dataMoney.label
  } else {
    return ''
  }
})

/**
 * @description 入库类型
 */
Vue.filter('putStorageType', val => {
  let storageType
  instorageType.forEach(item => {
    if (item.value === val) {
      storageType = item
    }
  })
  if (storageType) {
    return storageType.label
  } else {
    return ''
  }
})

/**
 * @description 入库状态
 */
Vue.filter('putStorageStatus', val => {
  let storageStatus
  puStorageStatus.forEach(item => {
    if (item.key === val) {
      storageStatus = item
    }
  })
  if (storageStatus) {
    return storageStatus.value
  } else {
    return ''
  }
})
