<template>
  <div>
    <a-row>
      <a-col :span="24" class="purchase-right">
        <div class="order-add">
          <span class="delete-btn" v-show="getMenuPermission.includes('DELETES')">
            <a-icon class="delete-icon" type="delete" />
            <span>删除</span>
          </span>
        </div>
        <a-form layout="inline" style="margin-bottom:20px">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="入库编号">
            <a-input
              v-model="workshopOrdersPostBean.applyCode"
              class="inputWidth"
              @change="e=>inputChange(e.target.value,'applyCode')"
            />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品名称">
            <a-input
              v-model="workshopOrdersPostBean.name"
              class="inputWidth"
              @change="e=>inputChange(e.target.value,'name')"
            />
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="紧急程度">
            <a-select
              class="inputWidth"
              :allowClear="true"
              v-model="workshopOrdersPostBean.requireLevel"
              @change="(val)=>{inputChange(val,'requireLevel')}"
            >
              <a-select-option value="LEVEL0">正常</a-select-option>
              <a-select-option value="LEVEL1">紧急</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="状态">
            <a-select
              class="inputWidth"
              :allowClear="true"
              v-model="workshopOrdersPostBean.status"
              @change="(val)=>{inputChange(val,'status')}"
            >
              <a-select-option v-for="item in menuStatus" :key="item.key">{{item.value}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
        <a-table
          :columns="columns"
          :dataSource="data"
          @change="onChangePage"
          :pagination="pagination"
          :rowSelection="rowSelection"
          :loading="loading"
        >
          <template
            v-for="(col,index) in ['applyCode','code']"
            :slot="col"
            slot-scope="text,record"
          >
            <a href="javascript:;" :key="index" @click="showDrawer(col,record)">{{record[col]}}</a>
          </template>
          <template slot="instorageType" slot-scope="text">
            <span v-show="text === 'INDEPENDENT'">工厂自主申请</span>
            <span v-show="text === 'PRODUCTION'">工厂生产单完成入库申请</span>
            <span v-show="text === 'UPPLIER'">材料商自主申请</span>
            <span v-show="text === 'VENDOR'">材料商销售单入库申请</span>
          </template>
          <template slot="requireLevel" slot-scope="text">{{text==='LEVEL0'?'正常':'紧急'}}</template>
          <!-- 状态 0.等待接单1.已接单 2.生产中 3.已完成 4.已取消 5已拒单 -->
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
      <purchaseInfo @isDrawer="isDrawer" :purchaseId="purchaseId" :prchaseDetial="prchaseDetial" />
    </a-drawer>
  </div>
</template>

<script>
import api from '@/api/index'
import { postJson } from '@/api/axios'
import { mixinBasic, mixinDrawer } from '@/components/tools/mixin/mixin'
import { puStorageStatus } from '@/assets/utils/menu'
import { columns } from './base_lib/columns'
import purchaseInfo from './child_info/purchaseInfo'
export default {
  mixins: [mixinBasic, mixinDrawer],
  components: {
    purchaseInfo
  },
  data() {
    return {
      columns: columns,
      menuStatus: puStorageStatus,
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
      prchaseDetial: {},
      purchaseId: ''
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
    // 搜索
    inputChange(val, type) {
      this.workshopOrdersPostBean.currentPage = 1
      this.workshopOrdersPostBean[type] = val
      // 输入框防抖
      if (this.timer !== '') {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.getFactoryPolicyOrderList()
      }, 500)
    },
    // 翻页
    onChangePage(pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.getFactoryPolicyOrderList(pagination.current)
    },
    // 查看详情
    showDrawer(type, record) {
      switch (type) {
        case 'applyCode':
          this.purchaseId = record.id
          this.getProcurementDetial(record.id)
          break
      }
    },
    // 获取入库详情
    getProcurementDetial(id) {
      if (this.getMenuPermission.includes('DETAIL')) {
        postJson(api.warehousingListDetail, { id }).then(res => {
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
        })
      } else {
        this.$message.error('权限不足')
      }
    },
    isDrawer(val) {
      if (val) {
        this.getFactoryPolicyOrderList()
      }
      this.visible = false
    },
    // 获取入库列表
    getFactoryPolicyOrderList(currentPage = 1) {
      this.loading = true
      const data = this.workshopOrdersPostBean
      data.currentPage = currentPage
      data.pageSize = this.pagination.pageSize
      postJson(api.warehousingList, data).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data.records
          data.forEach((item, index) => {
            item['key'] = index
          })
          this.pagination.total = Number(res.data.data.total)
          this.data = data
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading = false
      }).catch(() => {
        this.$message.error('系统错误')
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.inputWidth {
  width: 200px;
}
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
.order-add {
  .delete-btn {
    cursor: pointer;
    .delete-icon {
      color: #f00;
      margin-right: 3px;
    }
  }
}
</style>
