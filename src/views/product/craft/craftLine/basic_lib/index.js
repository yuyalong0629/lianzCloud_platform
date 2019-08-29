import { get, deletedJson, postJson, put } from '@/api/axios.js'
import api from '@/api/index.js'

/**
 * @description: 获取工艺列表
 * @param {String} code [工序编码]
 * @param {String} name [工序名称]
 * @return: getCraftLineList
 */
export function getCraftLineList(code = '', name = '') {
  this.loading = true
  return get(api.craftLineList + '?groupCode=' + code + '&groupNam=' + name).then((res) => {
    if (res.data.code === 0) {
      this.loading = false
      this.data = []
      res.data.data.forEach(e => {
        this.data.push({
          key: e.id,
          code: e.groupCode,
          name: e.groupName,
          status: e.status
        })
      })
      console.log(res.data.data)
    }
  }).catch(err => {
    console.log(err)
  })
}

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
          name: e.name,
          remark: e.remark,
          optBook: e.optBook
        })
      })
    }
  }).catch(err => {
    console.log(err)
  })
}

/**
 * @description: LIST披批量删除
 * @param {Array} idList [id]
 * @return: craftLineDelete
 */
export function craftLineDelete(params) {
  return deletedJson(api.craftLineDelete, params).then(res => {
    console.log(res)
    if (res.data.code === 0) {
      this.$message.success('删除成功')
      this.$emit('isDrawer', false)
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
 * @return: craftLineInfo
 */
export function craftLineInfo(params) {
  return get(api.craftLineInfo + params).then(res => {
    if (res.data.code === 0) {
      // console.log(res)
      this.craftLineInfo = res.data.data
    }
  }).catch(err => {
    console.log(err)
  })
}

/**
 * @description: 添加工艺
 * @param {Object} params [FORM DATA]
 * @return: craftLineAdd
 */
export function craftLineAdd(params) {
  return postJson(api.craftLineAdd, params).then(res => {
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
 * @description: 修改工艺
 * @param {Object} params [FORM DATA]
 * @return: craftLineUpdate
 */
export function craftLineUpdate(params) {
  return put(api.craftLineUpdate, params).then(res => {
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
