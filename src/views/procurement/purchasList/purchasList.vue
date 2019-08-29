<template>
  <div class="dispatch">
    <a-row>
      <a-col :span="12" class="dispatch-left">
        <a-row class="search" :span="24">
          <inputSearch @dataChange="dataChange"></inputSearch>
        </a-row>
        <a-row class="order-list" :span="24">
          <div
            class="order-list-item demo-infinite-container"
            v-infinite-scroll="handleInfiniteOnLoad"
            :infinite-scroll-disabled="busy"
            :infinite-scroll-distance="10"
          >
            <a-list :dataSource="dataCompany">
              <a-list-item slot="renderItem" slot-scope="item, index">
                <div
                  class="list-item"
                  :class="index === setIndex? 'active':''"
                  @click="addCompany(item.id,index)"
                  v-if="item.sku"
                >
                  <div class="item-left">
                    <div class="item-left-top">
                      <a href="javascript:;">{{item.sku.name}}</a>
                      <span>{{item.sku.spec}}</span>
                    </div>
                    <ul class="item-left-desc">
                      <li>{{item.sku.cz}}</li>
                      <li>{{item.sku.standard}}</li>
                      <li>{{item.requireNumber}} {{item.unit}}</li>
                      <li>当前库存：{{item.skuPriceInventory?item.skuPriceInventory.storeCount:0}}</li>
                    </ul>
                  </div>
                  <div class="item-right">
                    <a-popover trigger="click" v-model="item.clickedVisible">
                      <template slot="content">
                        <a-form-item
                          label="紧急程度:"
                          :label-col="{ span: 12}"
                          :wrapper-col="{span:12}"
                        >
                          <a-switch v-model="item.requireLevel" />
                        </a-form-item>
                        <a-form-item class="mb">
                          <a-button type="danger" @click="removeItem(item.id,index)">移除</a-button>
                        </a-form-item>
                      </template>
                      <a-icon
                        type="ellipsis"
                        class="item-right-edit"
                        @click="e=> updataDes(e,index)"
                      />
                    </a-popover>
                    <a-button type="primary" shape="circle" icon="plus"></a-button>
                  </div>
                </div>
              </a-list-item>
              <div v-if="loadingCompony && !busy" class="demo-loading-container">
                <a-spin />
              </div>
            </a-list>
            <div class="list-item">
              <div class="item-left"></div>
              <div class="item-right-add">
                <a href="javascript:;" @click="addMaterial">添加新材料</a>
                <span>
                  点击这里
                  <a href="javascript:;" @click="flushPurchaseOrder">刷新</a> 刷新供应商
                </span>
              </div>
            </div>
          </div>
        </a-row>
      </a-col>
      <a-col :span="12" class="dispatch-right procurement">
        <div class="order-list demo-infinite-container">
          <template v-for="(item,index) in companyList">
            <div class="list-item" :key="index">
              <div class="item-left">
                <div class="item-left-top">
                  <a href="javascript:;">{{item.company.companyName}}</a>
                </div>
                <ul class="item-left-desc">
                  <li>库存：{{item.sku.storeCount || 0}}</li>
                  <li>{{item.sku.unit}}</li>
                  <li>{{item.sku.price}}</li>
                </ul>
              </div>
              <div class="item-right">
                <a-input-number v-model="item.number" />
              </div>
            </div>
          </template>
          <div class="list-item" v-show="setIndex !== ''">
            <div class="item-left"></div>
            <div class="item-right">
              <div class="item-right-add">
                <a href="javascript:;" @click="addSupplier">添加新供应商</a>
                <span>
                  点击这里
                  <a href="javascript:;" @click="flushMaterialOrder">刷新</a> 刷新供应商
                </span>
              </div>
            </div>
          </div>
          <div style="height:40px"></div>
          <div class="dispatch-right-bottom">
            <a-button @click="handleClose">取消</a-button>
            <a-button
              type="primary"
              @click="submit"
              :loading="submitLoading"
              v-show="getMenuPermission.includes('ADD')"
            >确定</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-modal
      v-model="visible"
      title="添加供应商"
      width="820px"
      destroyOnClose
      :footer="false"
      :maskClosable="false"
    >
      <searchSupplier :supplier="supplier"></searchSupplier>
    </a-modal>
    <a-modal
      v-model="meterial"
      title="添加材料"
      width="820px"
      destroyOnClose
      :footer="false"
      :maskClosable="false"
    >
      <newMaterial></newMaterial>
    </a-modal>
  </div>
</template>

