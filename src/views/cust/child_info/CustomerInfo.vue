<template>
  <div class="customer-info">
    <prompt-title @isDisabled="isDisabled" @isDelete="isDelete"></prompt-title>
    <a-row>
      <a-col :span="24">
        <h3 class="customer-title">基本信息</h3>
      </a-col>
      <a-col :span="24">
        <cust-form ref="custForm" :custFormInfo="custFormInfo" :childDisabled="disabled" />
      </a-col>
      <a-col :span="24">
        <h3 class="customer-title">联系人信息</h3>
      </a-col>
      <a-col :span="24">
        <concat-form
          @userNatureDtos="userNatureDtos"
          :childDisabled="disabled"
          :mallUsersInfo="mallUsersInfo"
        />
      </a-col>
      <a-col :span="24">
        <h3 class="customer-title">发票信息</h3>
      </a-col>
      <a-col :span="24">
        <invoice-form ref="invoiceForm" :childDisabled="disabled" :invoiceInfo="invoiceInfo" />
      </a-col>
      <a-col :span="24">
        <h3 class="customer-title">收货地址</h3>
      </a-col>
      <a-col :span="24" style="margin-bottom: 30px;">
        <address-form
          @custAddrList="custAddrList"
          :addressInfo="addressInfo"
          :childDisabled="disabled"
        />
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
          zIndex: 10,
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
import CustForm from './CustForm'
import ConcatForm from './ContactForm'
import InvoiceForm from './InvoiceForm'
import AddressForm from './AddressForm'
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'
import {
  subAddCust,
  uploadCustomerAndMallUser,
  removeCustomer
} from '../basic_lib/index'
import { findParentId } from 'utils/utils.js'

export default {
  name: 'CustomerInfo',
  mixins: [mixinBasic, mixinIsEdit],
  data() {
    return {
      customer: {}, // 客户信息
      mallUserNatureDtos: [], // 联系人信息
      custInvoiceInfo: {}, // 发票信息
      customerAddrList: [], // 地址信息
      custFormInfo: {},
      invoiceInfo: {},
      mallUsersInfo: [],
      addressInfo: [],
      custManager: undefined
    }
  },
  props: {
    customerInfo: {
      type: Object,
      default: {},
      required: false
    }
  },
  created() {},
  methods: {
    // 提交
    onSubmit(e) {
      e.preventDefault()
      this.getFormData().then(() => {
        console.log(
          this.mallUserNatureDtos.map(item => {
            delete item.deleted
            return {
              ...item
            }
          })
        )
        const params = {
          customer: {
            ...this.customer,
            custManager: this.customer.custManagerId.label,
            custManagerId: this.customer.custManagerId.key
          },
          mallUsers: this.mallUserNatureDtos.map(item => {
            delete item.deleted
            return {
              ...item
            }
          }),
          custInvoiceInfo: {
            ...this.custInvoiceInfo
          },
          customerAddrList: this.customerAddrList.map(item => {
            delete item.deleted
            return {
              ...item
            }
          })
        }
        delete params.custInvoiceInfo.deleted
        console.log(params)
        subAddCust.call(this, params)
      })
    },
    // 保存修改
    onSave(e) {
      e.preventDefault()
      this.getFormData().then(() => {
        const params = {
          customer: {
            ...this.customer,
            id: this.custFormInfo.id,
            custFrom: this.customer.custFrom === '线上注册' ? 0 : 1,
            custManager: this.customer.custManagerId.label,
            custManagerId: this.customer.custManagerId.key
          },
          mallUsers: [...this.mallUserNatureDtos],
          custInvoiceInfo: {
            ...this.custInvoiceInfo,
            id: this.invoiceInfo.id,
            custId: this.invoiceInfo.custId,
            deleted: false
          },
          customerAddrList: [...this.customerAddrList]
        }
        console.log(params)
        uploadCustomerAndMallUser.call(this, params)
      })
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
      console.log(this.customerInfo.customer.id)
    },
    // 联系人数组
    userNatureDtos(val) {
      val.forEach((item, index) => {
        this.mallUserNatureDtos[index] = {
          ...item
        }
      })
      console.log(this.mallUserNatureDtos)
    },
    // 地址信息
    custAddrList(val) {
      this.customerAddrList = val
      console.log(this.customerAddrList)
    },
    // FormData
    async getFormData() {
      // 基本信息
      this.$refs.custForm.custForm.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          // console.log(values.custLevel)
          const custLevelArr = ['V1', 'V2', 'V3', 'V4', 'V5']

          this.customer = {
            ...values,
            custProvince: values.custAddress ? values.custAddress[0] : '',
            custCity: values.custAddress ? values.custAddress[1] : '',
            custArea: values.custAddress ? values.custAddress[2] : '',
            custLevel: custLevelArr.includes(values.custLevel)
              ? custLevelArr.indexOf(values.custLevel) + 1
              : values.custLevel
          }
          delete this.customer.custAddress
        }
      })
      // 发票信息
      this.$refs.invoiceForm.invoiceForm.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          this.custInvoiceInfo = values
        }
      })
    },
    // Form详情
    setFormData() {
      // 客户信息
      console.log(this.getCustLevel)
      this.$refs.custForm.custForm.setFieldsValue({
        custName: this.custFormInfo.custName,
        custIndustry: this.custFormInfo.custIndustry,
        custShortName: this.custFormInfo.custShortName,
        custManagerId: {
          key: this.custFormInfo.custManagerId || '',
          label: this.custFormInfo.custManager
        },
        custLevel: this.getCustLevel,
        custAddress: [
          this.custFormInfo.custProvince,
          this.custFormInfo.custCity,
          this.custFormInfo.custArea
        ],
        custDetailAddr: this.custFormInfo.custDetailAddr,
        custFax: this.custFormInfo.custFax,
        custWebsite: this.custFormInfo.custWebsite,
        custFrom: this.custFormInfo.custFrom === 0 ? '线上注册' : '线下注册'
      })
      // 发票信息
      this.$refs.invoiceForm.invoiceForm.setFieldsValue({
        iiCompanyName: this.invoiceInfo.iiCompanyName,
        iiTaxpayerId: this.invoiceInfo.iiTaxpayerId,
        iiBank: this.invoiceInfo.iiBank,
        iiAccountName: this.invoiceInfo.iiAccountName,
        iiTaxContent: this.invoiceInfo.iiTaxContent,
        iiTaxContent: this.invoiceInfo.iiTaxContent,
        iiContact: this.invoiceInfo.iiContact,
        iiAddress: this.invoiceInfo.iiAddress
      })
    }
  },
  watch: {
    customerInfo: {
      handler(val) {
        console.log(Object.keys(val).length)
        if (Object.keys(val).length) {
          this.custFormInfo = val.customer
          this.invoiceInfo = val.custInvoiceInfo
          this.mallUsersInfo = val.mallUsers
          this.addressInfo = val.customerAddrList
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    getCustLevel() {
      const custLevelArr = ['V1', 'V2', 'V3', 'V4', 'V5']
      // console.log(this.custFormInfo.custLevel)
      return custLevelArr[this.custFormInfo.custLevel - 1]
    },
    getDetailPermission() {
      return this.$store.state.detailPermission
    }
  },
  components: {
    'prompt-title': PromptTitle,
    'cust-form': CustForm,
    'concat-form': ConcatForm,
    'invoice-form': InvoiceForm,
    'address-form': AddressForm
  }
}
</script>
<style lang="less" scoped>
@import '~styles/variable.less';

.customer-info {
  .customer-title {
    margin: 10px 0;
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