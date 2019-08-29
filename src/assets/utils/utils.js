import { Alert } from "ant-design-vue";

/**
 * @description: 判断是否是数组
 * @param {type}
 * @return: isArray
 */
export function isArray(o) {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Array'
}

/**
 * @description: 判断是否Number
 * @param {type}
 * @return: isNumber
 */
export function isNumber(o) {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Number'
}

/**
 * @description: 判断是否是浮点数
 * @param {Number} n [浮点数]
 * @return: isFloat
 */
export function isFloat(n) {
  return n !== parseInt(n)
}

/**
 * @description: 判断是否是整数
 * @param {Number} n [整数]
 * @return: isIntegert
 */
export function isIntegert(n) {
  const reg = /^[0-9]*[1-9][0-9]*$/
  return reg.test(n)
}

/**
 * @description: 判断是否字符串
 * @param {type}
 * @return: isNumber
 */
export function isString(o) {
  return Object.prototype.toString.call(o).slice(8, -1) === 'String'
}

/**
 * @description: 数组对象去重
 * @param {Array} [arr] 数组对象
 * @return: objDeduplication
 */
// export function objDeduplication(arr, val) {
//   const hash = {}
//   const newArr = arr.reduceRight((item, next) => {
//     hash[val] ? '' : (hash[val] = true && item.push(next))
//     return item
//   }, [])
//   return newArr
// }

/**
 * @description: Array递归遍历验证ID
 * @param {arr} 数组参数
 * @param {name}  验证ID
 * @return: recursive
 */
export function recursive(arr, name) {
  return arr.filter(item => {
    const temp = []
    if (name === '0') {
      temp.push('无上级分类')
      console.log(temp)
      return temp
    }
    if (item.pid === name) {
      temp.push(item.name)
      console.log(temp)
      return temp
    }
    if (item.childrens !== null) {
      return temp.push(recursive.call(this, item.childrens, name))
    }
    return temp
  })
}

/**
 * @description: 查找对象所有父类
 * @param {String} id  [为你要查找的id]
 * @param {Object} arr   [为原始Json数据]
 * @param {Function} temp    [供递归使用，不要赋值]
 * @return: findPathByLeafId
 */
export function findParentId(id, arr, type, temp) {
  if (temp === undefined) {
    temp = []
  }
  for (var i = 0; i < arr.length; i++) {
    var tmpPath = temp.concat()
    tmpPath.push(arr[i][type])
    if (id === arr[i].id) {
      return tmpPath
    }
    if (arr[i].childrens) {
      var findResult = findParentId(id, arr[i].childrens, type, tmpPath)
      if (findResult) {
        return findResult
      }
    }
  }
}

/**
 * @description: 递归改变数组对象key
 * @param {Array} arr [目标数组]
 * @return: changeKey
 * @author 余亚龙 2019/06/27
 */
export function changeKey(arr) {
  return arr.forEach(item => {
    if (!item.childrens) {
      item.status = item.status === 'NORMAL' ? '正常' : (item.status === 'STOP' ? '停用' : '禁用')
    }
    if (item.childrens) {
      item.status = item.status === 'NORMAL' ? '正常' : (item.status === 'STOP' ? '停用' : '禁用')
      return changeKey(item.childrens)
    }
  })
}

/**
 * @description: 短信验证码倒计时
 * @param {Number} 倒计时
 * @method factory
 * @return: factorySendCode
 * @author 余亚龙 2019/03/24
 */
export function factorySendCode(num) {
  if (this.remaining === 0) {
    this.disabled = false
    this.remaining = num
    this.btnText = '重新发送'
    this.btnType = 'primary'
    return false
  } else {
    this.disabled = true
    this.btnText = '重新发送' + this.remaining
    this.remaining--
    setTimeout(() => {
      factorySendCode.call(this, num)
    }, 1000)
  }
}
