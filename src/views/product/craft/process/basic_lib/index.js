import { get, postJson, deletedJson, put } from '@/api/axios.js'
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
          code: e.code,
          name: e.name,
          qc: e.qc ? '是' : '否',
          optBook: e.optBook,
          standardHours: e.standardHours,
          timeBilling: e.timeBilling,
          remark: e.remark
        })
      })
    }
  }).catch(err => {
    console.log(err)
  })
}

/**
 * @description: 添加工序
 * @param {Object} params [FORM DATA]
 * @return: postProcessAdd
 */
export function postProcessAdd(params) {
  return postJson(api.processAdd, params).then(res => {
    console.log(res)
    if (res.data.code === 0) {
      this.loading = false
      this.$message.success('添加成功')
      this.$emit('isDrawer', false)
      return
    }
    this.loading = false
    this.$message.success('添加失败')
    this.$emit('isDrawer', true)
  }).catch(err => {
    console.log(err)
  })
}

/**
 * @description: LIST披批量删除
 * @param {Array} idList [id]
 * @return: deProcessDelete
 */
export function deProcessDelete(params) {
  return deletedJson(api.processDelete, params).then(res => {
    console.log(res)
    if (res.data.code === 0) {
      this.$emit('isDrawer', false)
      this.$message.success('删除成功')
      return
    }
    this.$message.success(res.data.msg)
    this.$emit('isDrawer', true)
  }).catch(err => {
    console.log(err)
  })
}

/**
 * @description: 查看详情
 * @param {String} ID [工序ID]™¡
 * @return: processInfo
 */
export function getProcessInfo(params) {
  return get(api.processInfo + params).then(res => {
    console.log(res)
    if (res.data.code === 0) {
      this.processInfo = res.data.data
    }
  }).catch(err => {
    console.log(err)
  })
}

/**
 * @description: 修改工序
 * @param {Object} params [FORM DATA]
 * @return: postProcessAdd
 */
export function processUpdate(params) {
  return put(api.processUpdate, params).then(res => {
    console.log(res)
    if (res.data.code === 0) {
      this.loading = false
      this.$message.success('修改成功')
      this.$emit('isDrawer', false)
      return
    }
    this.loading = false
    this.$message.success('修改失败')
    this.$emit('isDrawer', true)
  }).catch(err => {
    console.log(err)
  })
}
