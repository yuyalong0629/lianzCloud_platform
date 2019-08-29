<template>
  <div class="craft-diagram">
    <a-table :columns="columns" :dataSource="data" :loading="loading" :pagination="false">
      <template slot="name" slot-scope="text, record">
        <a @click="onHandleInfo(record)" href="javascript:;">{{ text }}</a>
      </template>
    </a-table>
  </div>
</template>
<script>
import { getProcessList } from '@/views/product/craft/process/basic_lib/index'

export default {
  name: 'CraftDiagram',
  data() {
    return {
      data: [],
      loading: false,
      columns: [
        {
          title: '工序名称',
          dataIndex: 'name',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        }
      ]
    }
  },
  created() {
    getProcessList.call(this)
  },
  methods: {
    onHandleInfo(record) {
      console.log(record)
      this.$emit('setCraftList', record)
      // this.$store.commit('setCraftList', record)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
