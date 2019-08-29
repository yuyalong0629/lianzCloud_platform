<template functional>
  <a-sub-menu :key="props.menuInfo.key">
    <span slot="title">
      <icon-font v-if="props.menuInfo.icon" :type="props.menuInfo.icon"/>
      <span>{{props.menuInfo.title}}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item
        v-if="!item.children"
        :key="item.key"
        @click="() =>parent.$router.push({ path: item.url, query: parent.$route.query })"
      >
        <span>{{ item.title }}</span>
      </a-menu-item>
      <sub-menu v-else :key="item.key" :menu-info="item"/>
    </template>
  </a-sub-menu>
</template>
<script>
export default {
  name: 'SubMenu',
  props: ['menuInfo']
}
</script>
<style lang="less" scoped>
</style>
