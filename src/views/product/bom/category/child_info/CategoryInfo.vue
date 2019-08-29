<template>
  <div class="category-info">
    <prompt-title @isDisabled="isDisabled" @isDelete="isDelete"></prompt-title>
    <a-row>
      <a-col :span="24">
        <h3 class="categoryInfo-title">分类信息</h3>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form :form="cateGoryInfo" layout="horizontal" hideRequiredMark>
          <a-form-item
            label="分类名称"
            :class="{labelColor: isLabelColor}"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input
              v-if="disabled"
              v-decorator="['categoryClassName', {rules: [{ required: true, message: '请输入分类名称' }]}]"
              placeholder="请输入分类名称"
            />
            <template v-else="!disabled">{{viewCategoryInfo.name}}</template>
          </a-form-item>
          <a-form-item
            label="上级分类"
            :class="{labelColor: isLabelColor}"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-cascader
              v-if="disabled"
              v-decorator="['categorySuperior']"
              :options="options"
              :fieldNames="{ label: 'name', value: 'id', children: 'childrens' }"
              @change="onChangeCategoryName"
              placeholder="请输入分类名称"
              changeOnSelect
            />
            <template
              v-else="!disabled"
            >{{categorySuperiorObj.val.length > 1 ? categorySuperiorObj.val.slice(0, -1).join('/') : '无上级分类'}}</template>
          </a-form-item>
          <a-form-item
            label="备注"
            :class="{labelColor: isLabelColor}"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input v-if="disabled" v-decorator="['categoryRemark']" placeholder="请输入备注" />
            <template v-else="!disabled">{{viewCategoryInfo.remark}}</template>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
    <div
      :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #E9E9E9',
          padding: '10px 16px',
          background: '#FFF',
          textAlign: 'right',
        }"
    >
      <a-button :style="{marginRight: '8px'}" @click="onClose">取消</a-button>
      <a-button @click="onSubmit" type="primary" :loading="loading" v-if="isEdit">提交</a-button>
      <a-button
        @click="onSave"
        type="primary"
        :disabled="!disabled"
        :loading="loading"
        v-else="!isEdit"
        v-show="getDetailPermission.includes('UPDATE')"
      >保存</a-button>
    </div>
  </div>
</template>
<script>
import PromptTitle from '@/components/tools/prompt/PromptTitle'
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'
import {
  getGoodsClass,
  postCategoryAdd,
  onSave,
  deleteCategory
} from '../basic_lib/index'
import { setTimeout } from 'timers'
import { Promise } from 'q'
import { findParentId } from 'utils/utils.js'

export default {
  name: 'CategoryInfo',
  mixins: [mixinBasic, mixinIsEdit],
  data() {
    return {
      cateGoryInfo: this.$form.createForm(this),
      options: [],
      viewCategoryInfo: {},
      categorySuperiorObj: {
        val: [],
        id: []
      }
    }
  },
  props: {
    categoryInfo: {
      type: Object,
      default: {}
    }
  },
  created() {},
  methods: {
    // 公司上级分类
    onChangeCategoryName(value) {
      console.log(value)
    },
    // 提交
    onSubmit(e) {
      e.preventDefault()
      this.getFormData(null, postCategoryAdd)
    },
    // 保存修改
    onSave(e) {
      e.preventDefault()
      this.getFormData(this.viewCategoryInfo.id, onSave)
    },
    // 编辑 || 取消
    isDisabled(val) {
      const edit = new Promise(resolved => {
        // Input选中
        this.disabled = !val
        // label color
        this.isLabelColor = !this.isLabelColor
        resolved()
      })
      edit.then(() => {
        if (this.disabled) {
          this.setFormData()
        }
      })
    },
    // 删除
    isDelete(val) {
      deleteCategory.call(this, this.viewCategoryInfo.id).then(() => {
        this.$emit('isDrawer', val)
      })
    },
    // FormData
    async getFormData(id, postCategory) {
      this.cateGoryInfo.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          const params = {
            catType: 1,
            id,
            name: values.categoryClassName || '',
            pid: values.categorySuperior
              ? values.categorySuperior.slice(-1).join('')
              : 0,
            remark: values.categoryRemark || ''
          }
          postCategory.call(this, params)
        }
      })
    },
    // Form详情
    setFormData() {
      this.cateGoryInfo.setFieldsValue({
        categoryClassName: this.viewCategoryInfo.name,
        categorySuperior:
          this.categorySuperiorObj.id.length === 1
            ? []
            : [...this.categorySuperiorObj.id].splice(
                0,
                this.categorySuperiorObj.id.length - 1
              ),
        categoryRemark: this.viewCategoryInfo.remark
      })
    }
  },
  computed: {
    getDetailPermission() {
      return this.$store.state.detailPermission
    }
  },
  watch: {
    // Info
    categoryInfo: {
      handler(val) {
        this.viewCategoryInfo = Object.assign({}, val)
        getGoodsClass.call(this).then(() => {
          this.categorySuperiorObj.val = findParentId(
            val.id,
            this.options,
            'name'
          )
          this.categorySuperiorObj.id = findParentId(val.id, this.options, 'id')
        })
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    'prompt-title': PromptTitle
  }
}
</script>
<style lang="less" scoped>
@import '~styles/variable.less';

.category-info {
  .categoryInfo-title {
    .h3_title();
  }
  .labelColor {
    /deep/ .ant-form-item-label label {
      .labelColor();
    }
  }
}
</style>