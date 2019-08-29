<template>
  <a-form :form="invoiceForm" layout="horizontal" hideRequiredMark>
    <a-row :gutter="16">
      <a-col :span="8">
        <a-form-item
          label="发票抬头"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :class="{ labelColor: isLabelColor }"
        >
          <a-input v-if="childDisabled" v-decorator="['iiCompanyName']" placeholder="请输入发票抬头"/>
          <template v-else="!childDisabled">
            <span
              class="input-ellipsis"
              :title="getInvoiceInfo.iiCompanyName"
            >{{ getInvoiceInfo.iiCompanyName || '无' }}</span>
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="纳税人识别号"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :class="{ labelColor: isLabelColor }"
        >
          <a-input v-if="childDisabled" v-decorator="['iiTaxpayerId']" placeholder="请输入纳税人识别号"/>
          <template v-else="!childDisabled">
            <span
              class="input-ellipsis"
              :title="getInvoiceInfo.iiTaxpayerId"
            >{{ getInvoiceInfo.iiTaxpayerId || '无' }}</span>
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="开户行"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :class="{ labelColor: isLabelColor }"
        >
          <a-input v-if="childDisabled" v-decorator="['iiBank']" placeholder="请输入开户行"/>
          <template v-else="!childDisabled">
            <span
              class="input-ellipsis"
              :title="getInvoiceInfo.iiBank"
            >{{ getInvoiceInfo.iiBank || '无' }}</span>
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="开户账号"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :class="{ labelColor: isLabelColor }"
        >
          <a-input v-if="childDisabled" v-decorator="['iiAccountName']" placeholder="请输入开户账号"/>
          <template v-else="!childDisabled">
            <span
              class="input-ellipsis"
              :title="getInvoiceInfo.iiAccountName"
            >{{ getInvoiceInfo.iiAccountName || '无' }}</span>
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="开票内容"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :class="{ labelColor: isLabelColor }"
        >
          <a-input v-if="childDisabled" v-decorator="['iiTaxContent']" placeholder="请输入开票内容"/>
          <template v-else="!childDisabled">
            <span
              class="input-ellipsis"
              :title="getInvoiceInfo.iiTaxContent"
            >{{ getInvoiceInfo.iiTaxContent || '无' }}</span>
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="联系电话"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :class="{ labelColor: isLabelColor }"
        >
          <a-input v-if="childDisabled" v-decorator="['iiContact']" placeholder="请输入联系电话"/>
          <template v-else="!childDisabled">{{ getInvoiceInfo.iiContact || '无' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="发票地址"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :class="{ labelColor: isLabelColor }"
        >
          <a-input v-if="childDisabled" v-decorator="['iiAddress']" placeholder="请输入发票地址"/>
          <template v-else="!childDisabled">
            <span
              class="input-ellipsis"
              :title="getInvoiceInfo.iiAddress"
            >{{ getInvoiceInfo.iiAddress || '无' }}</span>
          </template>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script>
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'

export default {
  name: 'InvoiceForm',
  mixins: [mixinBasic, mixinIsEdit],
  data() {
    return {
      invoiceForm: this.$form.createForm(this)
    }
  },
  props: {
    childDisabled: {
      type: Boolean,
      default: false
    },
    invoiceInfo: {
      type: Object,
      default: {}
    }
  },
  computed: {
    getInvoiceInfo() {
      return this.invoiceInfo
    }
  }
}
</script>
<style lang="less" scoped>
@import '~styles/variable.less';

/deep/ .ant-form-item-children {
  position: absolute;
  width: 100%;
  .input-ellipsis {
    display: inline-block;
    width: 180px;
    .ellipsis();
  }
}
</style>
