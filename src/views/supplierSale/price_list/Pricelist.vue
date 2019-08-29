<template>
  <div class="price-list">
    <a-row :gutter="20">
      <a-col :span="5">
        <scroll-list @custId="custId"></scroll-list>
      </a-col>
      <a-col :span="19">
        <a-row>
          <a-col :span="24"></a-col>
          <a-col :span="24">
            <a-table
              :columns="columns"
              :dataSource="data"
              :loading="loading"
              @change="onChangePage"
              :pagination="pagination"
              :scroll="{ y: '66vh' }"
              :rowKey="record => Math.random(record.key)"
            >
              <template slot="creatorTime" slot-scope="text, record">
                <span>{{ text | formatDate }}</span>
              </template>
              <template slot="factoryName" slot-scope="text, record">
                <ul v-for="item in text">
                  <li>{{ item }}</li>
                </ul>
              </template>
              <template slot="modifyTime" slot-scope="text, record">
                <ul v-for="item in text">
                  <li>{{ item | formatDate }}</li>
                </ul>
              </template>
            </a-table>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import ScrollList from './child_info/ScrollLIst'
import { mixinBasic, mixinDrawer } from '@/components/tools/mixin/mixin'
import { searchGoods } from './basic_lib/index'
import { columns } from './basic_lib/columns'

export default {
  name: 'Pricelist',
  mixins: [mixinBasic, mixinDrawer],
  data() {
    return {
      data: [],
      columns,
      selectedRowKeys: [],
      setCustId: '',
      pagination: {
        total: 0,
        defaultPageSize: 15,
        defaultCurrent: 1,
        showTotal: total => `共${total}条`,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '15', '30', '50', '100']
      }
    }
  },
  created() {
    searchGoods.call(this, 1, 15, this.setCustId) // 成品列表商品搜索Tab列表
  },
  methods: {
    // 点击客户列表更新Tab详情
    custId(val) {
      this.setCustId = val
      searchGoods.call(this, 1, 15, val)
    },
    // 分页
    onChangePage(pagination, filters, sorter) {
      searchGoods.call(
        this,
        pagination.current,
        pagination.pageSize,
        this.setCustId
      )
      // 切换分页先清空选中状态
      this.selectedRowKeys = []
    }
    // Tab 删除
    // onChangeTab(selectedRowKeys) {
    //   console.log(selectedRowKeys)
    //   this.selectedRowKeys = selectedRowKeys
    // }
  },
  computed: {
    // rowSelection() {
    //   const { selectedRowKeys } = this
    //   return {
    //     selectedRowKeys,
    //     onChange: this.onChangeTab,
    //     hideDefaultSelections: true
    //   }
    // }
  },
  components: {
    'scroll-list': ScrollList
  }
}
</script>
<style lang="less" scoped>
</style>
