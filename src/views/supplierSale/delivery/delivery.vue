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
                    <a href="javascript:;">{{item.factoryName}}</a>
                    <span>{{item.factoryOdNumber}}</span>
                  </div>
                  <ul class="item-left-desc">
                    <li>{{item.name}}</li>
                    <li>{{item.spec}}</li>
                    <li>{{item.cz}}</li>
                    <li>{{item.odNumber}} {{item.unit}}</li>
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
                    <a href="javascript:;">{{item.name}}</a>
                    <span
                      v-if="item.skuPriceInventory"
                    >库存：{{item.skuPriceInventory.storeCount || 0}} {{item.skuPriceInventory.unit}}</span>
                    <span v-else>库存：{{item.storeCount || 0}} {{item.unit}}</span>
                  </div>
                  <ul class="item-left-desc">
                    <li>{{item.spec}}</li>
                    <li>{{item.cz}}</li>
                    <li>{{item.odNumber}} {{item.unit}}</li>
                  </ul>
                </div>
                <div class="item-right">
                  <a-input-number :min="0" :max="Number(item.odNumber)" v-model="item.fNum" />
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
            >入库</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import infiniteScroll from 'vue-infinite-scroll'
import { get, postJson, put } from '@/api/axios.js'
import api from '@/api/index.js'
import moment from 'moment'
import { mixinBasic } from '@/components/tools/mixin/mixin'
import { mixinCurrentPage, getListCompanyCusts } from '@/views/sale/mixin/minxinSale'
export default {
  directives: { infiniteScroll },
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
        title: '移除入库信息',
        content: '您确定要移除这条入库信息吗?',
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
      this.companyList = [dataCompany[index]]
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
            item['fNum'] = item.odNumber
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
      let deliverySure = false
      if (companyList.length === 0) { return false }
      companyList.forEach(item => {
        if (item.skuPriceInventory && item.fNum > item.skuPriceInventory.storeCount) {
          deliverySure = true
        }
      })
      if (deliverySure) {
        this.prompt()
      } else {
        const data = this.dataSplic()
        this.deliveryRequest(data)
      }
    },
    // 发货请求
    deliveryRequest(data) {
      this.submitLoading = true
      postJson(api.outStorageApplyOpt, data).then(res => {
        if (res.data.code === 0) {
          this.currentPage = 1
          this.dataCompany = []
          this.companyList = []
          this.selectIndex = ''
          this.getFactoryOrder()
          this.$message.success('已提交入库申请', 1)
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
        data.push({
          oid: dataCompany.id,
          odId: item.ssodId,
          requireLevel: dataCompany.requireLevel ? 'LEVEL1' : 'LEVEL0',
          reciverId: item.factoryId,
          reciverName: item.factoryName,
          toSkuId: item.factorySkuId,
          fromSkuId: item.supplierSkuId,
          fromSkuName: item.fromSkuName,
          toSkuName: item.toSkuName,
          toSkuSpec: item.toSkuSpec,
          fromSkuSpec: item.fromSkuSpec,
          outCount: item.fNum,
          relateOrderSkuCount: item.odNumber,
          packageInfo: '',
          oaddresseeName: item.factoryName,
          ophone: '',
          oaddress: ''
        })
      })
      return data
    },
    // 库存不足发货提示
    prompt() {
      const _this = this
      this.$confirm({
        title: '通知',
        content: '库存量不足，是否还要入库？',
        onOk() {
          const data = _this.dataSplic()
          _this.deliveryRequest(data)
        },
        onCancel() {
        }
      })
    },
    cancelSubmit() {
      this.companyList = []
      this.selectIndex = ''
    },
    currentPageChange(e) {
      const result = this.getCurrentPageChange(e)
      if (result) {
        this.getListCompanyCusts(this.customerPage)
      }
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
