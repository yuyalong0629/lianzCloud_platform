<template>
  <div class="craftLine">
    <!-- 编辑 -->
    <div class="craftLine-setup">
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
    <!-- Tab -->
    <div class="craftLine-tab">
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
        <template slot="status" slot-scope="text, record">
          <i v-if="text" title="发布" class="statusOK"></i>
          <i v-else="text" title="未发布" class="statusNO"></i>
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
      <craftLine-info @isDrawer="isDrawer" :craftLineInfo="craftLineInfo" />
    </a-drawer>
  </div>
</template>
<script>
import CraftLineInfo from './child_info/CraftLineInfo'
import { mixinBasic, mixinDrawer } from '@/components/tools/mixin/mixin'
import { columns } from './basic_lib/column'
import {
  getCraftLineList,
  craftLineDelete,
  craftLineInfo
} from './basic_lib/index'

export default {
  name: 'Process',
  mixins: [mixinBasic, mixinDrawer],
  data() {
    return {
      data: [],
      columns,
      selectKeyDelete: [], // 删除勾选项
      craftLineInfo: {}
    }
  },
  created() {
    getCraftLineList.call(this)
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
            craftLineDelete.call(that, that.selectKeyDelete).then(() => {
              getCraftLineList.call(that)
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
      // console.log(record)
      if (this.getMenuPermission.includes('DETAIL')) {
        craftLineInfo.call(this, record.key).then(() => {
          this.visible = true
        })
        this.$store.commit('setPromptTitle', {
          title: '工艺路线详情',
          isEdit: true
        })
        return
      }
      this.$message.error('权限不走')
    },
    // $emit改变isvisible
    isDrawer(val) {
      this.visible = val
      // 关闭抽屉主动初始化
      this.timer = setTimeout(() => {
        getCraftLineList.call(this)
      }, 100)
    },
    // 新建
    showDrawer() {
      this.visible = true
      // 新建时初始化
      this.craftLineInfo = {}
      this.$store.commit('setPromptTitle', {
        title: '新建工艺路线',
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
    'craftLine-info': CraftLineInfo
  }
}
</script>
<style lang="less" scoped>
@import '~styles/variable.less';

.craftLine {
  .craftLine-setup {
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
  .craftLine-tab {
    .statusOK {
      width: 12px;
      height: 12px;
      background: #6bc67b;
      border-radius: 50%;
      display: inline-block;
    }
    .statusNO {
      width: 12px;
      height: 12px;
      display: inline-block;
      background: #d8d8d8;
      border-radius: 50%;
    }
  }
}
</style>
