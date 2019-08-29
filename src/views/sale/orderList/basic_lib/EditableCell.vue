<template>
  <a-form :form="form">
    <a-form-item label="产品编码" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-select
        style="width:280px"
        showSearch
        :value="value"
        :showArrow="false"
        :filterOption="false"
        :defaultActiveFirstOption="false"
        :dropdownMatchSelectWidth="false"
        @search="handleSelect"
        @change="(val)=>{inputChange(val)}"
        @popupScroll="e=>currentPageChange(e)"
      >
        <a-select-option v-for="(item,index) in listCustomerGoods" :key="index">
          <div class="product-list">
            <div class="product-list-left">
              <img :src="item.skuPic" />
            </div>
            <div class="product-list-right">
              <div class="product-list-right-name">{{item.name}}</div>
              <div>{{item.code}}</div>
              <div>{{item.spec}} - {{item.cz}} - {{item.drawNum}}</div>
            </div>
          </div>
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="订单数量" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-input
        style="width:280px"
        v-decorator="['sku.odNumber',{rules: [{ required: true, message: '请输入订单数量' }, {validator: odNumberRegx}],initialValue:sku.odNumber}]"
        @change="(e)=>{inputnumChange(e.target.value)}"
      >
        <span slot="addonAfter">{{sku.unit}}</span>
      </a-input>
    </a-form-item>
    <a-form-item label="产品单价" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-input
        style="width:280px"
        v-decorator="['sku.odSkuCustPrice',{initialValue:sku.odSkuCustPrice}]"
        @change="(e)=>{inputPriceChange(e.target.value)}"
      >
        <span slot="addonAfter">元</span>
      </a-input>
    </a-form-item>
    <a-form-item label="订单总计" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-input style="width:280px" v-decorator="['sku.odAmount',{initialValue:sku.odAmount}]">
        <span slot="addonAfter">元</span>
      </a-input>
    </a-form-item>
    <a-form-item label="采购单号：" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-input style="width:280px" v-decorator="['sku.odPurchaseOrderno']" />
    </a-form-item>
    <a-form-item label="要求交期" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-date-picker style="width:280px" v-decorator="['sku.odRequireDueDate']" />
    </a-form-item>
    <a-form-item label="承诺交期" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-date-picker style="width:280px" v-decorator="['sku.odPromiseDueDate']" />
    </a-form-item>
    <a-form-item :style="{ textAlign: 'center' }">
      <a-button :style="{ marginRight: '8px' }" @click="handleReset">取消</a-button>
      <a-button type="primary" @click="handleEditableInfo">确认添加</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { get } from '@/api/axios.js'
