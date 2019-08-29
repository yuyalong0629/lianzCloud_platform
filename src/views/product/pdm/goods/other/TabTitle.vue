<template>
  <div class="prompt-title">
    <a-row>
      <a-col :span="24">
        <a-tabs
          :activeKey="activeTab"
          :tabBarGutter="10"
          forceRender="false"
          :tabBarStyle="{height: '45px'}"
          @change="callback"
        >
          <a-tab-pane :tab="getPromptTitle.title" key="1">
            <slot name="tabGoodsInfo"></slot>
          </a-tab-pane>
          <a-tab-pane tab="商城信息" disabled key="2">
            <slot name="tabMallAttr"></slot>
          </a-tab-pane>
          <a-tab-pane tab="报价" key="3">
            <slot name="PriceTab"></slot>
          </a-tab-pane>
          <a-list class="prompt-wrapper" v-if="getPromptTitle.isEdit" slot="tabBarExtraContent">
            <span v-if="bomButton">
              <span></span>
            </span>
            <span class="prompt-edit" v-if="!bomButton" @click="onHandlePromptEdit">
              <a-icon class="eidt-icon" type="edit" />
              <span>{{editTitle}}</span>
            </span>
            <span class="prompt-delete" v-if="!bomButton" @click="onHandlePromptDelete">
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
  name: 'prompt-title',
  data() {
    return {
      editTitle: '编辑',
      bomButton: false,
      activeTab: '1',
      type: undefined
    }
  },
  mounted() {
    Bus.$on('setBomButton', val => {
      this.bomButton = val
    })
    Bus.$on('active', val => {
      this.activeTab = val
      Bus.$emit('activeTab', val)
    })
    Bus.$on('basicInfo', val => {
      this.type = val.type
    })
  },
  beforeDestroy() {
    Bus.$off('setBomButton')
    Bus.$off('active')
  },
  methods: {
    callback(key) {
      this.activeTab = key
      Bus.$emit('activeTab', key)
    },
    onHandlePromptEdit() {
      // console.log(this.isEdit)
      if (this.editTitle === '编辑') {
        this.editTitle = '取消'
        Bus.$emit('isDisabled', false)
        return
      }
      Bus.$emit('isDisabled', true)
      this.editTitle = '编辑'
    },
    onHandlePromptDelete() {
      const that = this
      this.$confirm({
        title: '删除',
        content: '您确认要删除？',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          that.$emit('isDelete', false)
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    }
  },
  computed: {
    getPromptTitle() {
      return this.$store.state.promptTitle
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
      .set-icon {
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
