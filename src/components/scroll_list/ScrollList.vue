<template>
  <div class="scroll-list">
    <div
      class="demo-infinite-container"
      v-infinite-scroll="handleInfiniteOnLoad"
      :infinite-scroll-disabled="busy"
      :infinite-scroll-distance="10"
    >
      <div class="search-list">
        <a-select
          showSearch
          allowClear
          :value="searchValue"
          placeholder="请输入客户名称"
          style="width: 200px"
          :defaultActiveFirstOption="false"
          :showArrow="false"
          :filterOption="false"
          @search="handleSearch"
          @change="handleChange"
          :notFoundContent="null"
        >
          <a-select-option v-for="(d, i) in searchData" :key="d.id">{{ d.custShortName }}</a-select-option>
        </a-select>
      </div>
      <a-list :dataSource="data">
        <a-list-item style="cursor: pointer;" slot="renderItem" slot-scope="item, index">
          <a-list-item-meta :description="item.custShortName" @click="onChangeSearch(item.id)"></a-list-item-meta>
        </a-list-item>
        <div v-if="loading && !busy" class="demo-loading-container">
          <a-spin />
        </div>
      </a-list>
    </div>
  </div>
</template>
<script>
import infiniteScroll from 'vue-infinite-scroll'
import { getListCompanyCusts, custNamefetch } from './index.js'

export default {
  name: 'ScrollList',
  directives: { infiniteScroll },
  data() {
    return {
      data: [],
      loading: false,
      busy: false,
      num: 1, // 滚动加载数据
      page: 1, // 初始化总页数
      searchData: [],
      searchValue: undefined
    }
  },
  beforeMount() {
    getListCompanyCusts(1).then(res => {
      if (res.data.code === 0) {
        // console.log(res.data.data.records)
        this.data = res.data.data.records.map((item, index) => ({
          ...item,
          index
        }))
        this.page = res.data.data.pages
      }
    })
  },
  methods: {
    onSearch(value) {
      console.log(value)
    },
    handleInfiniteOnLoad() {
      const data = this.data
      this.loading = true
      if (this.num > this.page) {
        this.$message.warning('没有更多数据了')
        this.busy = true
        this.loading = false
        return
      }
      getListCompanyCusts(this.num).then(res => {
        if (res.data.code === 0) {
          this.loading = false
          this.data = data.concat(res.data.data.records).map((item, index) => ({
            ...item,
            index
          }))
          this.num++
        }
      })
    },
    onChangeSearch(id) {
      console.log(id)
      this.$emit('custId', id)
    },
    // 模糊搜索
    handleSearch(value) {
      custNamefetch.call(this, value, data => (this.searchData = data))
    },
    handleChange(value) {
      this.searchValue = value
      this.$emit('custVal', value)
    }
  },
  components: {}
}
</script>
<style lang="less">
.demo-infinite-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px 8px 10px;
  height: 84vh;
}
.demo-loading-container {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}
</style>
