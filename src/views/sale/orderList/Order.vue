<template>
  <div class="order">
    <!-- 头部选择区 -->
    <div class="order-add">
      <a-button type="primary" @click="orderInfo('-1')" v-show="getMenuPermission.includes('ADD')">
        <a-icon type="plus" />新建
      </a-button>
      <span class="delete-btn" @click="deleteOrder" v-show="getMenuPermission.includes('DELETES')">
        <a-icon class="delete-icon" type="delete" />
        <span>删除</span>
      </span>
      <a-dropdown>
        <span>
          <a-icon class="order-derive" type="check-circle" />
          <span>更多</span>
        </span>
        <a-menu slot="overlay">
          <a-menu-item key="0" v-show="getMenuPermission.includes('IMPORT')">
            <span>导入</span>
          </a-menu-item>
          <a-menu-item key="1" v-show="getMenuPermission.includes('EXPORT')">
            <span>导出</span>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <div class="order-select">
      <orderSearch @dataChange="dataChange"></orderSearch>
    </div>
    <div class="order-table">
      <a-table
        :columns="columns"
        @change="onChangePage"
        :dataSource="tabData"
        :pagination="pagination"
        :rowSelection="rowSelection"
        :loading="loading"
        :scroll="{ x: 2750 }"
      >
        <template slot="oorderNumber" slot-scope="text,record">
          <a href="javascript:;" @click="orderInfo(record.id)">{{text}}</a>
        </template>
        <template slot="osource" slot-scope="text">
          <span v-if="text === 'MALLONLINE'">线上商城</span>
          <span v-if="text === 'CUSTOMIZEDONLINE'">线上定制</span>
          <span v-if="text === 'CUSTOMIZEDUNDERLINE'">线下定制</span>
        </template>
        <template slot="ostatus" slot-scope="text">
          <template v-for="(item,index) in orderStatus">
            <a
              href="javascript:;"
              :title="item.label"
              v-if="text === item.value"
              class="status-color"
              :class="(text === 'REJECTORDER')?'status-red':(text ==='PREORDER' || text === 'CANCEL')?'status-gray':'status-green'"
              :key="index"
            ></a>
          </template>
        </template>
        <template
          v-for="(col,index) in ['odSkuCode', 'odSkuName', 'odSpec','taxRate','odSkuCustPrice', 'odNumber', 'odAmount', 'odRequireDueDate','odPromiseDueDate','odSkuCustDrawNum','odOrderplacingTime']"
          :slot="col"
          slot-scope="text, record"
        >
          <template>
            <div v-for="(item,index) in record.skuList" :key="index">
              <span v-if="col === 'taxRate'">
                <span v-if="item.sku">{{item.sku[col]}}</span>
              </span>
              <span
                v-else-if="col === 'odRequireDueDate' || col === 'odPromiseDueDate' || col === 'odOrderplacingTime'"
              >
                <span v-if="item[col]">{{item[col]| formatDate}}</span>
              </span>
              <span v-else>{{item[col]}}</span>
            </div>
          </template>
        </template>
      </a-table>
    </div>
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
      <orderInfo @isVisible="isVisible" :editInfo="editInfo" :detialList="detialList"></orderInfo>
    </a-drawer>
  </div>
</template>

<script>
import { postJson, deleted } from '@/api/axios.js'
import api from '@/api/index.js'
import orderInfo from './child_lib/orderDetail'
import { columns, orderStatus } from './basic_lib/menu.js'
import orderSearch from './other/orderSearch'
export default {
  components: {
    orderInfo,
    orderSearch
  },
  data() {
    return {
      editInfo: false,
      pagination: {
        total: 0,
        defaultPageSize: 15,
        pageSize: 15,
        defaultCurrent: 1,
        showTotal: total => `共${total}条`,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '15', '30', '50', '100']
      },
      columns,
      orderStatus,
      tabData: [],
      selectedRowKeys: [],
      selectedRows: [],
      loading: true,
      orderEncapsulation: {},
      visible: false,
      detialList: '',
      buttons: [] // 页面显示的按钮
    }
  },
  created() {
    this.getOrderList()
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
    // 翻页时触发
    onChangePage(pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.getOrderList(pagination.current)
    },
    // 获取列表数据
    getOrderList(currentPage = 1) {
      const pageSize = this.pagination.pageSize
      this.loading = true
      postJson(
        api.getOrderList + `${currentPage}/${pageSize}`,
        this.orderEncapsulation
      ).then(res => {
        if (res.data.code === 0) {
          if (res.data.data.records) {
            this.tabData = res.data.data.records
            this.tabData.forEach((item, index) => {
              item.key = index
            })
          } else {
            this.tabData = []
          }
          this.pagination.total = res.data.data.total
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading = false
        this.selectedRowKeys = []
      }).catch(() => {
        this.loading = false
      })
    },
    // 关闭新建订单/详情抽屉
    isVisible(isVisible) {
      this.visible = false
      if (isVisible) {
        this.getOrderList()
      }
    },
    // 关闭新建/详情订单抽屉
    onCustomerInfo() {
      this.visible = false
    },
    // 打开新建/详情订单抽屉
    orderInfo(id) {
      if (id === '-1') {
        this.editInfo = false
        this.$store.commit('setPromptTitle', {
          title: '新建销售订单',
          isEdit: false
        })
        this.visible = true
      } else {
        if (this.getMenuPermission.includes('DETAIL')) {
          this.detialList = id
          this.editInfo = true
          this.$store.commit('setPromptTitle', {
            title: '销售订单详情',
            isEdit: true
          })
          this.visible = true
        } else {
          this.$message.error('权限不足')
        }
      }
    },
    onChangeTab(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 订单的批量删除
    deleteOrder() {
      var selectedRowKeys = this.selectedRowKeys
      var selectedRows = this.selectedRows
      var idStr = []
      var _this = this
      if (selectedRowKeys.length === 0) {
        this.$message.error('请选择要删除的订单')
      } else {
        selectedRows.forEach((item, index) => {
          idStr.push(item.id)
        })
        this.$confirm({
          title: '您确定要删除订单信息吗？',
          content: '当您点击确定过后将删除选中的订单信息',
          cancelText: '取消',
          okText: '确定',
          onOk() {
            deleted(api.deletedBatch + `?idStr=${idStr.join(',')}`).then(
              res => {
                if (res.data.code === 0) {
                  _this.$message.success('删除成功')
                  _this.getOrderList()
                }
              }
            )
          }
        })
      }
    },
    dataChange(val) {
      this.orderEncapsulation = { ...val }
      this.getOrderList()
    }
  }
}
</script>

<style lang='less' scoped>
@import "~styles/variable.less";

.order {
  .order-add {
    .order-remove {
      margin: 0 20px;
    }
    .order-derive {
      color: #6bc67b;
      margin-right: 5px;
    }
    .delete-btn {
      margin: 0 20px;
      cursor: pointer;
      .delete-icon {
        color: #f00;
        margin-right: 3px;
      }
    }
  }
  .order-select {
    margin: 20px 0 0;
    .order-select-reset {
      margin: 0 8px;
    }
  }
}
.status-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  // text-align: center
}
.status-green {
  background-color: #6bc67b;
}
.status-gray {
  background-color: #d8d8d8;
}
.status-red {
  background-color: #f5222d;
}
.status-yellow {
  background-color: yellow;
}
</style>
