<template>
  <a-row>
    <a-col :span="8">
      <a-form-item label="订单编码" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input class="inputWidth" :value="mallOrderIntactDto.oorderNumber" disabled />
      </a-form-item>
    </a-col>
    <a-col :span="8">
      <a-form-item label="客户名称" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-select
          :disabled="editInfo"
          class="inputWidth"
          showSearch
          :showArrow="false"
          :filterOption="false"
          :defaultActiveFirstOption="false"
          v-model="mallOrderIntactDto.ocustShortName"
          :dropdownMatchSelectWidth="false"
          @search="handleSelect"
          @change="(val)=>{inputChange(val)}"
          @popupScroll="e=>currentPageChange(e)"
        >
          <a-select-option
            v-for="(item,index) in listCompanyCusts"
            :key="index"
          >{{item.custCode}}&nbsp;-&nbsp;{{item.custShortName}}</a-select-option>
        </a-select>
      </a-form-item>
    </a-col>
    <a-col :span="8">
      <a-form-item label="客户单号" :label-col="labelCol" :wrapper-col="wrapperCol">
        <template v-if="selectAddress">{{mallOrderIntactDto.opurchaseOrderno}}</template>
        <a-input
          v-else
          class="inputWidth"
          v-model="mallOrderIntactDto.opurchaseOrderno"
          :disabled="editInfo && !editDetial"
        />
      </a-form-item>
    </a-col>
    <a-col :span="8">
      <a-form-item label="订单类型" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-select :disabled="editInfo" v-model="mallOrderIntactDto.otype" class="inputWidth">
          <a-icon slot="suffixIcon" type="down" style="display:none" v-if="editInfo" />
          <a-select-option value="FORMAL">正式</a-select-option>
          <a-select-option value="SAMPLE">样品</a-select-option>
          <a-select-option value="QUARTERLYRETURN">季度返点</a-select-option>
        </a-select>
      </a-form-item>
    </a-col>
    <a-col :span="8">
      <a-form-item label="总价" :label-col="labelCol" :wrapper-col="wrapperCol">
        <template>{{mallOrderIntactDto.ototalSum || 0}} 元</template>
      </a-form-item>
    </a-col>
    <a-col :span="8">
      <a-form-item label="预收款" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input
          class="inputWidth"
          v-model="mallOrderIntactDto.oprePayment"
          v-if="!(editInfo && !editDetial)&&!selectAddress"
        >
          <span slot="addonAfter">元</span>
        </a-input>
        <template v-else>{{mallOrderIntactDto.oprePayment || 0}} 元</template>
      </a-form-item>
    </a-col>
    <a-col :span="8" v-if="editInfo">
      <a-form-item label="状态" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-select disabled :value="mallOrderIntactDto.ostatus">
          <a-icon slot="suffixIcon" type="down" style="display:none" />
          <template v-for="(item,index) in orderStatus">
            <a-select-option :value="item.value" :key="index">{{item.label}}</a-select-option>
          </template>
        </a-select>
      </a-form-item>
    </a-col>
    <a-col :span="8">
      <a-form-item label="备注" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input
          v-if="selectAddress"
          class="inputWidth"
          v-model="mallOrderIntactDto.oremarks"
          disabled
        />
        <a-input
          v-else
          class="inputWidth"
          v-model="mallOrderIntactDto.oremarks"
          :disabled="editInfo && !editDetial"
        />
      </a-form-item>
    </a-col>
  </a-row>
</template>

<script>
import { getListCompanyCusts, mixinCurrentPage } from '@/views/sale/mixin/minxinSale'
import { orderStatus } from '../basic_lib/menu.js'
import Bus from '@/Bus'
export default {
  props: {
    mallOrderIntactDto: {
      type: Object,
      required: true
    },
    editInfo: {
      type: Boolean,
      required: true,
      default: false
    },
    editDetial: {
      type: Boolean,
      required: true,
      default: false
    },
    selectAddress: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  mixins: [getListCompanyCusts, mixinCurrentPage],
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      timer: '',
      orderStatus
    }
  },
  methods: {
    // input变化 赋值
    inputChange(val) {
      this.mallOrderIntactDto.ocustShortName = this.listCompanyCusts[val].custShortName
      this.mallOrderIntactDto.ocustName = this.listCompanyCusts[val].custName
      const custId = this.listCompanyCusts[val].id
      this.mallOrderIntactDto.custId = custId
      this.$emit('setCustId', { custId: custId, ocustName: this.listCompanyCusts[val].custName })
    },
    // 选择框的下拉加载
    currentPageChange(e) {
      const result = this.getCurrentPageChange(e)
      if (result) {
        this.getListCompanyCusts(this.customerPage)
      }
    },
    handleSelect(value) {
      if (this.timer !== '') {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.customerPage = 1
        this.listCompanyCusts = []
        this.condition = value
        this.getListCompanyCusts()
      }, 500)
    }
  },
  created() {
    this.getListCompanyCusts()
    Bus.$on('setOtotalSum', val => {
      this.mallOrderIntactDto.ototalSum = val
    })
  },
  beforeDestroy() {
    Bus.$off('setOtotalSum')
  }
}
</script>

<style lang='less' scoped>
@import "~styles/variable.less";
.inputWidth {
  .inputWidth();
}
/deep/ .ant-input-disabled {
  border: none !important;
}
</style>
