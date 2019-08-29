<template>
  <div class="prompt-title">
    <a-row>
      <a-col :span="24">
        <a-tabs
          defaultActiveKey="1"
          :tabBarGutter="10"
          :tabBarStyle="{height: '45px'}"
          @change="callback"
        >
          <a-tab-pane :tab="getPromptTitle.title" key="1">
            <slot name="orderInfo"></slot>
          </a-tab-pane>
          <!-- <a-tab-pane tab="生产信息" key="2">Content of Tab Pane 2</a-tab-pane>
          <a-tab-pane tab="质检信息" key="3">Content of Tab Pane 3</a-tab-pane>
          <a-tab-pane tab="仓储信息" key="4">Content of Tab Pane 4</a-tab-pane>
          <a-tab-pane tab="发货信息" key="5">Content of Tab Pane 5</a-tab-pane>-->
          <a-list class="prompt-wrapper" v-if="getPromptTitle.isEdit" slot="tabBarExtraContent">
            <!-- v-show="getDetailPermission.includes('UPDATE')" -->
            <span class="prompt-edit" @click="onHandlePromptEdit">
              <a-icon class="eidt-icon" type="edit" />
              <span>{{editTitle}}</span>
            </span>
            <span
              class="prompt-delete"
              @click="onHandlePromptDelete"
              v-show="getDetailPermission.includes('DELETE')"
            >
              <a-icon class="delete-icon" type="delete" />
              <span>删除</span>
            </span>
          </a-list>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Bus from '@/Bus.js'
export default {
  data() {
    return {
      editTitle: '编辑'
    }
  },
  methods: {
    callback(key) {
    },
    onHandlePromptEdit() {
      if (this.editTitle === '编辑') {
        this.editTitle = '取消'
        Bus.$emit('isDisabled', false)
        return
      }
      Bus.$emit('isDisabled', true)
      this.editTitle = '编辑'
    },
    onHandlePromptDelete() {
      this.$confirm({
        title: '删除',
        content: '您确认要删除？',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          Bus.$emit('isDelete', false)
        }
      })
    }
  },
  computed: {
    getPromptTitle() {
      return this.$store.state.promptTitle
    },
    getDetailPermission() {
      return this.$store.state.detailPermission
    }
  }
}
</script>

<style lang="less" scoped>
.prompt-title {
  // border-bottom: 1px solid #ebedf0;
  // min-height: 40px;
  margin-bottom: 50px;
  .prompt-wrapper {
    line-height: 45px;
    .prompt-edit {
      margin: 0 12px;
      cursor: pointer;
      .eidt-icon {
        color: green;
        margin-right: 4px;
      }
    }
    .prompt-delete {
      cursor: pointer;
      .delete-icon {
        color: #f00;
        margin-right: 4px;
      }
    }
  }
}
</style>
