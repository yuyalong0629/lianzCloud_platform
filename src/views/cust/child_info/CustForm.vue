<template>
  <a-form :form="custForm" layout="horizontal">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-form-item
          label="客户编码"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :class="{ labelColor: isLabelColor }"
        >
          <a-input disabled v-if="childDisabled" v-decorator="['custCode']" placeholder="默认生成"/>
          <template v-else="!childDisabled">{{ custFormInfo.custCode }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="客户名称"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :class="{ labelColor: isLabelColor }"
        >
          <a-input
            v-decorator="['custName', {
                  rules: [{ required: true, message: '请输入客户名称' }]
                }]"
            placeholder="请输入客户名称"
            v-if="childDisabled"
          />
          <template v-else="!childDisabled">
            <span class="input-ellipsis" :title="custFormInfo.custName">{{ custFormInfo.custName }}</span>
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="客户行业"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :class="{ labelColor: isLabelColor }"
        >
          <a-select
            v-if="childDisabled"
            allowClear
            v-decorator="['custIndustry', {rules: [{ required: true, message: '请输入客户行业' }]}]"
            placeholder="请输入客户行业"
          >
            <a-select-option
              :value="item.id"
              v-for="(item, index) in this.custIndustryArr"
              :key="index"
            >{{ item.displayValue }}</a-select-option>
          </a-select>
          <template v-else="!childDisabled">{{ custIndustryName }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="客户简称"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :class="{ labelColor: isLabelColor }"
        >
          <a-input
            v-decorator="['custShortName', {rules: [{ required: true, message: '请输入客户简称' }]}]"
            placeholder="客户简称"
            v-if="childDisabled"
          />
          <template v-else="!childDisabled">
            <span
              class="input-ellipsis"
              :title="custFormInfo.custShortName"
            >{{ custFormInfo.custShortName }}</span>
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="客户经理"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :class="{ labelColor: isLabelColor }"
        >
          <a-select
            showSearch
            allowClear
            labelInValue
            placeholder="请输入客户经理"
            :defaultActiveFirstOption="false"
            :showArrow="false"
            :filterOption="false"
            @search="handleCustManagerSearch"
            @change="handleCustManagerChange"
            :notFoundContent="null"
            v-if="childDisabled"
            v-decorator="['custManagerId', {rules: [{ required: true, message: '请输入客户经理' }]}]"
          >
            <a-select-option
              v-for="d in custManagerData"
              :key="d.text"
              :value="d.text"
            >{{ d.value }}</a-select-option>
          </a-select>
          <template v-else="!childDisabled">{{ custFormInfo.custManager }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="客户级别"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :class="{ labelColor: isLabelColor }"
        >
          <a-select
            v-if="childDisabled"
            v-decorator="['custLevel']"
            placeholder="请输入客户级别"
            @change="onSelectCustLevel"
          >
            <a-select-option value="1">V1</a-select-option>
            <a-select-option value="2">V2</a-select-option>
            <a-select-option value="3">V3</a-select-option>
            <a-select-option value="4">V4</a-select-option>
            <a-select-option value="5">V5</a-select-option>
          </a-select>
          <template v-else="!childDisabled">{{ getCustLevel }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="地址"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :class="{ labelColor: isLabelColor }"
        >
          <a-cascader
            v-if="childDisabled"
            changeOnSelect
            placeholder="请选择地址"
            @change="onSelectArea"
            :fieldNames="{ label: 'name', value: 'id', children: 'childrens' }"
            :options="options"
            v-decorator="['custAddress']"
          ></a-cascader>
          <template v-else="!childDisabled">
            <span
              class="input-ellipsis"
              :title="getAddress ? getAddress.join('/') : '无'"
            >{{ getAddress ? getAddress.join('/') : '无' }}</span>
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="详细地址"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :class="{ labelColor: isLabelColor }"
        >
          <a-input v-decorator="['custDetailAddr']" v-if="childDisabled" placeholder="请输入详细地址"/>
          <template v-else="!childDisabled">
            <span
              class="input-ellipsis"
              :title="custFormInfo.custDetailAddr"
            >{{ custFormInfo.custDetailAddr }}</span>
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="传真"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :class="{ labelColor: isLabelColor }"
        >
          <a-input v-decorator="['custFax']" v-if="childDisabled" placeholder="请输入传真"/>
          <template v-else="!childDisabled">{{ custFormInfo.custFax || '无' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="网址"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :class="{ labelColor: isLabelColor }"
        >
          <a-input v-decorator="['custWebsite']" v-if="childDisabled" placeholder="请输入网址"/>
          <template v-else="!childDisabled">
            <span
              class="input-ellipsis"
              :title="custFormInfo.custWebsite"
            >{{ custFormInfo.custWebsite || '无' }}</span>
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="来源"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :class="{ labelColor: isLabelColor }"
        >
          <a-select
            v-if="childDisabled"
            allowClear
            v-decorator="['custFrom']"
            placeholder="请输入来源"
            @change="onSelectCustFrom"
          >
            <a-select-option value="0">线上注册</a-select-option>
            <a-select-option value="1">线下注册</a-select-option>
          </a-select>
          <template v-else="!childDisabled">{{ custFormInfo.custFrom === 0 ? '线上注册' : '线下注册' }}</template>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script>
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'
import { areas } from 'utils/area.js'
import { findParentId } from '@/assets/utils/utils.js'
import { getCustIndustry, custManagerfetch } from '../basic_lib/index'

export default {
  name: 'CustForm',
  mixins: [mixinBasic, mixinIsEdit],
  data() {
    return {
      custForm: this.$form.createForm(this),
      custIndustryArr: [], // 行业字典表
      custIndustryName: '',
      options: areas,
      custManagerData: []
    }
  },
  props: {
    custFormInfo: {
      type: Object,
      default: {},
      required: false
    },
    childDisabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  created() {
    // 客户行业
    getCustIndustry.call(this, 'INDUSTRY').then(() => {
      if (this.custFormInfo.custIndustry) {
        this.custIndustryName = this.custIndustryArr.filter(
          item => this.custFormInfo.custIndustry === item.id
        )[0].displayValue
      }
    })
    // 经理默认数据
    custManagerfetch.call(this, '', data => (this.custManagerData = data))
  },
  methods: {
    // 客户经理
    handleCustManagerSearch(value) {
      console.log(value)
      custManagerfetch.call(this, value, data => (this.custManagerData = data))
    },
    handleCustManagerChange(value) {
      console.log(value)
    },
    // 客户等级
    onSelectCustLevel(value) {
      console.log(value)
    },
    // 客户来源
    onSelectCustFrom(value) {
      console.log(value)
    },
    // 地址选择
    onSelectArea(value, selectedOptions) {
      console.log(value)
    }
  },
  computed: {
    getCustLevel() {
      const custLevelArr = ['V1', 'V2', 'V3', 'V4', 'V5']
      return custLevelArr[this.custFormInfo.custLevel - 1]
    },
    getAddress() {
      return findParentId(this.custFormInfo.custArea, this.options, 'name')
    }
  }
}
</script>
<style lang="less" scoped>
@import '~styles/variable.less';

.labelColor {
  /deep/ .ant-form-item-label label {
    .labelColor();
  }
}
/deep/ .ant-form-item-children {
  position: relative;
  display: block;
  height: 39px;
  width: 100%;
  .input-ellipsis {
    display: inline-block;
    width: 180px;
    .ellipsis();
  }
}
</style>
