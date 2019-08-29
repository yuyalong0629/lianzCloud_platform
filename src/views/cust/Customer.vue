<template>
  <div class="customer">
    <div class="catattr-setup">
      <a-button type="primary" @click="showDrawer" v-show="this.getMenuPermission.includes('ADD')">
        <a-icon type="plus" />新建
      </a-button>
      <span
        class="delete-btn"
        @click="custDelete"
        v-show="this.getMenuPermission.includes('DELETES')"
      >
        <a-icon class="delete-icon" type="delete" />
        <span>删除</span>
      </span>
      <a-dropdown>
        <span class="derive-btn">
          <a-icon class="derive-icon" type="check-circle" />
          <span>更多</span>
        </span>
        <a-menu slot="overlay">
          <a-menu-item key="0" v-show="this.getMenuPermission.includes('IMPORT')">
            <span>导入</span>
          </a-menu-item>
          <a-menu-item key="1" v-show="this.getMenuPermission.includes('EXPORT')">
            <span>导出</span>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <!-- 客户选择 -->
    <div class="cust-select">
      <a-form layout="inline">
        <a-row>
          <a-col :span="20">
            <a-row>
              <a-col :span="24" style="margin: 8px 0;">
                <a-form-item :label-col="{span: 8}" :wrapper-col="{span: 16}" label="客户简称">
                  <a-select
                    showSearch
                    allowClear
                    :value="custNameValue"
                    placeholder="请输入客户简称"
                    style="width: 200px"
                    :defaultActiveFirstOption="false"
                    :showArrow="false"
                    :filterOption="false"
                    @search="handleCustNameSearch"
                    @change="handleCustNameChange"
                    :notFoundContent="null"
                  >
                    <a-select-option v-for="(d, i) in custNameData" :key="d">{{ d }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="客户经理" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                  <a-select
                    showSearch
                    allowClear
                    :value="custManagerValue"
                    placeholder="请输入客户经理"
                    style="width: 200px"
                    :defaultActiveFirstOption="false"
                    :showArrow="false"
                    :filterOption="false"
                    @search="handleCustManagerSearch"
                    @change="handleCustManagerChange"
                    :notFoundContent="null"
                  >
                    <a-select-option
                      v-for="(d, i) in custManagerData"
                      :key="d.text"
                      :value="d.value"
                    >{{ d.value }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="客户等级" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                  <a-select
                    allowClear
                    placeholder="请输入客户等级"
                    :value="custSearchLevel"
                    @change="onleChangeRank"
                    style="width: 200px"
                  >
                    <a-select-option value="1">V1</a-select-option>
                    <a-select-option value="2">V2</a-select-option>
                    <a-select-option value="3">V3</a-select-option>
                    <a-select-option value="4">V4</a-select-option>
                    <a-select-option value="5">V5</a-select-option>
                  </a-select>
                </a-form-item>
                <Animation name="fadeIn">
                  <a-row v-if="advanced">
                    <a-col :span="24">
                      <a-form-item
                        label="客户编码"
                        :label-col="{ span: 8 }"
                        :wrapper-col="{ span: 14 }"
                      >
                        <a-select
                          showSearch
                          allowClear
                          :value="custCodeValue"
                          placeholder="请输入客户编码"
                          style="width: 200px"
                          :defaultActiveFirstOption="false"
                          :showArrow="false"
                          :filterOption="false"
                          @search="handleCustCodeSearch"
                          @change="handleCustCodeChange"
                          :notFoundContent="null"
                        >
                          <a-select-option v-for="(d, i) in custCodeData" :key="d">{{ d }}</a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item
                        label="客户行业"
                        :label-col="{ span: 8 }"
                        :wrapper-col="{ span: 14 }"
                      >
                        <a-select
                          allowClear
                          :value="defaultCustIndustry"
                          @change="onleChangeindustry"
                          style="width: 200px"
                          placeholder="请输入行业"
                        >
                          <a-select-option
                            v-for="item of custIndustryArr"
                            :key="item.id"
                            :value="item.id"
                          >{{ item.displayValue }}</a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item
                        label="客户状态"
                        :label-col="{ span: 8 }"
                        :wrapper-col="{ span: 14 }"
                      >
                        <a-select
                          :value="defaultStatus"
                          placeholder="客户状态"
                          style="width: 200px"
                          @change="onleChangeStatus"
                        >
                          <a-select-option value="1">已购买</a-select-option>
                          <a-select-option value="0">未购买</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </Animation>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="4">
            <a-form-item>
              <span class="cust-select-reset" @click="custRest">重置</span>
              <span @click="toggleAdvanced" style="cursor: pointer;">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'caret-up' : 'caret-down'" />
              </span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- Table -->
    <div class="cust-tab">
      <a-table
        :columns="columnCust"
        @change="onChangePage"
        :dataSource="tabData"
        :pagination="pagination"
        :rowSelection="rowSelection"
        :loading="loading"
        @showSizeChange="onShowSizeChange"
      >
        <template slot="clientCode" slot-scope="text, record">
          <a @click="onHandleInfo(record)" href="javascript:;">{{text}}</a>
        </template>
        <template slot="clientStatus" slot-scope="text, record">
          <span
            class="client-status"
            :class="[`${text}` === '1' ? 'statusOk' : 'statusNo']"
            :title="[`${text}` === '1' ? '已购买' : '未购买']"
          ></span>
        </template>
      </a-table>
    </div>
    <!-- 抽屉 -->
    <a-drawer
      :destroyOnClose="true"
      placement="right"
      :closable="false"
      @close="closeDrawer"
      :visible="visible"
      :width="1040"
      :zIndex="100"
      :wrapStyle="{height: '100%',overflow: 'auto',paddingBottom: '108px'}"
    >
      <customer-info @isDrawer="isDrawer" :customerInfo="customerInfo" />
    </a-drawer>
  </div>
</template>
<script>
import CustomerInfo from './child_info/CustomerInfo'
import { mixinBasic, mixinDrawer } from '@/components/tools/mixin/mixin'
import { columnCust } from './basic_lib/column'
import Animation from '@/assets/common/Animation'
import {
  showCustomersPage,
  removeCustomer,
  getCustomerAndMallUser,
  getCustIndustry,
  custNamefetch,
  custCodefetch,
  custManagerfetch
} from './basic_lib/index'
import { setTimeout } from 'timers'

export default {
  name: 'Catattr',
  mixins: [mixinBasic, mixinDrawer],
  data() {
    return {
      advanced: false,
      tabData: [],
      columnCust,
      advanced: false,
      pagination: {
        total: 0,
        defaultPageSize: 15,
        defaultCurrent: 1,
        showTotal: total => `共${total}条`,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '15', '30', '50', '100']
      },
      selectedRowKeys: [], // Check here to configure the default column,
      // 客户编码
      custNameData: [],
      custNameValue: undefined,
      // 客户经理
      custManagerData: [],
      custManagerValue: undefined,
      // 客户等级
      custSearchLevel: undefined,
      // 客户编码
      custCodeData: [],
      custCodeValue: undefined,
      // 客户行业
      custIndustryArr: [],
      defaultCustIndustry: undefined,
      // 客户状态
      defaultStatus: undefined,
      // 详情
      customerInfo: {}
    }
  },
  created() {
    // 获取客户行业字典表
    getCustIndustry.call(this, 'INDUSTRY')
    // 初始化客户信息
    showCustomersPage.call(this, {})
  },
  methods: {
    // 删除
    custDelete() {
      const that = this
      if (this.selectedRowKeys.length > 0) {
        this.$confirm({
          title: '您确认要删除吗?',
          okType: 'danger',
          onOk() {
            const params = that.selectedRowKeys.join('&customerIds=')
            console.log(`?customerIds=${params}`)
            removeCustomer.call(that, params).then(() => {
              that.rest().then(() => {
                showCustomersPage.call(that, {})
                that.selectedRowKeys = []
              })
            })
          },
          onCancel() {
            console.log('Cancel')
          },
          class: 'test'
        })
      } else {
        this.$message.warn('请先选择删除项')
      }
    },
    // 搜索展开
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    // 重置
    async rest() {
      this.custNameValue = undefined
      this.custManagerValue = undefined
      this.custSearchLevel = undefined
      this.custCodeValue = undefined
      this.defaultCustIndustry = undefined
      this.defaultStatus = undefined
    },
    custRest() {
      this.rest().then(() => {
        showCustomersPage.call(this, {})
      })
    },
    // 模糊搜索function
    custSearch() {
      showCustomersPage.call(this, {
        custDtoName: this.custNameValue || '', // 客户名称
        custDtoManager: this.custManagerValue || '', // 客户经理
        custDtoLevel: this.custSearchLevel - 0 || 0, // 客户等级
        custDtoCode: this.custCodeValue || '', // 客户编码
        custDtoIndustry: this.defaultCustIndustry || '', // 客户行业
        custDtoStatus: this.defaultStatus || '' // 客户状态
      })
    },
    // 客户名称搜索
    handleCustNameSearch(value) {
      custNamefetch.call(this, value, data => (this.custNameData = data))
    },
    handleCustNameChange(value) {
      console.log(value)
      this.custNameValue = value
      this.custSearch()
    },
    // 客户经理搜索
    handleCustManagerSearch(value) {
      custManagerfetch.call(this, value, data => (this.custManagerData = data))
    },
    handleCustManagerChange(value) {
      console.log(value)
      this.custManagerValue = value
      // 模糊查询分页显示
      this.custSearch()
    },
    // 客户等级
    onleChangeRank(value) {
      console.log(value)
      this.custSearchLevel = value
      // 模糊查询分页显示
      this.custSearch()
    },
    // 客户编码搜索
    handleCustCodeSearch(value) {
      custCodefetch.call(this, value, data => (this.custCodeData = data))
    },
    handleCustCodeChange(value) {
      this.custCodeValue = value
      // 模糊查询分页显示
      this.custSearch()
    },
    // 行业
    onleChangeindustry(value) {
      console.log(value)
      this.defaultCustIndustry = value
      // 模糊查询分页显示
      this.custSearch()
    },
    // 客户状态
    onleChangeStatus(value) {
      this.defaultStatus = value
      console.log(this.defaultStatus)
      // 模糊查询分页显示
      this.custSearch()
    },
    // 查看详情
    onHandleInfo(record) {
      if (this.getMenuPermission.includes('DETAIL')) {
        getCustomerAndMallUser.call(this, record.key).then(() => {
          this.visible = true
        })
        this.$store.commit('setPromptTitle', {
          title: '客户信息详情',
          isEdit: true
        })
        return
      }
      this.$message.error('权限不足')
    },
    // 分页管理
    onChangePage(pagination, filters, sorter) {
      console.log(pagination.current + '分页下标')
      console.log(pagination.pageSize)
      showCustomersPage.call(this, {
        currentPage: pagination.current,
        pageSize: pagination.pageSize
      })
      // 切换分页先清空选中状态
      this.selectedRowKeys = []
    },
    // 分页
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize)
    },
    // $emit改变isvisible
    isDrawer(val) {
      this.visible = val
      // 关闭抽屉主动初始化
      this.timer = setTimeout(() => {
        this.rest().then(() => {
          showCustomersPage.call(this, {})
        })
      }, 100)
    },
    // 新建
    showDrawer() {
      this.visible = true
      this.customerInfo = {}
      this.$store.commit('setPromptTitle', {
        title: '新建客户信息',
        isEdit: false
      })
    },
    // Tab 删除
    onChangeTab(selectedRowKeys) {
      console.log(selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    }
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: this.onChangeTab,
        hideDefaultSelections: true
      }
    },
    getMenuPermission() {
      return this.$store.state.menuPermission
    }
  },
  components: {
    'customer-info': CustomerInfo,
    Animation
  }
}
</script>
<style lang="less" scoped>
@import "~styles/variable.less";

.customer {
  .delete-btn {
    margin: 0 20px;
    cursor: pointer;
    .delete-icon {
      .delete();
    }
  }
  .derive-btn {
    cursor: pointer;
    .derive-icon {
      .more();
    }
  }
  .catattr-setup {
    margin-bottom: 15px;
  }
  .catattr-remove {
    margin: 0 10px;
  }
  .cust-select-reset {
    margin: 0 10px;
    cursor: pointer;
  }
  .cust-select {
    margin: 16px 0;
  }
  .cust-tab {
    .client-status {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
    }
    .statusOk {
      background: #6bc67b;
    }
    .statusNo {
      background: #d8d8d8;
    }
  }
}
</style>
