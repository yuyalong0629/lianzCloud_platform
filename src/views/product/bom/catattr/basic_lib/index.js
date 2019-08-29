import api from '@/api/index.js'
import { get, postJson, put, deleted } from '@/api/axios.js'

/**
 * @description: 所有分类的所有属性列表
 * @param {Number} currentPage [页数]
 * @param {Number} pageSize  [每页显示数据条数]
 * @return getCategoryTree
 */
export function getCategoryTree(currentPage = 1, pageSize = 15) {
  this.loading = true
  return get(api.catattrList + currentPage + '/' + pageSize, { catType: 1 })
    .then(res => {
      const getList = res.data.data
      if (res.data.code === 0) {
        this.loading = false
        this.pagination.total = Number(getList.total)
        this.data = []
        getList.records.forEach(item => {
          this.data.push({
            id: item.id,
            catname: item.catname,
            name: item.name,
            custId: item.custId,
            code: item.code,
            remark: item.remark,
            childrens: item.childrens === null ? '' : item.childrens
          })
        })
        console.log(this.data)
      }
    })
    .catch(err => {
      console.log(err)
      this.loading = false
    })
}

/**
 * @description: 根据客户或者公司ID获取所有商品分类
 * @param {String} custId [客户ID]
 * @return getCustList
 */
export function getCategoryList() {
  return get(api.bomCategoryTree).then(res => {
    if (res.data.code === 0) {
      this.options = res.data.data
    }
  }).catch(err => {
    console.log(err)
  })
}

/**
 * @description: 属性分类添加提交
 * @param {Object} params form表单字段
 * @return: catattrForm
 */
export function catattrForm(params) {
  return postJson(api.catattrSubmit, params).then(res => {
    console.log(res)
    if (res.data.code === 0) {
      this.loading = false
      this.loading = false
      this.$message.success('添加成功')
      this.$emit('isDrawer', false)
      return false
    }
    this.loading = false
    this.$message.error(res.data.msg)
    this.$emit('isDrawer', true)
  }).catch(err => {
    console.log(err)
  })
}

/**
 * @description: 属性分类Tab列表点击查看详情
 * @param {String} catAttrId 属性名称ID
 * @return: getCategoryDetail
 */
export function getCatattrDetail(catAttrId) {
  return get(api.catattrDetail + catAttrId).then(res => {
    if (res.data.code === 0) {
      console.log(res.data)
      this.catattrInfo = res.data.data
    }
  }).catch(err => {
    console.log(err)
  })
}

/**
 * @description: 详情信息修改保存
 * @param {Object} params [Object]
 * @return: onSave
 */
export function onSave(params) {
  return put(api.catattrSubmit, params).then(res => {
    console.log(res)
    if (res.data.code === 0) {
      this.loading = false
      this.loading = false
      this.$message.success('保存成功')
      this.$emit('isDrawer', false)
      return false
    }
    this.loading = false
    this.$message.error(res.data.msg)
    this.$emit('isDrawer', true)
  }).catch(err => {
    console.log(err)
  })
}

/**
 * @description: table产品分类删除操作
 * @param {type}
 * @return removeCategory
 */
// export function deleteCategory(params) {
//   return deleted(api.categoryRemove + `?cids=${params}`).then((res) => {
//     if (res.data.code === 0) {
//       this.loading = false
//       this.$message.success('删除成功')
//       this.isVisible = false
//       this.$emit('isVisible', this.isVisible)
//       return false
//     }
//     if (res.data.code === 1) {
//       this.loading = false
//       this.isVisible = true
//       this.$emit('isVisible', this.isVisible)
//       this.$message.error(res.data.msg)
//       return false
//     }
//   }).catch((err) => {
//     console.log(err)
//     this.$message.error('请求错误')
//     this.loading = false
//   })
// }

/**
 * @description: table产品分类删除操作
 * @param {type}
 * @return removeCategory
 */
export function deleteCatattr(params) {
  return deleted(api.catattrRemove + `?attrids=${params}`).then((res) => {
    if (res.data.code === 0) {
      this.loading = false
      this.$message.success('删除成功')
      this.$emit('isDrawer', false)
      return false
    }
    this.loading = false
    this.$message.error(res.data.msg)
    this.$emit('isDrawer', true)
    return false
  }).catch((err) => {
    console.log(err)
    this.$message.error('请求错误')
    this.loading = false
  })
}
