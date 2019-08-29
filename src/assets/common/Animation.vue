<template>
  <transition name="fadeIn">
    <slot></slot>
  </transition>
</template>
<script>
export default {
  name: 'Animation',
  data() {
    return {}
  }
}
</script>
<style lang="less" scoped>
.fadeIn-enter-active,
.fadeIn-leave-active {
  transition: opacity 0.5s;
}
.fadeIn-enter, .fadeIn-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
