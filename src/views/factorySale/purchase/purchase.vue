<template>
  <div class="purchase">
    <a-row :gutter="20">
      <a-col :span="5">
        <classification :category="category" @purchaseListId="purchaseListId"></classification>
      </a-col>
      <a-col :span="19" class="purchase-right">
        <inputSearch @dataChange="dataChange"></inputSearch>
        <a-row :span="24">
          <a-table
            :columns="columns"
            :dataSource="data"
            @change="onChangePage"
            :pagination="pagination"
            :rowSelection="rowSelection"
            :loading="loading"
          >
            <template slot="odOrderNumber" slot-scope="text,record">
              <a href="javascript:;" @click="showDrawer(record)">{{text}}</a>
            </template>
            <template
              v-for="(col,index) in ['odSkuCode','odSkuName']"
              :slot="col"
              slot-scope="text,record"
            >
              <a href="javascript:;" :key="index" @click="infoProduct(record)">{{text}}</a>
            </template>
            <template slot="craft" slot-scope="text">{{text?'确认':'未确认'}}</template>
            <template
              slot="odRequireDueDate"
              slot-scope="text"
            >{{text?moment(text).format('YYYY-MM-DD'):''}}</template>
            <template slot="status" slot-scope="text,record">
              <statusStep :current="record.num" :status="record.status"></statusStep>
            </template>
          </a-table>
        </a-row>
      </a-col>
    </a-row>
    <a-drawer
      :destroyOnClose="true"
      placement="right"
      :closable="false"
      @close="closeDrawer"
      :visible="visible"
      :width="1040"
      :wrapStyle="{height: '100%',overflow: 'auto',paddingBottom: '108px'}"
    >
      <purchaseInfo @isDrawer="isDrawer" :purchaseId="purchaseId" :prchaseDetial="prchaseDetial" />
    </a-drawer>
    <a-drawer
      :destroyOnClose="true"
      placement="right"
      :closable="false"
      @close="closeProductDrawer"
      :visible="productVisible"
      :width="1040"
      :wrapStyle="{height: '100%',overflow: 'auto',paddingBottom: '108px'}"
    >
      <dispatchInfo @isDrawer="isProductDrawer" :goodsViewInfo="goodsViewInfo" />
    </a-drawer>
  </div>
</template>

<script>
import { postJson } from '@/api/axios.js'
import api from '@/api/index.js'
import { columns } from './basic_lib/columns'
import { mixinBasic, mixinDrawer } from '@/components/tools/mixin/mixin'
import { viewProductDetail } from '@/components/productDetails/productDetail'
import purchaseInfo from './child_info/purchaseInfo'
import dispatchInfo from '@/views/product/pdm/goods/child_info/GoodsInfo'
import classification from '@/components/list_classification/classification'
import inputSearch from './other/inputSearch'
import statusStep from '@/components/listStatus/step'
import moment from 'moment'
export default {
  mixins: [mixinBasic, mixinDrawer, viewProductDetail],
  components: {
    purchaseInfo,
    classification,
    inputSearch,
    statusStep,
    dispatchInfo
  },
  data() {
    return {
      typeInput: 'factory',
      category: 'CHANNEL',
      columns,
      data: [],
      selectedRowKeys: [],
      pagination: {
        total: 0,
        pageSize: 15,
        defaultCurrent: 1,
        showTotal: total => `共${total}条`,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '15', '30', '50', '100']
      },
      channelId: '',
      purchasePostBean: {},
      purchaseId: '',
      prchaseDetial: {}
    }
  },
  created() {
    this.getFactoryPrchase()
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: this.onChangeTab,
        hideDefaultSelections: false
      }
    },
    getMenuPermission() {
      return this.$store.state.menuPermission
    }
  },
  methods: {
    moment,
    onChangeTab(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 翻页
    onChangePage(pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.getFactoryPrchase(pagination.current)
    },
    // 选择渠道商 查看采购列表
    purchaseListId(id) {
      this.channelId = id
      this.getFactoryPrchase()
    },
    // 查询工厂销售订单分页
    getFactoryPrchase(currentPage = 1) {
      this.loading = true
      const data = this.purchasePostBean
      data.channelId = this.channelId
      data.currentPage = currentPage
      data.pageSize = this.pagination.pageSize
      postJson(api.getManuFactoryPrchase, data).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data.records
          data.forEach((item, index) => {
            item['key'] = index
          })
          this.pagination.total = Number(res.data.data.total)
          this.data = data
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 打开抽屉
    showDrawer(record) {
      this.purchaseId = record.id
      this.getProcurementDetial(record.id)
    },
    // 获取渠道商采购详情
    getProcurementDetial(id) {
      if (this.getMenuPermission.includes('DETAIL')) {
        postJson(api.getFactoryPrchaseDetial, { id }).then(res => {
          if (res.data.code === 0) {
            this.prchaseDetial = res.data.data
            this.visible = true
            this.$store.commit('setPromptTitle', {
              title: '采购详情',
              isEdit: false
            })
          } else {
            this.$message.error(res.data.msg)
          }
        })
      } else {
        this.$message.error('权限不足')
      }
    },
    // 关闭抽屉
    isDrawer(val) {
      this.visible = val
      this.getFactoryPrchase()
    },
    // 按条件搜索采购列表
    dataChange(val) {
      this.purchasePostBean = { ...val }
      this.getFactoryPrchase()
    },
    infoProduct(record) {
      this.getViewInfo(record.skuId)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~styles/purchase.less";
</style>
