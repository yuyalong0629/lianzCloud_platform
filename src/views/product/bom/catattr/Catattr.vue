<template>
  <div class="catattr">
    <div class="catattr-setup">
      <a-button type="primary" @click="showDrawer" v-show="this.getMenuPermission.includes('ADD')">
        <a-icon type="plus" />新建
      </a-button>
    </div>
    <!-- 产品属性 -->
    <div class="catattr-tab">
      <a-table
        :columns="columns"
        :dataSource="data"
        :loading="loading"
        :pagination="pagination"
        :rowKey="record => record.id"
        @change="onChangePage"
        childrenColumnName="childrens"
      >
        <template slot="name" slot-scope="text, record">
          <a @click="onHandleInfo(record)" href="javascript:;">{{ text }}</a>
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
      :wrapStyle="{height: '100%',overflow: 'auto',paddingBottom: '108px'}"
    >
      <catattr-info @isDrawer="isDrawer" :catattrInfo="catattrInfo" />
    </a-drawer>
  </div>
</template>
<script>
import CatattrInfo from './child_info/CatattrInfo'
import { mixinBasic, mixinDrawer } from '@/components/tools/mixin/mixin'
import { columns } from './basic_lib/column'
import { getCategoryTree, getCatattrDetail } from './basic_lib/index'
import { setTimeout } from 'timers'

export default {
  name: 'Catattr',
  mixins: [mixinBasic, mixinDrawer],
  data() {
    return {
      data: [],
      columns,
      pagination: {
        total: 0,
        defaultPageSize: 15,
        defaultCurrent: 1,
        showTotal: total => `共${total}条`,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '15', '30', '50', '100']
      },
      catattrInfo: {}
    }
  },
  created() {
    // 初始化Tab数据
    getCategoryTree.call(this)
  },
  methods: {
    // 查看详情
    onHandleInfo(record) {
      if (this.getMenuPermission.includes('DETAIL')) {
        getCatattrDetail.call(this, record.id).then(() => {
          this.visible = true
        })
        this.$store.commit('setPromptTitle', {
          title: '产品属性详情',
          isEdit: true
        })
        return
      }
      this.$message.error('权限不足')
    },
    // 分页管理
    onChangePage(pagination, filters, sorter) {
      console.log(pagination.current)
      getCategoryTree.call(this, pagination.current, pagination.pageSize)
    },
    // $emit改变isvisible
    isDrawer(val) {
      this.visible = val
      // 关闭抽屉主动初始化
      this.timer = setTimeout(() => {
        getCategoryTree.call(this)
      }, 100)
    },
    // 新建
    showDrawer() {
      this.visible = true
      // this.catattrInfo = {}
      this.$store.commit('setPromptTitle', {
        title: '新建产品属性',
        isEdit: false
      })
    }
  },
  computed: {
    getMenuPermission() {
      return this.$store.state.menuPermission
    }
  },
  components: {
    'catattr-info': CatattrInfo
  }
}
</script>
<style lang="less" scoped>
.catattr {
  .catattr-setup {
    margin-bottom: 15px;
  }
  .catattr-remove {
    margin: 0 10px;
  }
  .catattr-select-reset {
    margin: 0 10px;
  }
  .catattr-select {
    margin: 16px 0;
  }
}
</style>
