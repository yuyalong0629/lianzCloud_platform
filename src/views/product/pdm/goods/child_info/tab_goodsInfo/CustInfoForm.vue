<template>
  <a-form :form="custInfoForm" layout="horizontal" hideRequiredMark>
    <a-row>
      <a-col :span="8">
        <a-form-item
          label="客户简称"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-select
            allowClear
            v-if="childDisabled"
            v-decorator="['custId']"
            placeholder="请输入客户简称"
            @change="handleChangecustName"
            @popupScroll="e=>handleScrollcustName(e)"
          >
            <a-select-option v-for="(d, i) in selectCodeData" :key="d.key">{{d.name}}</a-select-option>
          </a-select>
          <template v-else="childDisabled">{{ custName }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="图号"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="childDisabled" v-decorator="['custDrawNum']" placeholder="请输入图号" />
          <template v-else="childDisabled">{{custInfoData.custDrawNum}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="图号版本号"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="childDisabled" v-decorator="['custDrawVersion']" placeholder="请输入图号版本号" />
          <template v-else="childDisabled">{{custInfoData.custDrawVersion}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="客户产品编码"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="childDisabled" v-decorator="['custSkuCode']" placeholder="请输入客户产品编码" />
          <template v-else="childDisabled">{{custInfoData.custSkuCode}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="物料号"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="childDisabled" v-decorator="['custMaterialNum']" placeholder="请输入物料号" />
          <template v-else="childDisabled">{{ custInfoData.custMaterialNum }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="物料名"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="childDisabled" v-decorator="['custMaterialName']" placeholder="请输入物料名" />

          <template v-else="childDisabled">{{ custInfoData.custMaterialName }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="材质"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="childDisabled" v-decorator="['custCz']" placeholder="请输入材质" />
          <template v-else="childDisabled">{{ custInfoData.custCz }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="表面处理"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="childDisabled" v-decorator="['custBmcl']" placeholder="请输入表面处理" />
          <template v-else="childDisabled">{{ custInfoData.custBmcl }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="客户规格"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="childDisabled" v-decorator="['custSkuSpec']" placeholder="请输入客户规格" />
          <template v-else="childDisabled">{{ custInfoData.custSkuSpec }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="备注"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="childDisabled" v-decorator="['custRemark']" placeholder="请输入备注" />
          <template v-else="childDisabled">{{ custInfoData.custRemark }}</template>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script>
import { listCompanyGoodsCode } from '../../basic_lib/index'
import { getListCompanyCusts } from '@/components/scroll_list/index'
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'
import { findParentId } from 'utils/utils.js'

export default {
  name: 'CustInfo',
  mixins: [mixinBasic, mixinIsEdit],
  data() {
    return {
      custInfoForm: this.$form.createForm(this),
      selectCodeData: [],
      num: 1
    }
  },
  props: {
    custInfoData: {
      type: Object,
      default: {}
    },
    custName: {
      type: String,
      default: ''
    },
    childDisabled: {
      type: Boolean,
      default: false
    }
  },
  created() {
    // 列表商家所有商品的商品名称
    getListCompanyCusts(1).then(res => {
      if (res.data.code === 0) {
        // console.log(res.data)
        res.data.data.records.forEach(item => {
          this.selectCodeData.push({
            key: item.id,
            name: item.custShortName
          })
        })
      }
    })
  },
  methods: {
    handleChangecustName(value) {
      console.log(value)
    },
    handleScrollcustName(e) {
      const SCROLLTHEIGHT = e.target.scrollHeight // 获取元素内容高度
      const SCROLLTOP = e.target.scrollTop // 获取或者设置元素的滚动高度
      const CLIENTHEIGHT = e.target.clientHeight // 读取元素的可见高度
      const CONDITION = SCROLLTHEIGHT - SCROLLTOP <= CLIENTHEIGHT
      if (CONDITION) {
        this.num++
        getListCompanyCusts(this.num).then(res => {
          if (res.data.code === 0) {
            console.log(res.data)
            const data = this.selectCodeData
            res.data.data.records.forEach(item => {
              this.selectCodeData.push({
                key: item.id,
                name: item.custShortName
              })
            })
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>