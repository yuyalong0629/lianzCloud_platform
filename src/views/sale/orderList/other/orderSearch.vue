<template>
  <a-form layout="inline" style="margin-bottom:16px;">
    <a-row>
      <a-col :span="21">
        <a-row>
          <a-col :span="24" style="margin: 8px 0;">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="订单编码">
              <a-input
                class="inputWidth"
                v-model="orderEncapsulation.oorderNumber"
                @change="(e)=>{inputChange(e.target.value,'oorderNumber')}"
              ></a-input>
            </a-form-item>
            <!-- <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="采购单号">
              <a-input
                class="inputWidth"
                v-model="orderEncapsulation.opurchaseOrderno"
                @change="(e)=>{inputChange(e.target.value,'opurchaseOrderno')}"
              />
            </a-form-item>-->
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="客户信息">
              <a-select
                class="inputWidth"
                showSearch
                allowClear
                :showArrow="false"
                :filterOption="false"
                :defaultActiveFirstOption="false"
                :dropdownMatchSelectWidth="false"
                v-model="orderEncapsulation.custId"
                @search="val=>handleSelectChange(val,'customer')"
                @change="(val)=>{inputChange(val,'custId')}"
                @popupScroll="e=>currentPageChange(e,'customer')"
              >
                <a-select-option
                  v-for="item in listCompanyCusts"
                  :key="item.id"
                >{{item.custCode}}&nbsp;-&nbsp;{{item.custShortName}}</a-select-option>
              </a-select>
            </a-form-item>
            <!-- <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="客户经理">
              <a-select
                class="inputWidth"
                showSearch
                allowClear
                :showArrow="false"
                :filterOption="false"
                :defaultActiveFirstOption="false"
                v-model="orderEncapsulation.ocustAmaldar"
                @search="val=>handleSelectChange(val,'ocustAmaldar')"
                @change="(val)=>{inputChange(val,'ocustAmaldar')}"
                @popupScroll="e=>currentPageChange(e,'ocustAmaldar')"
              >
                <a-select-option
                  v-for="item in locustAmalgamList"
                  :key="item.userName"
                >{{item.userName}}</a-select-option>
              </a-select>
            </a-form-item>-->
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品编码">
              <a-select
                class="inputWidth"
                showSearch
                allowClear
                :showArrow="false"
                :filterOption="false"
                :defaultActiveFirstOption="false"
                v-model="orderEncapsulation.odSkuCode"
                @search="val=>handleSelectChange(val,'odSkuCode')"
                @change="(val)=>{inputChange(val,'odSkuCode')}"
                @popupScroll="e=>currentPageChange(e,'companyGoods')"
              >
                <a-select-option v-for="item in odSkuCodeList" :key="item">{{item}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <Animation name="fadeIn" v-if="advanced">
            <a-col :span="24">
              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品规格">
                <a-select
                  class="inputWidth"
                  showSearch
                  allowClear
                  :showArrow="false"
                  :filterOption="false"
                  :defaultActiveFirstOption="false"
                  v-model="orderEncapsulation.odSpec"
                  @search="val=>handleSelectChange(val,'odSpec')"
                  @change="(val)=>{inputChange(val,'odSpec')}"
                  @popupScroll="e=>currentPageChange(e,'companySpec')"
                >
                  <a-select-option v-for="item in odSpecList" :key="item">{{item}}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="订单来源">
                <a-select
                  class="inputWidth"
                  allowClear
                  v-model="orderEncapsulation.osource"
                  @change="(val)=>{inputChange(val,'osource')}"
                >
                  <a-select-option value="0">线上商城</a-select-option>
                  <a-select-option value="1">线上定制</a-select-option>
                  <a-select-option value="2">线下定制</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="订单状态">
                <a-select
                  class="inputWidth"
                  allowClear
                  v-model="orderEncapsulation.ostatus"
                  @change="(val)=>{inputChange(val,'ostatus')}"
                >
                  <template v-for="(item,index) in orderStatus">
                    <a-select-option :value="index" :key="index">{{item.label}}</a-select-option>
                  </template>
                </a-select>
              </a-form-item>
            </a-col>
          </Animation>
          <Animation name="fadeIn" style="margin: 8px 0;" v-if="advanced">
            <a-col :span="24">
              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="承诺交期">
                <a-range-picker
                  class="inputWidth"
                  format="YYYY-MM-DD"
                  @change="(date, dateString)=>{dateChange(dateString)}"
                />
              </a-form-item>
            </a-col>
          </Animation>
        </a-row>
      </a-col>
      <a-col :span="3" style="margin: 8px 0;text-align:right;">
        <a-form-item style="text-align:center">
          <span @click="searchRest" style="cursor: pointer;margin-right:8px">重置</span>
          <span @click="toggleAdvanced" style="cursor: pointer;">
            {{ advanced ? '收起' : '展开' }}
            <a-icon :type="advanced ? 'caret-up' : 'caret-down'" />
          </span>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import Animation from '@/assets/common/Animation'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { mixinCurrentPage, getListCompanyCusts, mixinGetProductAbout } from '@/views/sale/mixin/minxinSale'
import { orderStatus } from '../basic_lib/menu'
moment.locale('zh-cn')
export default {
  mixins: [mixinCurrentPage, getListCompanyCusts, mixinGetProductAbout],
  components: {
    Animation
  },
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      advanced: false,
      orderStatus: orderStatus,
      orderEncapsulation: {
        // custId: '',
        // ocustAmaldar: '', // 客户经理
        // odPromiseDueDate: '', // 承诺时间
        // odSkuCode: '', // 商品编号
        // odSpec: '', // 商品规格
        // oorderNumber: '', // 订单编号
        // oproductionBase: '', // 生产基地
        // odPurchaseOrderno: '', // 采购单号
        // osource: '', // 订单来源
        // ostatus: '' // 订单状态
      },
      timer: ''
    }
  },
  methods: {
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    dateChange(dateString) {
      this.orderEncapsulation['odStartPromiseDueDate'] = dateString[0]
      this.orderEncapsulation['odEndPromiseDueDate'] = dateString[1]
      if (this.timer !== '') {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.$emit('dataChange', this.orderEncapsulation)
      }, 500)
    },
    // 搜索
    inputChange(val, type) {
      this.orderEncapsulation[type] = val
      if (this.timer !== '') {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.$emit('dataChange', this.orderEncapsulation)
      }, 500)
    },
    // 选择框下拉状态
    currentPageChange(e, type) {
      const result = this.getCurrentPageChange(e)
      if (result) {
        switch (type) {
          case 'customer':
            this.getListCompanyCusts(this.customerPage)
            break
          case 'companyGoods':
            this.getListCompanyGoodsCode(this.codeCurrentPage)
            break
          case 'companySpec':
            this.getListCompanySpringSpecs(this.specCurrentPage)
            break
          case 'ocustAmaldar':
            this.getCompanyAllUsers(this.locustAmalgamListPage)
            break
        }
      }
    },
    // 搜索条件重置
    searchRest() {
      for (const i in this.orderEncapsulation) {
        this.orderEncapsulation[i] = ''
      }
      this.$emit('dataChange', this.orderEncapsulation)
    },
    handleSelectChange(value, type) {
      if (this.timer !== '') {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.searchConditions(value, type)
      }, 500)
    },
    searchConditions(value, type) {
      switch (type) {
        case 'ocustAmaldar':
          this.locustAmalgamListPage = 1
          this.locustAmalgamList = []
          this.locustAmalgamListValue = value
          this.getCompanyAllUsers()
          break
        case 'odSkuCode':
          this.codeCurrentPage = 1
          this.odSkuCodeList = []
          this.odSkuCodeListValue = value
          this.getListCompanyGoodsCode()
          break
        case 'odSpec':
          this.specCurrentPage = 1
          this.odSpecList = []
          this.odSpecListValue = value
          this.getListCompanySpringSpecs()
          break
        case 'customer':
          this.customerPage = 1
          this.listCompanyCusts = []
          this.condition = value
          this.getListCompanyCusts()
          break
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~styles/variable.less";

.inputWidth {
  width: 200px;
}
</style>
