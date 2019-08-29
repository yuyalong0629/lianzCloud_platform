<template>
  <div>
    <a-row>
      <a-col :span="24" class="purchase-right">
        <inputSearch @dataChange="dataChange"></inputSearch>
        <a-table
          :columns="columns"
          :dataSource="data"
          @change="onChangePage"
          :pagination="pagination"
          :rowSelection="rowSelection"
          :loading="loading"
        >
          <template
            v-for="(col,index) in ['odOrderNumber','code']"
            :slot="col"
            slot-scope="text,record"
          >
            <a href="javascript:;" :key="index" @click="showDrawer(col,record)">{{record[col]}}</a>
          </template>
          <span
            slot="odRequireDueDate"
            slot-scope="text"
          >{{text?moment(text).format('YYYY-MM-DD'):''}}</span>
          <template slot="status" slot-scope="text,record">
            <statusStep :current="record.num" :status="record.status"></statusStep>
          </template>
        </a-table>
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
      <purchaseInfo
        @isDrawer="isDrawer"
        :factoryProductionOrderId="factoryProductionOrderId"
        :purchaseId="purchaseId"
        :prchaseDetial="prchaseDetial"
      />
    </a-drawer>
  </div>
</template>

<script>
import api from '@/api/index'
import { postJson } from '@/api/axios'
import { mixinBasic, mixinDrawer } from '@/components/tools/mixin/mixin'
import { columns } from './base_lib/columns'
import purchaseInfo from './child_lib/purchaseInfo'
import inputSearch from './other/inputSearch'
import statusStep from '@/components/listStatus/step'
import moment from 'moment'
export default {
  mixins: [mixinBasic, mixinDrawer],
  components: {
    purchaseInfo,
    inputSearch,
    statusStep
  },
  data() {
    return {
      columns: columns,
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
      workshopOrdersPostBean: {},
      purchaseId: '',
      factoryProductionOrderId: '',
      prchaseDetial: {}
    }
  },
  created() {
    this.getFactoryPolicyOrderList()
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
    // 搜索
    dataChange(val) {
      this.workshopOrdersPostBean = { ...val }
      this.getFactoryPolicyOrderList()
    },
    // 翻页
    onChangePage(pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.getFactoryPolicyOrderList(pagination.current)
    },
    // 查看详情
    showDrawer(type, record) {
      switch (type) {
        case 'odOrderNumber':
          this.purchaseId = record.id
          this.factoryProductionOrderId = record.factoryProductionOrderId
          this.getProcurementDetial(record.id)
          break
      }
    },
    getProcurementDetial(id) {
      if (this.getMenuPermission.includes('DETAIL')) {
        postJson(api.getFactoryPolicyDetail, { id }).then(res => {
          if (res.data.code === 0) {
            const data = res.data.data
            data.list.forEach((item, index) => {
              item['key'] = index
            })
            this.prchaseDetial = data
            this.visible = true
            this.$store.commit('setPromptTitle', {
              title: '采购详情',
              isEdit: false
            })
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.$message.error('系统错误')
        })
      } else {
        this.$message.error('权限不足')
      }
    },
    isDrawer(val) {
      this.visible = val
      this.getFactoryPolicyOrderList()
    },
    // 获取工厂生产单
    getFactoryPolicyOrderList(currentPage = 1) {
      this.loading = true
      const data = this.workshopOrdersPostBean
      data.currentPage = currentPage
      data.pageSize = this.pagination.pageSize
      postJson(api.getFactoryPolicyOrderList, data).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data.records
          data.forEach((item, index) => {
            item['key'] = index
          })
          this.pagination.total = Number(res.data.data.total)
          this.data = data
        }
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.step-dot {
  position: relative;
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #eee;
  margin: 4px;
  &:not(:last-child)::after {
    position: absolute;
    content: "";
    display: inline-block;
    width: 8px;
    height: 4px;
    background-color: #eee;
    right: -8px;
    top: 3px;
  }
  &.finish {
    background-color: #69b412;
  }
  &.error {
    background-color: #fa5555;
  }
  &.process {
    background-color: #f0bb2e;
  }
}
</style>
