<template>
  <div class="dispatch">
    <a-row>
      <a-col :span="12" class="dispatch-left">
        <a-form layout="inline">
          <a-row class="search">
            <a-col :span="10">
              <a-form-item :label-col="{span:8}" :wrapper-col="{ span: 16}" label="客户名称">
                <a-select
                  class="inputWidth"
                  showSearch
                  allowClear
                  :showArrow="false"
                  :filterOption="false"
                  :dropdownMatchSelectWidth="false"
                  :defaultActiveFirstOption="false"
                  v-model="custName"
                  @search="handleSelectChange"
                  @change="inputChange"
                  @popupScroll="currentPageChange"
                >
                  <a-select-option
                    v-for="(item,index) in listCompanyCusts"
                    :key="index"
                  >{{item.custCode}}&nbsp;-&nbsp;{{item.custShortName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div
          class="order-list order-list-item demo-infinite-container"
          v-infinite-scroll="handleInfiniteOnLoad"
          :infinite-scroll-disabled="busy"
          :infinite-scroll-distance="10"
        >
          <a-list :dataSource="dataCompany">
            <a-list-item slot="renderItem" slot-scope="item, index">
              <div
                class="list-item"
                :class="selectIndex===index?'active':''"
                @click="addCompany(item.id,index)"
              >
                <div class="item-left">
                  <div class="item-left-top">
                    <a
                      href="javascript:;"
                      @click="e=>infoView(e,item.id)"
                    >{{item.ocustShortName}}{{item.ocustCode}}</a>
                    <span>{{item.oorderNumber}}</span>
                  </div>
                  <ul class="item-left-desc">
                    <li>{{item.oaddresseeName}}</li>
                    <li>{{item.ophone}}</li>
                  </ul>
                </div>
                <div class="item-right">
                  <a-popover trigger="click" v-model="item.clickedVisible">
                    <template slot="content">
                      <a-form-item
                        label="紧急程度:"
                        v-model="item.item"
                        :label-col="{ span: 12}"
                        :wrapper-col="{span:12}"
                      >
                        <a-switch />
                      </a-form-item>
                      <a-form-item class="mb">
                        <a-button type="danger" @click="removeItem(item.id,index)">移除</a-button>
                      </a-form-item>
                    </template>
                    <a-icon type="ellipsis" class="item-right-edit" @click="e=>updataDes(e,index)" />
                  </a-popover>
                </div>
              </div>
            </a-list-item>
            <div v-if="loadingCompony && !busy" class="demo-loading-container">
              <a-spin />
            </div>
          </a-list>
        </div>
      </a-col>
      <a-col :span="12" class="dispatch-right procurement">
        <div class="order-list demo-infinite-container">
          <a-list :dataSource="companyList">
            <a-list-item slot="renderItem" slot-scope="item">
              <div class="list-item">
                <div class="item-left">
                  <div class="item-left-top">
                    <a href="javascript:;">{{item.odSkuName}}</a>
                    <span
                      v-if="item.bomGroupId && item.craftGroupId && item.skuPriceInventory"
                    >库存：{{item.skuPriceInventory.storeCount || 0}} {{item.skuPriceInventory.unit}}</span>
                    <span v-else>库存：{{item.sku.storeCount || 0}} {{item.unit}}</span>
                  </div>
                  <ul class="item-left-desc">
                    <li>{{item.odOrderNumber}}</li>
                    <li>{{item.sku.odSpec}}</li>
                    <li>{{item.sku.cz}}</li>
                    <li>{{item.sku.bmcl}}</li>
                    <li>{{item.odUndeliveredNumber}}</li>
                    <li>{{item.odRequireDueDate?moment(item.odRequireDueDate).format('YYYY-MM-DD') :''}}</li>
                  </ul>
                </div>
                <div class="item-right">
                  <a-input-number
                    :min="0"
                    :max="Number(item.odUndeliveredNumber)"
                    v-model="item.fNum"
                  />
                </div>
              </div>
            </a-list-item>
          </a-list>
          <div style="height:40px"></div>
          <div class="dispatch-right-bottom">
            <a-button @click="cancelSubmit">取消</a-button>
            <a-button
              type="primary"
              @click="submit"
              :loading="submitLoading"
              v-show="getMenuPermission.includes('ADD')"
            >发货</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
    <!-- 弹出层 -->
    <a-drawer
      destroyOnClose
      placement="right"
      :closable="false"
      :width="1040"
      @close="onCustomerInfo"
      :visible="visible"
      :wrapStyle="{height: '100%',overflow: 'auto',paddingBottom: '108px'}"
    >
      <orderInfo
        @isVisible="isVisible"
        :editInfo="editInfo"
        :detialList="detialList"
        :selectAddress="true"
      ></orderInfo>
    </a-drawer>
  </div>
</template>

<script>
import infiniteScroll from 'vue-infinite-scroll'
import orderInfo from '../orderList/child_lib/orderDetail'
import { get, postJson, put } from '@/api/axios.js'
import api from '@/api/index.js'
import moment from 'moment'
import { mixinBasic } from '@/components/tools/mixin/mixin'
import { mixinCurrentPage, getListCompanyCusts } from '@/views/sale/mixin/minxinSale'
export default {
  directives: { infiniteScroll },
  components: {
    orderInfo
  },
  mixins: [mixinBasic, mixinCurrentPage, getListCompanyCusts],
  data() {
    return {
      busy: false,
      companyVisible: false,
      loadingCompony: false,
      dataCompanySize: 0,
      dataCompany: [],
      currentPage: 1,
      pageSize: 15,
      custName: '',
      companyList: [],
      selectIndex: '',
      submitLoading: false,
      visible: false,
      detialList: '',
      editInfo: true,
      disabledUp: false
    }
  },
  computed: {
    getMenuPermission() {
      return this.$store.state.menuPermission
    }
  },
  methods: {
    moment,
    inputChange(value) {
      this.dataCompany = []
      this.custName = value >= 0 ? this.listCompanyCusts[value].custShortName : ''
      if (this.timer !== '') {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.currentPage = 1
        this.getFactoryOrder()
      }, 1000)
    },
    handleSelectChange(value) {
      this.listCompanyCusts = []
      this.condition = value
      if (this.timer !== '') {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.customerPage = 1
        this.getListCompanyCusts()
      }, 1000)
    },
    handleInfiniteOnLoad() {
      const data = this.dataCompany
      this.loadingCompony = true
      this.busy = true
      if (data.length >= this.dataCompanySize && this.dataCompanySize !== 0 || this.disabledUp) {
        this.busy = true
        this.loadingCompony = false
      } else {
        this.getFactoryOrder(this.currentPage)
        this.busy = false
        this.loadingCompony = false
      }
    },
    removeItem(id, index) {
      const _this = this
      const data = []
      data.push({
        id,
        odeliveryStatus: 'NONEEDDELLIVERY'
      })
      this.$confirm({
        title: '移除发货信息',
        content: '您确定要移除这条发货消息吗?',
        zIndex: 99999,
        onOk() {
          put(api.outStorageApplyStatusChange, data).then(res => {
            if (res.data.code === 0) {
              _this.$message.success('移除成功')
              _this.dataCompany.splice(index, 1)
              _this.dataCompanySize--
            } else {
              _this.$message.error(res.data.msg)
            }
          })
        },
        onCancel() { }
      })
    },
    addCompany(id, index) {
      this.selectIndex = index
      const dataCompany = this.dataCompany
      this.companyList = dataCompany[index].skuList
    },
    getFactoryOrder(currentPage = 1, pageSize = 15) {
      this.disabledUp = true
      const data = {}
      data.currentPage = currentPage
      data.pageSize = pageSize
      data.custName = this.custName
      get(api.outStorageApplyTobedistributed, data).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data.records ? res.data.data.records : []
          data.forEach(item => {
            item.clickedVisible = false
            item['requireLevel'] = false
            item.skuList.forEach(itm => {
              itm['fNum'] = itm.odUndeliveredNumber
            })
          })
          this.disabledUp = false
          this.dataCompanySize = Number(res.data.data.total)
          this.dataCompany = this.dataCompany.concat(data)
          this.currentPage += 1
        }
      })
    },
    updataDes(e, index) {
      window.event ? window.event.cancelBubble = true : e.stopPropagation()
      this.dataCompany[index].clickedVisible = true
    },
    submit() {
      const companyList = this.companyList
      const dataCompany = this.dataCompany[this.selectIndex]
      const h = this.$createElement
      const _this = this
      this.$confirm({
        title: '收件地址确认',
        content: h('div', {}, [
          h('p', `客户名称：${dataCompany.ocustShortName}`),
          h('p', `收件人：${dataCompany.oaddresseeName}`),
          h('p', `电话：${dataCompany.ophone}`),
          h('p', `详细地址：${dataCompany.olocation}${dataCompany.ostreet}`),
          h('span', { style: 'fontSize:12px;color:red' }, '如需更改收货信息请点击左侧详情进行修改')
        ]),
        onOk() {
          let deliverySure = false
          if (companyList.length === 0) { return false }
          companyList.forEach(item => {
            if (item.bomGroupId && item.craftGroupId && item.skuPriceInventory) {
              if (item.fNum > item.skuPriceInventory.storeCount) {
                deliverySure = true
              }
            } else {
              if (item.fNum > item.sku.storeCount) {
                deliverySure = true
              }
            }
          })
          if (deliverySure) {
            _this.prompt()
          } else {
            const data = _this.dataSplic()
            _this.deliveryRequest(data)
          }
        },
        onCancel() { }
      })
    },
    // 发货请求
    deliveryRequest(data) {
      this.submitLoading = true
      postJson(api.outStorageApplyOpt, data).then(res => {
        if (res.data.code === 0) {
          this.dataCompany = []
          this.companyList = []
          this.selectIndex = ''
          this.getFactoryOrder()
          this.$message.success('提交发货申请成功')
        } else {
          this.$message.error(res.data.msg)
        }
        this.submitLoading = false
      }).catch(() => {
        this.submitLoading = false
      })
    },
    // 发货数据处理
    dataSplic() {
      const data = []
      const companyList = this.companyList
      const dataCompany = this.dataCompany[this.selectIndex]
      companyList.forEach(item => {
        data.push(
          {
            oid: dataCompany.id,
            odId: item.id,
            fromSkuId: item.skuId,
            requireLevel: dataCompany.requireLevel ? 'LEVEL1' : 'LEVEL0',
            reciverId: item.odCustId,
            reciverName: dataCompany.ocustShortName,
            oaddresseeName: dataCompany.oaddresseeName,
            ophone: dataCompany.ophone,
            oaddress: dataCompany.olocation + dataCompany.ostreet,
            outCount: item.fNum,
            fromSkuName: item.odSkuName,
            fromSkuSpec: item.odSpec,
            relateOrderSkuCount: item.odNumber,
            packageInfo: ''
          }
        )
      })
      return data
    },
    // 库存不足发货提示
    prompt() {
      const _this = this
      this.$confirm({
        title: '通知',
        content: '库存量不足，是否还要发货？',
        onOk() {
          const data = _this.dataSplic()
          _this.deliveryRequest(data)
        },
        onCancel() {
        }
      })
    },
    addressConfirm() { },
    cancelSubmit() {
      this.companyList = []
      this.selectIndex = []
    },
    currentPageChange(e) {
      const result = this.getCurrentPageChange(e)
      if (result) {
        this.getListCompanyCusts(this.customerPage)
      }
    },
    infoView(e, id) {
      window.event ? window.event.cancelBubble = true : e.stopPropagation()
      this.detialList = id
      this.$store.commit('setPromptTitle', {
        title: '销售订单详情',
        isEdit: true
      })
      this.visible = true
    },
    // 关闭新建订单/详情抽屉
    isVisible(isVisible) {
      this.visible = false
      if (isVisible) {
        this.dataCompany = []
        this.companyList = []
        this.getFactoryOrder()
      }
    },
    // 关闭新建/详情订单抽屉
    onCustomerInfo() {
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
@import "~styles/dispach.less";
.inputWidth {
  width: 200px;
}

.ant-form-item-label {
  text-align: center;
}
</style>
