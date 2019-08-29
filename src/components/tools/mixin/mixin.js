/**
 * @description: mixin Basic
 * @param {Boolean} loading [加载loading默认false]
 * @param {Boolean} visible [抽屉Drawer默认隐藏]
 * @param {Object} labelCol [抽屉Drawer输入框label长度]
 * @param {Object} wrapperCol [抽屉Drawer输入框长度]
 * @param {Boolean} isEdit [抽屉Drawer新建/详情展示保存/提交按钮]
 * @param {Boolean} disabled [抽屉Drawer判断是否显示Input框]
 * @param {Boolean} isLabelColor [抽屉Drawer详情label颜色]
 * @param {Object} timer [定时器销毁]
 * @param {Function} onClose [抽屉Drawer点击取消关闭回调]
 * @return: mixinDrawer
 */
export const mixinBasic = {
  data() {
    return {
      loading: false,
      visible: false,
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      },
      isEdit: true,
      disabled: true, // Input
      isLabelColor: false,
      timer: null
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  methods: {
    onClose() {
      this.$emit('isDrawer', false)
    }
  }
}

/**
 * @description: mixin Drawer
 * @param {Function} showDrawer [抽屉Drawer弹出]
 * @param {Function} closeDrawer [抽屉Drawer任意关闭关闭回调]
 * @return: mixinDrawer
 */
export const mixinDrawer = {
  methods: {
    closeDrawer() {
      this.visible = false
    }
  }
}

/**
 * @description: mixinIsEdit
 * @param {Object} promptTitle.isEdit [获取vuex]
 * @param {Boolean} isEdit [判断新建还是详情进入,编辑保存按钮隐藏显示]
 * @param {Boolean} disabled [编辑保存状态INPUT显示隐藏]
 * @param {Boolean} isLabelColor [编辑保存状态label字体颜色切换]
 * @return: mixinIsEdit
 */
export const mixinIsEdit = {
  watch: {
    '$store.state.promptTitle.isEdit': {
      handler(val) {
        this.isEdit = !val
        this.disabled = !val
        // label颜色
        if (!this.isEdit) {
          this.isLabelColor = true
          return
        }
        this.isLabelColor = false
      },
      deep: true,
      immediate: true
    }
  }
}

/**
 * @description: 审批流程传入的公共处理参数
 * @param {Boolean} approval [判断页面中的顶部信息栏和底部取消提交按钮是否显示]
 * @return: approvalShow
 */
export const approvalShow = {
  props: {
    approval: {
      type: Boolean,
      default: false,
      required: false
    }
  }
}
