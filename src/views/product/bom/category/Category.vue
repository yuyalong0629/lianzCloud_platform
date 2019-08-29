<template>
  <div class="category">
    <div class="category-setup">
      <a-button type="primary" @click="showDrawer" v-show="this.getMenuPermission.includes('ADD')">
        <a-icon type="plus" />新建
      </a-button>
    </div>
    <!-- 产品分类 -->
    <div class="category-tab">
      <a-table
        :columns="columns"
        :dataSource="data"
        :loading="loading"
        :pagination="false"
        :rowKey="record => record.id"
        childrenColumnName="childrens"
      >
        <template slot="name" slot-scope="text, record">
          <a @click="onHandleInfo(record)" href="javascript:;">{{ text }}</a>
        </template>
        <template slot="createTime" slot-scope="text, record">
          <span>{{ text | formatDate }}</span>
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
      <category-info @isDrawer="isDrawer" :categoryInfo="categoryInfo" />
    </a-drawer>
  </div>
</template>
<script>
import CateGoryInfo from './child_info/CategoryInfo'
import { mixinBasic, mixinDrawer } from '@/components/tools/mixin/mixin'
import { columns } from './basic_lib/column'
import { getCategoryDetail, getGoodsList } from './basic_lib/index'
import { setTimeout } from 'timers'

export default {
  name: 'Category',
  mixins: [mixinBasic, mixinDrawer],
  data() {
    return {
      data: [],
      columns,
      categoryInfo: {}
    }
  },
  created() {
    // 初始化Tab数据
    getGoodsList.call(this)
  },
  methods: {
    // 查看详情
    onHandleInfo(record) {
      if (this.getMenuPermission.includes('DETAIL')) {
        getCategoryDetail.call(this, record.id).then(() => {
          this.visible = true
        })
        this.$store.commit('setPromptTitle', {
          title: '产品分类详情',
          isEdit: true
        })
        return
      }
      this.$message.error('权限不足')
    },
    // $emit改变isvisible
    isDrawer(val) {
      this.visible = val
      // 关闭抽屉主动初始化
      this.timer = setTimeout(() => {
        getGoodsList.call(this)
      }, 100)
    },
    // 新建
    showDrawer() {
      this.visible = true
      // this.categoryInfo = {}
      this.$store.commit('setPromptTitle', {
        title: '新建产品分类',
        isEdit: false
      })
    }
  },
  watch: {
    '$store.state.menuPermission': {
      handler(val) {
        console.log(val)
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    getMenuPermission() {
      return this.$store.state.menuPermission
    }
  },
  components: {
    'category-info': CateGoryInfo
  }
}
</script>
<style lang="less" scoped>
.category {
  .category-setup {
    margin-bottom: 15px;
  }
  .category-remove {
    margin: 0 10px;
  }
  .category-select-reset {
    margin: 0 10px;
  }
  .category-select {
    margin: 16px 0;
  }
}
</style>
