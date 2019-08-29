<template>
  <div class="process">
    <!-- 编辑 -->
    <div class="process-setup">
      <a-button type="primary" @click="showDrawer" v-show="this.getMenuPermission.includes('ADD')">
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
    <!-- 产品分类 -->
    <div class="category-tab">
      <a-table
        :columns="columns"
        :dataSource="data"
        :loading="loading"
        :pagination="false"
        :rowSelection="rowSelection"
      >
        <template slot="code" slot-scope="text, record">
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
      <process-info @isDrawer="isDrawer" :processInfo="processInfo" />
    </a-drawer>
  </div>
</template>
<script>
import ProcessInfo from './child_info/ProcessInfo'
import { mixinBasic, mixinDrawer } from '@/components/tools/mixin/mixin'
import { columns } from './basic_lib/column'
import {
  getProcessList,
  deProcessDelete,
  getProcessInfo
} from './basic_lib/index'

export default {
  name: 'Process',
  mixins: [mixinBasic, mixinDrawer],
  data() {
    return {
      data: [],
      columns,
      selectKeyDelete: [], // 删除勾选项
      processInfo: {}
    }
  },
  created() {
    getProcessList.call(this)
  },
  methods: {
    // 删除
    processDelete() {
      const that = this
      if (this.selectKeyDelete.length > 0) {
        this.$confirm({
          title: '您确认要删除吗?',
          okType: 'danger',
          onOk() {
            deProcessDelete.call(that, that.selectKeyDelete).then(() => {
              getProcessList.call(that)
              that.selectKeyDelete = []
            })
          },
          onCancel() {
            console.log('Cancel')
          },
          class: 'test'
        })
      }
    },
    // 查看详情
    onHandleInfo(record) {
      console.log(record)
      if (this.getMenuPermission.includes('DETAIL')) {
        getProcessInfo.call(this, record.key).then(() => {
          this.visible = true
        })
        this.$store.commit('setPromptTitle', {
          title: '工序管理详情',
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
        getProcessList.call(this)
      }, 100)
    },
    // 新建
    showDrawer() {
      this.visible = true
      this.processInfo = {}
      this.$store.commit('setPromptTitle', {
        title: '新建工序管理',
        isEdit: false
      })
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectKeyDelete = [...selectedRowKeys]
          console.log(this.selectKeyDelete)
          console.log(selectedRows)
          console.log(selectedRowKeys)
        }
      }
    },
    getMenuPermission() {
      return this.$store.state.menuPermission
    }
  },
  components: {
    'process-info': ProcessInfo
  }
}
</script>
<style lang="less" scoped>
@import '~styles/variable.less';

.process {
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
}
</style>
