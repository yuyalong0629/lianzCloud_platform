<template>
  <div class="dispatch">
    <div class="search">
      <a-row :span="24">
        <a-col :span="7">
          <a-form-item label="规格" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input style="width:160px" v-model="supplier.spec"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="7">
          <a-form-item label="标准" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input style="width:160px" v-model="supplier.standard"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="7">
          <a-form-item label="材质" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input style="width:160px" v-model="supplier.cz"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="3">
          <a-form-item>
            <a-button type="primary" @click="search">搜索</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </div>
    <div class="order-list">
      <div
        class="order-list-item demo-infinite-container"
        v-infinite-scroll="handleInfiniteOnLoad"
        :infinite-scroll-disabled="busy"
        :infinite-scroll-distance="10"
      >
        <a-list :dataSource="dataCompany">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <div class="list-item">
              <div class="item-left">
                <div class="item-left-top">
                  <a href="javascript:;">{{item.company.companyName}}</a>
                  <span>{{item.name}} {{item.spec}}</span>
                </div>
                <ul class="item-left-desc">
                  <li>库存：{{item.storeCount}}</li>
                  <li>{{item.unit}}</li>
                  <li>{{item.price}}{{item.moneyType | moneyFilter}}</li>
                </ul>
              </div>
              <div class="item-right">
                <a-button
                  type="primary"
                  shape="circle"
                  icon="plus"
                  @click="addCompany(index)"
                  v-if="!item.have"
                ></a-button>
                <a-button type="primary" shape="circle" icon="check" v-if="item.have"></a-button>
              </div>
            </div>
          </a-list-item>
          <div v-if="loadingCompony && !busy" class="demo-loading-container">
            <a-spin />
          </div>
        </a-list>
      </div>
    </div>
  </div>
</template>

<script>
import infiniteScroll from 'vue-infinite-scroll'
import { get, postJson } from '@/api/axios.js'
import api from '@/api/index.js'
import { mixinBasic, mixinDrawer } from '@/components/tools/mixin/mixin'
export default {
  props: {
    supplier: {
      type: Object,
      default: () => {
        return {
          id: '',
          factoryMaterialId: '',
          cz: '',
          spec: '',
          standard: ''
        }
      },
      required: true
    }
  },
  directives: { infiniteScroll },
  mixins: [mixinBasic, mixinDrawer],
  data() {
    return {
      busy: false,
      loadingCompony: false,
      dataCompanySize: 0,
      dataCompany: [],
      currentPage: 1,
      pageSize: 15
    }
  },
  methods: {
    // 滚动滑动条加载订单
    handleInfiniteOnLoad() {
      const data = this.dataCompany
      this.loadingCompony = true
      if (data.length >= this.dataCompanySize && this.dataCompanySize !== 0) {
        this.busy = true
        this.loadingCompony = false
      } else {
        this.getFactoryOrder(this.currentPage)
        this.loadingCompony = false
      }
    },
    // 获取供应商原材料列表
    getFactoryOrder(currentPage = 1) {
      const data = {}
      data.currentPage = currentPage
      data.pageSize = this.pageSize
      data.cz = this.supplier.cz
      data.spec = this.supplier.spec
      data.standard = this.supplier.standard
      data.factoryMaterialId = this.supplier.factoryMaterialId
      get(api.selectSupplierList, data).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data.records
          this.dataCompanySize = Number(res.data.data.total)
          this.dataCompany = this.dataCompany.concat(data)
          this.currentPage += 1
        }
      })
    },
    // 点击搜素
    search() {
      this.dataCompany = []
      this.getFactoryOrder()
    },
    // 增补供应商
    addCompany(index) {
      const dataCompany = this.dataCompany[index]
      const skuSupplier = {
        id: this.supplier.id,
        supplierId: dataCompany.company.id,
        supplierMaterialId: dataCompany.id,
        factoryMaterialId: this.supplier.factoryMaterialId
      }
      postJson(api.addSupplierAppend, skuSupplier).then(res => {
        if (res.data.code === 0) {
          dataCompany.have = true
          this.$message.success('恭喜！添加成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~styles/dispach.less";
.demo-infinite-container {
  min-height: 60vh;
  max-height: 60vh;
}
</style>
