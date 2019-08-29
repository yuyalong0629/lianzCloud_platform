<template>
  <a-locale-provider :locale="zhCN">
    <div id="app">
      <router-view />
    </div>
  </a-locale-provider>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

export default {
  data() {
    return {
      zhCN
    }
  }
}
</script>

<style lang="less">
@import '~styles/reset.less';

.ant-layout-content {
  min-height: auto !important;
}
.ant-btn-dashed:hover,
.ant-btn-dashed:focus,
.ant-btn-dashed:active,
.ant-btn-dashed.active {
  color: rgba(0, 0, 0, 0.65) !important;
}
// 表格统一padding
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  padding: 12px 16px !important;
}
</style>
