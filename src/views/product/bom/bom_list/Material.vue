<template>
  <div class="goods">
    <a-row>
      <!-- 编辑 -->
      <div class="process-setup">
        <a-button
          type="primary"
          @click="showDrawer"
          v-show="this.getMenuPermission.includes('ADD')"
        >
          <a-icon type="plus" />新建
        </a-button>
        <span
          class="delete-btn"
          @click="processDelete"
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
    </a-row>
    <a-row :gutter="20">
      <a-col :span="24">
        <a-row>
          <a-col :span="24" :style="{marginBottom: '16px'}">
            <a-form layout="inline">
              <a-form-item :label-col="{span: 8}" :wrapper-col="{span: 16}" label="产品编码">
                <a-select
                  showSearch
                  allowClear
                  :value="selectCodeValue"
                  placeholder="请输入产品编码"
                  style="width: 200px"
                  :defaultActiveFirstOption="false"
                  :showArrow="false"
                  :filterOption="false"
                  @search="handleSearchCode"
                  @change="handleChangeCode"
                  :notFoundContent="null"
                >
                  <a-select-option v-for="(d, i) in selectCodeData" :key="d">{{ d }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item :label-col="{span: 8}" :wrapper-col="{span: 16}" label="产品名称">
                <a-select
                  showSearch
                  allowClear
                  :value="selectValue"
                  placeholder="请输入产品编码"
                  style="width: 200px"
                  :defaultActiveFirstOption="false"
                  :showArrow="false"
                  :filterOption="false"
                  @search="handleScrollCodeName"
                  @change="handleChangeCodeName"
                  :notFoundContent="null"
                >
                  <a-select-option v-for="(d, i) in selectData" :key="d">{{ d }}</a-select-option>
                </a-select>
                <!-- <a-select
                  allowClear
                  :value="selectValue"
                  placeholder="请输入产品名称"
                  style="width: 200px"
                  @change="handleChangeCodeName"
                  @popupScroll="e=>handleScrollCodeName(e)"
                >
                  <a-select-option v-for="(d, i) in selectData" :key="d">{{d}}</a-select-option>
                </a-select>-->
              </a-form-item>
            </a-form>
          </a-col>
          <a-col :span="24">
            <a-table
              :columns="columns"
              :dataSource="data"
              :loading="loading"
              @change="onChangePage"
              :pagination="pagination"
              :rowSelection="rowSelection"
              :scroll="{ y: '66vh' }"
            >
              <template slot="code" slot-scope="text, record">
                <a @click="onHandleInfo(record)" href="javascript:;">{{ text }}</a>
              </template>
              <template slot="time" slot-scope="text, record">
                <span>{{ text | formatDate }}</span>
              </template>
              <template slot="status" slot-scope="text">
                <a
                  href="javascript"
                  :title="text"
                  class="status"
                  :class="text==='正常'?'grn':'error'"
                ></a>
              </template>
            </a-table>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
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
      <goods-info @isDrawer="isDrawer" :goodsViewInfo="goodsViewInfo" />
    </a-drawer>
  </div>
</template>
<script>
import Goodsinfo from './child_info/GoodsInfo'
import { mixinBasic, mixinDrawer } from '@/components/tools/mixin/mixin'
import { columns, springType } from './basic_lib/column'
import {
  searchGoods,
  custNamefetch,
  bomNamefetch,
  bomCodefetch,
  getViewInfo,
  bomDelete
} from './basic_lib/index'

export default {
  name: 'Goods',
  mixins: [mixinBasic, mixinDrawer],
  data() {
    return {
      data: [],
      columns,
      springType,
      selectedRowKeys: [], // 删除勾选项
      pagination: {
        total: 0,
        defaultPageSize: 15,
        defaultCurrent: 1,
        showTotal: total => `共${total}条`,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '15', '30', '50', '100']
      },
      // 客户名称模糊搜素
      searchData: [],
      searchValue: undefined,
      // 产品编码下拉选中
      selectCodeData: [],
      selectCodeValue: undefined,
      scrollPositionCode: 1,
      // 产品名称下拉选中
      selectData: [],
      selectValue: undefined,
      scrollPositionPro: 1,
      // 弹簧种类
      springValue: undefined,
      // 详情INFO
      goodsViewInfo: {}
    }
  },
  created() {
    searchGoods.call(this, {}) // 成品列表商品搜索Tab列表
    // listCompanyGoodsName.call(this, 1) // 列表商家所有商品的商品名称
    // listCompanyGoodsCode.call(this, 1) // 列表商家所有商品的商品编码
  },
  methods: {
    // 查看详情
    onHandleInfo(record) {
      // console.log(record)
      getViewInfo.call(this, record.id).then(() => {
        this.visible = true
      })
      this.$store.commit('setPromptTitle', {
        title: '产品信息详情',
        isEdit: true
      })
    },
    // 新建
    showDrawer() {
      this.visible = true
      this.goodsViewInfo = {}
      this.$store.commit('setPromptTitle', {
        title: '新建产品信息',
        isEdit: false
      })
    },
    // $emit改变isvisible
    isDrawer(val) {
      this.visible = val
      // 关闭抽屉主动初始化
      this.timer = setTimeout(() => {
        this.rest().then(() => {
          searchGoods.call(this, {}) // 成品列表商品搜索Tab列表
        })
      }, 100)
    },
    // rest
    async rest() {
      this.selectValue = undefined
      this.selectCodeValue = undefined
    },
    // 删除
    processDelete() {
      const that = this
      if (this.selectedRowKeys.length > 0) {
        this.$confirm({
          title: '您确认要删除吗?',
          okType: 'danger',
          onOk() {
            const params = that.selectedRowKeys.join('&skuIds=')
            bomDelete.call(that, params).then(() => {
              that.rest().then(() => {
                searchGoods.call(that, {})
                that.selectedRowKeys = []
              })
            })
          },
          onCancel() {
            console.log('Cancel')
          },
          class: 'test'
        })
      }
    },
    // 分页
    onChangePage(pagination, filters, sorter) {
      console.log(pagination.current + '分页下标')
      console.log(pagination.pageSize)
      searchGoods.call(this, {
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
        skuCode: this.selectCodeValue,
        keywords: this.selectValue,
        springType: this.springValue
      })
      // 切换分页先清空选中状态
      this.selectedRowKeys = []
    },
    // 产品编码
    handleChangeCode(value) {
      console.log(value)
      this.selectCodeValue = value
      searchGoods.call(this, { skuCode: value })
    },
    handleSearchCode(value) {
      bomCodefetch.call(this, value, data => (this.selectCodeData = data))
    },
    // 产品名称
    handleChangeCodeName(value) {
      this.selectValue = value
      searchGoods.call(this, { keywords: [value || ''] })
    },
    // scroll
    handleScrollCodeName(value) {
      bomNamefetch.call(this, value, data => (this.selectData = data))
    },
    // 点击客户列表更新Tab详情
    custId(val) {
      searchGoods.call(this, { custId: val })
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
    'goods-info': Goodsinfo
  }
}
</script>
<style lang="less" scoped>
@import "~styles/variable.less";

.process-setup {
  margin-bottom: 20px;
  .delete-btn {
    margin-left: 20px;
    cursor: pointer;
    .delete-icon {
      .delete();
    }
  }
  .derive-btn {
    cursor: pointer;
    .derive-icon {
      .more();
      margin-left: 20px;
    }
  }
}
.status {
  display: block;
  width: 12px;
  height: 12px;
  border-radius: 6px;
}
.grn {
  background-color: #6bc67b;
}
.error {
  background: #f5222d;
}
</style>
