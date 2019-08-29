<template>
  <div class="craft-diagram">
    <h3>原材料分类</h3>
    <div
      class="demo-infinite-container"
      v-infinite-scroll="handleInfiniteOnLoad"
      :infinite-scroll-disabled="busy"
      :infinite-scroll-distance="10"
    >
      <a-list :dataSource="data">
        <a-list-item
          style="cursor: pointer;"
          slot="renderItem"
          @click="onChangeSearch(item)"
          slot-scope="item, index"
        >
          <a-list-item-meta :description="item.name"></a-list-item-meta>
          <a-list-item-meta :description="item.cz"></a-list-item-meta>
          <a-list-item-meta :description="item.spec"></a-list-item-meta>
        </a-list-item>
        <div v-if="loading && !busy" class="demo-loading-container">
          <a-spin />
        </div>
      </a-list>
    </div>
    <div
      :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #E9E9E9',
          padding: '10px 16px',
          background: '#FFF',
          textAlign: 'right'
        }"
    >
      <a-button :style="{marginRight: '8px'}" @click="onChildrenDrawerClose">取消</a-button>
      <a-button type="primary" :style="{marginRight: '8px'}" @click="onChildrenDrawerSubmit">确定</a-button>
    </div>
  </div>
</template>
<script>
import infiniteScroll from 'vue-infinite-scroll'
import { bomSearch } from './index'

export default {
  name: 'BomDrawer',
  directives: { infiniteScroll },
  data() {
    return {
      data: [],
      loading: false,
      busy: false,
      count: 1, // 滚动加载数据
      page: 1 // 初始化总页数
    }
  },
  props: {},
  beforeMount() {
    bomSearch(1).then(res => {
      if (res.data.code === 0) {
        // console.log(res.data.data.records)
        this.data = res.data.data.records.map((item, index) => ({
          ...item.sku,
          index
        }))
        // console.log(this.data)
        this.page = res.data.data.pages
      }
    })
  },
  methods: {
    handleInfiniteOnLoad() {
      const { data, count } = this
      this.loading = true
      if (count > this.page) {
        this.$message.warning('没有更多数据了')
        this.busy = true
        this.loading = false
        return
      }
      bomSearch(count).then(res => {
        if (res.data.code === 0) {
          this.loading = false
          this.data = data.concat(
            res.data.data.records.map((item, index) => ({
              ...item.sku,
              index
            }))
          )
          // console.log(this.data)
          this.count = count + 1
        }
      })
    },
    onChangeSearch(item) {
      this.$emit('bomDrawerData', item)
    },
    // 关闭列表抽屉
    onChildrenDrawerClose() {
      this.$emit('acceptChildDrawer', false)
    },
    // 提交
    onChildrenDrawerSubmit() {
      this.$emit('acceptChildDrawer', false)
    }
  }
}
</script>
<style lang="less" scoped>
.demo-infinite-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px 8px 10px;
  height: 90vh;
}
.demo-loading-container {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}
</style>
