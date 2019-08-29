<template>
  <div class="catattr-info">
    <prompt-title @isDisabled="isDisabled" @isDelete="isDelete"></prompt-title>
    <a-row>
      <a-col :span="24">
        <h3 class="catattrInfo-title">基本信息</h3>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form :form="catAttrInfo" layout="horizontal" hideRequiredMark>
          <a-row>
            <a-col :span="8">
              <a-form-item
                label="所属分类"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :class="{labelColor: isLabelColor}"
              >
                <a-cascader
                  :options="options"
                  :fieldNames="{ label: 'name', value: 'id', children: 'childrens' }"
                  @change="onChangeCatattrName"
                  placeholder="请输入分类名称"
                  v-decorator="['catattrClass', {rules: [{ required: true, message: '请输入分类名称' }]}]"
                  v-if="disabled"
                  changeOnSelect
                >
                  <a-icon slot="suffixIcon" type="down" />
                </a-cascader>
                <template v-else="!disabled">{{catattrSuperiorObj.val.slice(-1).join('')}}</template>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="属性名称"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :class="{labelColor: isLabelColor}"
              >
                <a-input
                  v-decorator="['catattrName', {rules: [{ required: true, message: '请输入属性名称' }]}]"
                  placeholder="请输入属性名称"
                  v-if="disabled"
                />
                <template v-else="!disabled">{{viewCatattrInfo.name}}</template>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="计量单位"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :class="{labelColor: isLabelColor}"
              >
                <a-input v-if="disabled" v-decorator="['catattrUnit']" placeholder="请输入计量单位" />
                <template v-else="!disabled">{{viewCatattrInfo.unit}}</template>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="输入类型"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :class="{labelColor: isLabelColor}"
              >
                <a-select
                  v-if="disabled"
                  v-decorator="['catattrInputType', { initialValue: 'INPUT' }]"
                  placeholder="请输入类型"
                  @change="handleChangeInputType"
                >
                  <a-select-option value="INPUT">手输</a-select-option>
                  <a-select-option value="RADIO">单选</a-select-option>
                  <a-select-option value="CHECKBOX">多选</a-select-option>
                </a-select>
                <template
                  v-else="!disabled"
                >{{viewCatattrInfo.inputType === 'INPUT' ? '手输' : (viewCatattrInfo.inputType === 'RADIO' ? '单选' : '多选')}}</template>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="值的类型"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :class="{labelColor: isLabelColor}"
              >
                <a-select
                  v-decorator="['catattrValueType', { initialValue: 'STRING' }]"
                  @change="handleChangeInputValue"
                  placeholder="请输入值的类型"
                  v-if="disabled"
                >
                  <a-select-option value="STRING">任意值</a-select-option>
                  <a-select-option value="NUMBER">整数</a-select-option>
                  <a-select-option value="DECIMAL">数值(可带小数)</a-select-option>
                </a-select>
                <template
                  v-else="!disabled"
                >{{viewCatattrInfo.valType === 'STRING' ? '任意值' : (viewCatattrInfo.valType === 'NUMBER' ? '整数' : '数值(可带小数)')}}</template>
              </a-form-item>
            </a-col>
            <a-col :span="16" v-if="isOptional">
              <a-form-item
                label="可选项"
                :label-col="{span: 3}"
                :wrapper-col="{span: 19}"
                :class="{labelColor: isLabelColor}"
              >
                <a-input
                  v-model.trim="catattrOptional"
                  @keyup.space="onAddLabel"
                  placeholder="请按空格键生成标签"
                  v-if="disabled"
                />
                <ul class="label-box" v-if="disabled">
                  <li v-for="(item, index) in labelList" :key="index" class="create-label">
                    <span>{{ item.val }}</span>
                    <a-icon type="close" @click="closeLabel(index)" />
                  </li>
                </ul>
                <template v-else="!disabled">
                  <ul class="label-box">
                    <li v-for="(item, index) in labelList" :key="index" class="create-label">
                      <span>{{ item.val }}</span>
                    </li>
                  </ul>
                </template>
              </a-form-item>
            </a-col>
            <a-col :span="16">
              <a-form-item
                label="是否搜索属性"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :class="{labelColor: isLabelColor}"
              >
                <a-switch
                  v-if="disabled"
                  @change="onChangeSearch"
                  v-decorator="['catattrSearch', {valuePropName: 'checked', initialValue: false}]"
                />
                <template v-else="!disabled">{{viewCatattrInfo.searchProp ? '是' : '否'}}</template>
              </a-form-item>
            </a-col>
            <a-col :span="16">
              <a-form-item
                label="是否列表属性"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :class="{labelColor: isLabelColor}"
              >
                <a-switch
                  v-if="disabled"
                  @change="onChangeListAttr"
                  v-decorator="['catattrListAttr', {valuePropName: 'checked', initialValue: false}]"
                />
                <template v-else="!disabled">{{viewCatattrInfo.listProp ? '是' : '否'}}</template>
              </a-form-item>
            </a-col>
            <a-col :span="16">
              <a-form-item
                label="是否必填"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :class="{labelColor: isLabelColor}"
              >
                <a-switch
                  v-if="disabled"
                  @change="onChangeDefault"
                  v-decorator="['catattrDefault', {valuePropName: 'checked', initialValue: false}]"
                />
                <template v-else="!disabled">{{viewCatattrInfo.required ? '是' : '否'}}</template>
              </a-form-item>
            </a-col>
            <a-col :span="16">
              <a-form-item
                label="备注"
                :label-col="{span: 3}"
                :wrapper-col="{span: 19}"
                :class="{labelColor: isLabelColor}"
              >
                <a-input v-decorator="['catattrRemark']" v-if="disabled" placeholder="请输入备注" />
                <template v-else="!disabled">{{viewCatattrInfo.remark}}</template>
              </a-form-item>
            </a-col>
          </a-row>
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
        v-else="isEdit"
        v-show="getDetailPermission.includes('UPDATE')"
      >保存</a-button>
    </div>
  </div>
