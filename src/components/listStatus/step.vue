<template>
  <div class="list-about">
    <a-steps progressDot :current="current" size="small" :status="dotStatus">
      <!-- <a-popover slot="progressDot" slot-scope="{index, prefixCls}">
        <template slot="content">
          <span>{{stepStatus}}</span>
        </template>
        <span :class="`${prefixCls}-icon-dot`"></span>
      </a-popover>-->
      <a-step />
      <a-step />
      <a-step />
    </a-steps>
  </div>
</template>

<script>
export default {
  props: ['current', 'status'],
  data() {
    return {
      stepStatus: this.status
    }
  },
  computed: {
    dotStatus() {
      let dotStatus = ''
      if (this.status === 'REJECTED' || this.status === 'CANCELLED') {
        dotStatus = 'error'
      } else if (this.status === 'WAITING') {
        dotStatus = 'wait'
      } else {
        dotStatus = 'finish'
      }
      return dotStatus
    }
  }
}
</script>

<style lang="less">
.list-about .ant-steps-dot .ant-steps-item-content {
  display: none;
}
.list-about .ant-steps-dot .ant-steps-item-tail {
  margin: 0 0 0 0px;
  top: 3px;
}
.list-about .ant-steps-dot .ant-steps-item-icon {
  margin-left: 0px;
  width: 12px;
  height: 12px;
}
.list-about .ant-steps-dot .ant-steps-item-tail:after {
  height: 6px;
  width: 12px;
  margin-left: 12px;
}
.list-about
  .ant-steps-item-wait
  .ant-steps-item-icon
  > .ant-steps-icon
  .ant-steps-icon-dot {
  background-color: #eee;
}
.list-about
  .ant-steps-item-finish
  .ant-steps-item-icon
  > .ant-steps-icon
  .ant-steps-icon-dot,
.list-about .ant-steps-item-finish > .ant-steps-item-tail:after {
  background-color: #69b412;
}
.list-about
  .ant-steps-item-process
  .ant-steps-item-icon
  > .ant-steps-icon
  .ant-steps-icon-dot {
  background-color: #f0bb2e;
}
.list-about .ant-steps-dot .ant-steps-item-icon .ant-steps-icon-dot:after {
  display: none;
}
</style>