<script>
import infiniteScroll from 'vue-infinite-scroll'
import searchSupplier from './other/searchSupplier'
import newMaterial from './other/newMaterial'
import api from '@/api/index.js'
import inputSearch from './other/inputSearch'
import { get, postJson, deletedJson } from '@/api/axios.js'
import { mixinBasic, mixinDrawer } from '@/components/tools/mixin/mixin'
export default {
  directives: { infiniteScroll },
  mixins: [mixinBasic, mixinDrawer],
  components: {
    searchSupplier,
    newMaterial,
    inputSearch
  },
  data() {
    return {
      busy: false,
      loadingCompony: false,
      dataCompanySize: 0,
      dataCompany: [],
      currentPage: 1,
      pageSize: 15,
      data: {},
      companyList: [],
      submitLoading: false,
      setIndex: '',
      meterial: false,
      disabledUp: false,
      supplier: {
        id: '',
        factoryMaterialId: '',
        cz: '',
        spec: '',
        standard: ''
      }
    }
  },
  computed: {
    getMenuPermission() {
      return this.$store.state.menuPermission
    }
  },
  methods: {
    dataChange(data) {
      this.currentPage = 1
      this.data = { ...data }
      this.dataCompany = []
      this.getFactoryOrder()
    },
    // 滚动滑动条加载订单
    handleInfiniteOnLoad() {
      const data = this.dataCompany
      this.loadingCompony = true
      if (data.length >= this.dataCompanySize && this.dataCompanySize !== 0 || this.disabledUp) {
        this.busy = true
        this.loadingCompony = false
      } else {
        this.getFactoryOrder(this.currentPage)
        this.loadingCompony = false
        this.busy = false
      }
    },
    // 移除采购订单
    removeItem(id, index) {
      var _this = this
      this.$confirm({
        title: '移除订单信息',
        content: '您确定要删除这条采购订单消息吗?',
        zIndex: 99999,
        onOk() {
          deletedJson(api.deleteMaterialOrder, [id]).then(res => {
            if (res.data.code === 0) {
              _this.$message.success('移除成功')
              _this.setIndex = ''
              _this.companyList = []
              _this.dataCompany.splice(index, 1)
            } else {
              _this.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    addCompany(id, index) {
      this.setIndex = index
      this.companyList = []
      const data = this.dataCompany[index].skuSupplierList
      if (data.length > 0) {
        const _this = this
        data.forEach(item => {
          _this.$set(data, 'number', 0)
        })
        this.companyList = data
      }
    },
    // 取消操作
    handleClose() {
      this.setIndex = ''
      this.companyList = []
    },
    // 获取带采购列表
    getFactoryOrder(currentPage = 1, pageSize = 15) {
      this.disabledUp = true
      const data = this.data
      data.currentPage = currentPage
      data.pageSize = pageSize
      get(api.getPurchasingManagement, data).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data.records
          if (data.length > 0) {
            data.forEach(item => {
              item.clickedVisible = false
              item.requireLevel = false
            })
          }
          this.disabledUp = false
          this.dataCompanySize = Number(res.data.data.total)
          this.dataCompany = this.dataCompany.concat(data)
        }
        this.currentPage += 1
      })
    },
    updataDes(e, index) {
      window.event ? window.event.cancelBubble = true : e.stopPropagation()
      this.dataCompany[index].clickedVisible = true
    },
    // 刷新采购单
    flushPurchaseOrder() {
      this.dataCompany = []
      this.companyList = []
      this.setIndex = ''
      this.currentPage = 1
    },
    // 刷新
    flushMaterialOrder() {
      console.log(1)
      const _this = this
      const factoryId = this.dataCompany[this.setIndex].factoryId
      const materialId = this.dataCompany[this.setIndex].materialId
      get(api.flushMaterialOrder + `/${factoryId}/${materialId}`).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data
          data.forEach(item => {
            _this.$set(data, 'number', 0)
          })
          this.companyList = data
        }
      })
    },
    // 提交供应商销售单确认
    submit() {
      if (this.companyList.length === 0) { return }
      this.submitLoading = true
      const data = {}
      const supplierAssignmentList = []
      const companyList = this.companyList
      data.id = this.dataCompany[this.setIndex].id
      data.factoryName = localStorage.getItem('companyName')
      data.requireLevel = this.dataCompany[this.setIndex].requireLevel ? 'LEVEL1' : 'LEVEL0'
      companyList.forEach(item => {
        if (item.number > 0) {
          supplierAssignmentList.push({
            number: item.number,
            supplierId: item.supplierId,
            supplierMaterialId: item.supplierMaterialId,
            supplierName: item.company.companyName
          })
        }
      })
      data.supplierAssignmentList = [...supplierAssignmentList]
      if (data.supplierAssignmentList.length === 0) {
        this.submitLoading = false
        return
      }
      postJson(api.addMaterialOrderSale, data).then(res => {
        if (res.data.code === 0) {
          this.$message.success('新增供应商采购成功')
          this.companyList = []
          this.dataCompany = []
          this.setIndex = ''
          this.currentPage = 1
          this.getFactoryOrder()
        } else {
          this.$message.error(res.data.msg)
        }
        this.submitLoading = false
      }).catch(() => {
        this.$message.error('系统错误')
        this.submitLoading = false
      })
    },
    isDrawer(val) {
      this.visible = val
    },
    addSupplier() {
      const data = this.dataCompany[this.setIndex]
      this.supplier = {
        id: data.id,
        factoryMaterialId: data.materialId,
        cz: data.sku.cz,
        spec: data.sku.spec,
        standard: data.sku.standard
      }
      this.visible = true
    },
    addMaterial() {
      this.meterial = true
    }
  }
}
</script>

<style lang="less" scoped>
@import "~styles/dispach.less";
.item-left-desc li {
  width: 140px;
}
</style>