import api from '@/api/index.js'
import { mixinCurrentPage } from '@/views/sale/mixin/minxinSale'
import moment from 'moment'
export default {
  mixins: [mixinCurrentPage],
  props: {
    custId: {
      type: String
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      customerGoodsPages: 0,
      currentPage: 1,
      labelCol: { span: 6, offset: 0 },
      wrapperCol: { span: 16 },
      sku: {
        skuId: '',
        code: undefined,
        odSkuName: '',
        odSpec: '',
        taxRate: 0,
        odSkuCustPrice: '',
        odAmount: '',
        odSkuCustCode: '', // 客户产品编码
        unit: ''
      },
      value: '',
      codeKey: '',
      timer: '',
      listCustomerGoods: [] // 商品信息
    }
  },
  created() {
    this.getListCompanyCustomGoods()
  },
  methods: {
    moment,
    inputChange(val) {
      const listCustomerGoods = this.listCustomerGoods[val]
      this.value = `${listCustomerGoods.code}-${listCustomerGoods.name}`
      this.form.resetFields('sku.odNumber')
      this.sku.odAmount = ''
      this.sku.odSkuCustPrice = ''
      get(api.getSkuPrice + `/${listCustomerGoods.id}/${this.custId}`).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data
          const skuCustPrice = data.skuCustPrice
          this.sku.odSkuName = data.name
          this.sku.odSpec = data.spec
          this.sku.taxRate = data.taxRate
          this.sku.odSkuCustPrice = skuCustPrice.length ? skuCustPrice[0].price : data.price
          this.sku.code = data.code
          this.sku.odSkuCustCode = data.skuCustInfo ? data.skuCustInfo.custSkuCode : ''
          this.sku.skuId = data.id
          this.sku.unit = data.unit
        }
      })
    },
    // 订单数量变化
    inputnumChange(val) {
      const price = this.form.getFieldValue('sku.odSkuCustPrice')
      let total = 0
      total = Number((Number(price) * Number(val)).toString().match(/^\d+(?:\.\d{0,2})?/))
      this.sku.odAmount = total
    },
    // 产品价格变化
    inputPriceChange(val) {
      const num = this.form.getFieldValue('sku.odNumber')
      let total = 0
      total = Number((Number(num) * Number(val)).toString().match(/^\d+(?:\.\d{0,2})?/))
      this.sku.odAmount = total
    },
    handleEditableInfo(e) {
      e.preventDefault()
      if (!this.value) {
        this.$message.warning('请选择产品')
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          const val = {
            'odRequireDueDate': values.sku.odRequireDueDate ? values.sku.odRequireDueDate.format('YYYY-MM-DD') : '',
            'odPromiseDueDate': values.sku.odPromiseDueDate ? values.sku.odPromiseDueDate.format('YYYY-MM-DD') : '',
            'odAmount': values.sku.odAmount,
            'odNumber': values.sku.odNumber,
            'odSkuCustPrice': values.sku.odSkuCustPrice,
            'odPurchaseOrderno': values.sku.odPurchaseOrderno
          }
          const data = {}
          const backData = { ...this.sku, ...val }
          data.isAddContactInfo = false
          data.sku = backData
          this.$emit('showAddContactInfo', data)
          for (const i in this.sku) {
            this.sku[i] = ''
          }
          this.form.resetFields()
        }
      })
    },
    handleReset() {
      var data = {}
      data.isAddContactInfo = false
      for (const i in this.sku) {
        this.sku[i] = ''
      }
      this.form.resetFields()
      this.$emit('showAddContactInfo', data)
    },
    currentPageChange(e) {
      const resut = this.getCurrentPageChange(e)
      if (resut) {
        this.getListCompanyCustomGoods(this.currentPage)
      }
    },
    handleSelect(value) {
      if (this.timer !== '') {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.customerGoodsPages = 0
        this.currentPage = 1
        this.listCustomerGoods = []
        this.codeKey = value
        this.getListCompanyCustomGoods()
      }, 500)
    },
    /**
     * @description 列表商家对客户的定制商品基本信息
     * @description 客户已经有的商品排在前面 先获取列表商家对客户的定制商品基本信息 如果数据少于预定的pagesize数量则再获取商家的所有产品
     */
    getListCompanyCustomGoods(currentPage = 1, pageSize = 20) {
      if (currentPage >= this.customerGoodsPages && this.customerGoodsPages !== 0) {
        return
      }
      get(api.getListCompanyCustomGoods, { key: this.codeKey, skuType: 'SPRING', currentPage, pageSize, custId: this.custId }).then(res => {
        const listCustomerGoods = res.data.data.records
        this.listCustomerGoods = this.listCustomerGoods.concat(listCustomerGoods)
        this.currentPage += 1
        this.customerGoodsPages = Number(res.data.data.pages)
      })
    },
    odNumberRegx(rule, value, callback) {
      if (value && value <= 0) {
        callback('购买数量不能为0')
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang='less' scoped>
.product-list {
  margin-bottom: 4px;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  font-size: 12px;
  &-left {
    img {
      width: 50px;
      height: 50px;
      vertical-align: middle;
    }
  }
  &-right {
    text-align: left;
    margin-left: 10px;
    &-name {
      font-size: 14px;
      font-weight: 600;
    }
  }
}
.product-list::after {
  content: "";
  display: block;
  position: absolute;
  bottom: -2px;
  width: 100%;
  height: 1px;
  background-color: #ddd;
}
</style>
