<template>
  <div class="permission">
    <a-alert class="permission-title" type="success">
      <template slot="message">
        欢迎
        <strong>{{name}}({{companyName}})</strong>
        登录大唐弹簧云管理平台
      </template>
    </a-alert>
  </div>
</template>
<script>
export default {
  name: 'Permission',
  data() {
    return {
      companyName: '',
      name: ''
    }
  },
  created() {
    this.companyName = localStorage.getItem('companyName')
    this.name = localStorage.getItem('NICK')
  }
}
</script>
<style lang="less" scoped>
.permission {
  .permission-title {
    font-size: 18px;
    margin: 30px;
    text-align: center;
  }
}
</style>
