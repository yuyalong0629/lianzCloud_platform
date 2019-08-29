import api from '@/api/index.js'
import { get, postJson, deleted, put } from '@/api/axios.js'
import { changeKey } from 'utils/utils.js'
/**
 * @description: 获取公司分类所有商品分类 Tab数据列表
 * @param {type}
 * @return getGoodsList
 */
export function getGoodsList() {
  this.loading = true
  return get(api.categoryList).then(res => {
    if (res.data.code === 0) {
      this.loading = false
      this.data = res.data.data.map(item => {
        return {
          id: item.id,
          name: item.name,
          code: item.code,
          createTime: item.createTime,
          status: item.status,
          childrens: item.childrens === null ? '' : item.childrens
        }
      })
      changeKey.call(this, this.data)
    }
  }).catch(err => {
    console.log(err)
  })
}

/**
 * @description: 获取公司所有上级分类
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
 * @description: 添加商品分类表单提交
 * @param {params} 表单字段
 * @return postCategoryAdd
 */
export function postCategoryAdd(params) {
  return postJson(api.categoryAdd, params).then(res => {
    if (res.data.code === 0) {
      this.loading = false
      this.$message.success('添加成功')
      this.$emit('isDrawer', false)
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
 * @description: 产品分类Tab列表点击查看详情
 * @param {type}
 * @return: getCategoryDetail
 */
export function getCategoryDetail(catId) {
  return get(api.viewCategory + catId).then(res => {
    if (res.data.code === 0) {
      this.categoryInfo = res.data.data
    }
  }).catch(err => {
    console.log(err)
  })
}

/**
 * @description: table产品分类删除操作
 * @param {type}
 * @return removeCategory
 */
export function deleteCategory(params) {
  return deleted(api.categoryRemove + `?cids=${params}`).then((res) => {
    if (res.data.code === 0) {
      this.loading = false
      this.$message.success('删除成功')
      return false
    }
    if (res.data.code === 1) {
      this.loading = false
      this.$message.error(res.data.msg)
      return false
    }
  }).catch((err) => {
    console.log(err)
    this.$message.error('请求错误')
    this.loading = false
  })
}

/**
 * @description: 产品列表详情页编辑保存
 * @param {params} form
 * @return: onSave
 */
export function onSave(params) {
  return put(api.categorySave, params).then(res => {
    if (res.data.code === 0) {
      this.loading = false
      this.$message.success('修改成功')
      this.$emit('isDrawer', false)
      return false
    }
    this.loading = false
    this.$emit('isDrawer', true)
    this.$message.error(res.data.msg)
  }).catch(err => {
    console.log(err)
  })
}
