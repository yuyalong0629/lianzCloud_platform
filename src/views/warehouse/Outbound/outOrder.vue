<template>
  <div>
    <a-row>
      <a-col :span="24" class="purchase-right">
        <a-form layout="horizontal" style="margin-bottom:20px">
          <a-row>
            <!-- <a-col :span="7">
              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="订单编号">
                <a-input class="inputWidth" placeholder="请输入订单编号"/>
              </a-form-item>
            </a-col>
            <a-col :span="7">
              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="交期">
                <a-range-picker
                  class="inputWidth"
                  v-model="dateArr"
                  @change="(data,dateing)=>inputChange(dateing,'date')"
                  format="YYYY/MM/DD HH:mm:ss"
                />
              </a-form-item>
            </a-col>
            <a-col :span="7">
              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品规格">
                <a-select
                  style="width:200px"
                  showSearch
                  :allowClear="true"
                  v-model="workshopOrdersPostBean.spec"
                  placeholder="请选择规格"
                  @change="(val)=>{inputChange(val,'spec')}"
                  @popupScroll="e=>currentPageChange(e)"
                  :getPopupContainer="triggerNode => triggerNode.parentNode"
                >
                  <a-select-option v-for="item in odSpecList" :key="item">{{item}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="3">
              <a-form-item>
                <span style="cursor: pointer;" @click="searchReset">重置</span>
              </a-form-item>
            </a-col>-->
          </a-row>
        </a-form>
        <a-table
          :columns="columns"
          :dataSource="data"
          @change="onChangePage"
          :pagination="pagination"
          :rowSelection="rowSelection"
          :loading="loading"
        >
          <template slot="applyCode" slot-scope="text,record">
            <a href="javascript:;" @click="showDrawer(record)">{{text}}</a>
          </template>
          <template slot="warehouse">共享仓</template>
          <template slot="status" slot-scope="text">{{text | putStorageStatus}}</template>
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
      <purchaseInfo @isDrawer="isDrawer" :prchaseId="prchaseId" :prchaseDetial="prchaseDetial" />
    </a-drawer>
  </div>
</template>

<script>
import api from '@/api/index'
import { get } from '@/api/axios'
import { mixinBasic, mixinDrawer } from '@/components/tools/mixin/mixin'
import { mixinGetProductAbout } from '@/views/sale/mixin/minxinSale'
import { columns } from './base_lib/columns'
import purchaseInfo from './child_info/purchaseInfo'
export default {
  mixins: [mixinBasic, mixinDrawer, mixinGetProductAbout],
  components: {
    purchaseInfo
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
      dateArr: [],
      prchaseDetial: {},
      prchaseId: ''
    }
  },
  created() {
    this.getListCompanySpringSpecs(this.specCurrentPage)
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
    // 重置搜索条件
    searchReset() { },
    // 搜索
    inputChange(val, type) {
      this.workshopOrdersPostBean.currentPage = 1
      if (type === 'date') {
        this.workshopOrdersPostBean.startTime = val[0]
        this.workshopOrdersPostBean.endTime = val[1]
      } else {
        this.workshopOrdersPostBean[type] = val
      }
      // 输入框防抖
      if (this.timer !== '') {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.getFactoryPolicyOrderList()
      }, 500)
    },
    // 搜索框上拉加载
    currentPageChange(e) {
      const result = this.getCurrentPageChange(e)
      if (result) {
        this.getListCompanySpringSpecs(this.specCurrentPage)
      }
    },
    // 翻页
    onChangePage(pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.getFactoryPolicyOrderList(pagination.current)
    },
    // 查看详情
    showDrawer(record) {
      if (this.getMenuPermission.includes('DETAIL')) {
        this.visible = true
        this.getProcurementDetial(record.id)
      } else {
        this.$message.error('权限不足')
      }
    },
    // 获取渠道商采购详情
    getProcurementDetial(id) {
      this.prchaseId = id
      get(api.outStorageApplyDetail + `${id}`).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data
          data.orderOutstorageApplyDetailAssign.forEach(item => {
            item.fromSkuInfo = JSON.parse(item.fromSkuInfo)
          })
          this.prchaseDetial = data
          this.$store.commit('setPromptTitle', {
            title: '出库详情',
            isEdit: false
          })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    isDrawer(val) {
      if (val) {
        this.getFactoryPolicyOrderList()
      }
      this.visible = false
    },
    // 获取出货单
    getFactoryPolicyOrderList(currentPage = 1) {
      this.loading = true
      const data = {}
      data.currentPage = currentPage
      data.pageSize = this.pagination.pageSize
      get(api.outStorageApplyList, data).then(res => {
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
