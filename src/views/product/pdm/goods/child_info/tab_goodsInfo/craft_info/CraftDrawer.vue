<template>
  <div class="craft-diagram">
    <a-table :columns="columns" :dataSource="data" :loading="loading" :pagination="false">
      <template slot="name" slot-scope="text, record">
        <a href="javascript:;" @click="getCraftLineId(record)">{{ text }}</a>
      </template>
    </a-table>
    <div
      :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #E9E9E9',
          padding: '10px 16px',
          background: '#FFF',
          textAlign: 'right',
        }"
    >
      <a-button v-show="false" :style="{marginRight: '8px'}" @click="onChildrenDrawerClose">取消</a-button>
      <a-button
        v-show="false"
        type="primary"
        :style="{marginRight: '8px'}"
        @click="onChildrenDrawerSubmit"
      >确定</a-button>
    </div>
  </div>
</template>
<script>
import { getCraftLineList } from '@/views/product/craft/craftLine/basic_lib/index.js'
import { craftLineInfo } from './index'

export default {
  name: 'CraftDrawer',
  data() {
    return {
      data: [],
      loading: false,
      columns: [
        {
          title: '工艺名称',
          dataIndex: 'name',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        }
      ],
      newData: [],
      getList: []
    }
  },
  created() {
    getCraftLineList.call(this)
  },
  methods: {
    // 关闭列表抽屉
    onChildrenDrawerClose() {
      this.$emit('acceptChildDrawer', false)
    },
    // 选中确定
    onChildrenDrawerSubmit() {
      this.$emit('acceptChildDrawer', false)
    },
    getCraftLineId(record) {
      console.log(record)
      craftLineInfo.call(this, record.key).then(() => {
        this.$emit('craftDrawerData', {
          record: record,
          list: this.getList
        })
        this.$emit('acceptChildDrawer', false)
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
