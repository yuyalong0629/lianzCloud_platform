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
          <a-select-option v-for="(d, i) in searchData" :key="d.cust_id">{{ d.o_cust_name }}</a-select-option>
        </a-select>
      </div>
      <a-list :dataSource="data">
        <a-list-item style="cursor: pointer;" slot="renderItem" slot-scope="item, index">
          <a-list-item-meta :description="item.o_cust_name" @click="onChangeSearch(item.cust_id)"></a-list-item-meta>
        </a-list-item>
        <div v-if="loading && !busy" class="demo-loading-container">
          <a-spin/>
        </div>
      </a-list>
    </div>
  </div>
</template>
<script>
import infiniteScroll from 'vue-infinite-scroll'
import { getListCompanyCusts, custNamefetch } from '../basic_lib/index'

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
        console.log(res.data)
        this.data = res.data.data.records.map(item => {
          return {
            ...item
          }
        })
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
          this.data = data.concat(res.data.data.records).map(item => ({
            ...item
          }))
          this.num++
        }
      })
    },
    onChangeSearch(id) {
      // console.log(id)
      this.$emit('custId', id)
    },
    // 模糊搜索
    handleSearch(value) {
      custNamefetch.call(this, value, data => (this.searchData = data))
      console.log(this.searchData)
    },
    handleChange(value) {
      // this.custNameValue = Object.assign({}, value)
      console.log(value)
      this.searchValue = value
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
