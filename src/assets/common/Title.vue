<template>
  <div class="title">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "Title",
  data() {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  border-bottom: 1px solid #EBEDF0;
  min-height: 40px;
  margin-bottom: 10px; 
}
</style>