</template>
<script>
import PromptTitle from '@/components/tools/prompt/PromptTitle'
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'
import {
  getCategoryList,
  catattrForm,
  onSave,
  deleteCatattr
} from '../basic_lib/index'
import { findParentId } from 'utils/utils.js'

export default {
  name: 'CatattrInfo',
  mixins: [mixinBasic, mixinIsEdit],
  data() {
    return {
      catAttrInfo: this.$form.createForm(this),
      options: [],
      // 可选项
      isOptional: false,
      catattrOptional: '',
      labelList: [],
      // 详情
      viewCatattrInfo: {},
      // 所属分类
      catattrSuperiorObj: {
        id: [],
        val: []
      }
    }
  },
  props: {
    catattrInfo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  created() {},
  methods: {
    // 所属分类
    onChangeCatattrName() {},
    // 输入类型
    handleChangeInputType(value) {
      console.log(value)
      if (value !== 'INPUT') {
        this.isOptional = true
        return
      }
      this.isOptional = false
    },
    // 值的类型
    handleChangeInputValue(value) {
      console.log(value)
    },
    // 可选项键盘添加标签
    onAddLabel() {
      if (this.catattrOptional !== '') {
        this.labelList.push({
          val: this.catattrOptional
        })
        console.log(this.labelList)
        this.catattrOptional = ''
      }
    },
    // 删除标签
    closeLabel(index) {
      console.log(index)
      this.labelList.splice(index, 1)
      console.log(this.labelList)
    },
    // 是否搜索属性
    onChangeSearch(checked) {
      console.log(checked)
    },
    // 是否列表属性
    onChangeListAttr(checked) {
      console.log(checked)
    },
    // 是否必填
    onChangeDefault(checked) {
      console.log(checked)
    },
    // 提交
    onSubmit(e) {
      e.preventDefault()
      this.getFormData(null, catattrForm)
    },
    // 保存修改
    onSave(e) {
      e.preventDefault()
      this.getFormData(this.viewCatattrInfo.id, onSave)
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
      deleteCatattr.call(this, this.viewCatattrInfo.id)
    },
    // FormData
    async getFormData(id, postCatattr) {
      this.catAttrInfo.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          this.loading = true
          const params = {
            id,
            catId: Array.from(values.catattrClass)
              .slice(-1)
              .join(''), // 所属类目
            name: values.catattrName, // 属性名称
            searchProp: values.catattrSearch, // 是否搜索属性
            listProp: values.catattrListAttr, // 是否列表属性
            required: values.catattrDefault, // 是否必填
            inputType: values.catattrInputType.toString(), // 输入类型
            valType: values.catattrValueType.toString(), // 值类型
            unit: values.catattrUnit, // 计量单位
            optionList: Array.from(this.labelList), // 可选项
            attrType: '', // 属性类型
            remark: values.catattrRemark // 属性类型
          }
          // console.log(params)
          postCatattr.call(this, params)
        }
      })
    },
    // Form详情
    setFormData() {
      this.catAttrInfo.setFieldsValue({
        catattrClass: [...this.catattrSuperiorObj.id],
        catattrName: this.viewCatattrInfo.name,
        catattrSearch: this.viewCatattrInfo.searchProp,
        catattrListAttr: this.viewCatattrInfo.listProp,
        catattrDefault: this.viewCatattrInfo.required,
        catattrInputType: this.viewCatattrInfo.inputType,
        catattrValueType: this.viewCatattrInfo.valType,
        catattrUnit: this.viewCatattrInfo.unit,
        catattrRemark: this.viewCatattrInfo.remark
      })
    }
  },
  watch: {
    // Info
    catattrInfo: {
      handler(val) {
        this.viewCatattrInfo = Object.assign({}, val)
        // 判断可选项是否显示
        if (val.inputType && val.inputType !== 'INPUT') {
          this.labelList = []
          this.isOptional = true
          val.optionList.forEach(item => {
            this.labelList.push({
              val: item.val
            })
          })
        }
        // 获取所属分类对象层级元素
        getCategoryList.call(this).then(() => {
          this.catattrSuperiorObj.val = findParentId(
            val.catId,
            this.options,
            'name'
          )
          this.catattrSuperiorObj.id = findParentId(
            val.catId,
            this.options,
            'id'
          )
        })
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    getDetailPermission() {
      return this.$store.state.detailPermission
    }
  },
  components: {
    'prompt-title': PromptTitle
  }
}
</script>
<style lang="less" scoped>
@import '~styles/variable.less';

.catattr-info {
  .catattrInfo-title {
    margin-bottom: 10px;
    .h3_title();
  }
  .labelColor {
    /deep/ .ant-form-item-label label {
      .labelColor();
    }
  }
  .label-box {
    margin-bottom: 0;
    .create-label {
      background: #1890ff;
      color: #fff;
      border-radius: 4px;
      display: inline-block;
      height: 24px;
      line-height: 12px;
      padding: 6px;
      margin: 0 4px;
      i {
        font-size: 10px;
        margin-left: 4px;
      }
    }
  }
}
</style>