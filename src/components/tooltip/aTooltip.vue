<template>
  <a-tooltip placement="top">
    <template slot="title">
      <span>{{value}}</span>
    </template>
    {{value}}
  </a-tooltip>
</template>

<script>
export default {
  props: ['value']
}
</script>

<style>
</style>
