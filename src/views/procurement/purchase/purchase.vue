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
            :rowKey="record=>record.id"
            :loading="loading"
          >
            <template
              v-for="(col,index) in ['factoryOdNumber']"
              :slot="col"
              slot-scope="text,record"
            >
              <a href="javascript:;" :key="index" @click="showDrawer(col,record)">{{record[col]}}</a>
            </template>
            <!-- 状态 0.等待接单1.已接单 2.生产中 3.已完成 4.已取消 5已拒单 -->
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
      <purchaseInfo @isDrawer="isDrawer" :prchaseDetial="prchaseDetial" />
    </a-drawer>
  </div>
</template>

<script>
import { get } from '@/api/axios.js'
import api from '@/api/index.js'
import { columns } from './basic_lib/columns'
import { mixinBasic, mixinDrawer } from '@/components/tools/mixin/mixin'
import purchaseInfo from './child_info/purchaseInfo'
import classification from '@/components/list_classification/classification'
import inputSearch from './other/inputSearch'
import statusStep from '@/components/listStatus/step'
export default {
  mixins: [mixinBasic, mixinDrawer],
  components: {
    purchaseInfo,
    classification,
    inputSearch,
    statusStep
  },
  data() {
    return {
      category: 'SUPPLIER',
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
      supplierId: '',
      purchasePostBean: {},
      prchaseDetial: {},
      statusAction: false
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
    onChangeTab(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 翻页
    onChangePage(pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.getFactoryPrchase(pagination.current)
    },
    // 选择供应商 查看采购列表
    purchaseListId(id) {
      this.supplierId = id
      this.getFactoryPrchase()
    },
    getFactoryPrchase(currentPage = 1) {
      this.loading = true
      const data = this.purchasePostBean
      data.supplierId = this.supplierId
      data.currentPage = currentPage
      data.pageSize = this.pagination.pageSize
      get(api.getFactoryMaterialSupplierList, data).then(res => {
        if (res.data.code === 0) {
          this.pagination.total = Number(res.data.data.total)
          this.data = res.data.data.records
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading = false
      }).catch(() => {
        this.$message.error('系统错误')
        this.loading = false
      })
    },
    // 打开抽屉
    showDrawer(type, record) {
      switch (type) {
        case 'factoryOdNumber':
          this.getProcurementDetial(record.id)

          break
      }
    },
    // 获取渠道商采购详情
    getProcurementDetial(id) {
      if (this.getMenuPermission.includes('DETAIL')) {
        get(api.getFactoryMaterialSupplierListDetail + `${id}`).then(res => {
          if (res.data.code === 0) {
            const data = res.data.data
            data.toSkuInfo = JSON.parse(data.toSkuInfo)
            this.prchaseDetial = data
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
      if (val) {
        this.getFactoryPrchase()
      }
      this.visible = false
    },
    // 按条件搜索采购列表
    dataChange(val) {
      this.purchasePostBean.factoryOdNumber = val.odOrderNumber
      this.purchasePostBean.spec = val.spec
      this.purchasePostBean.endTime = val.endTime
      this.purchasePostBean.startTime = val.startTime
      this.getFactoryPrchase()
    }
  }
}
</script>

<style lang='less' scoped>
@import "~styles/purchase.less";
</style>
