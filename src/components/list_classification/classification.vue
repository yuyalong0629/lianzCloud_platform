<template>
  <div class="purchase-left">
    <div class="purchase-left-search">
      <a-input-search @search="onSearch" enterButton />
      <div
        class="demo-infinite-container"
        v-infinite-scroll="handleCompanyNameList"
        :infinite-scroll-disabled="busy"
        :infinite-scroll-distance="10"
      >
        <a-list :dataSource="data">
          <a-list-item slot="renderItem" slot-scope="item">
            <a-list-item-meta>
              <p
                slot="description"
                class="company-name"
                @click="companyPurchase(item.id)"
                :class="{active:item.id===activeId}"
              >{{item.companyName}}</p>
            </a-list-item-meta>
          </a-list-item>
          <div v-if="loading && !busy" class="demo-loading-container">
            <a-spin />
          </div>
        </a-list>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/index'
import { get } from '@/api/axios'
import infiniteScroll from 'vue-infinite-scroll'
export default {
  directives: { infiniteScroll },
  props: {
    category: {
      type: String,
      defalut: '',
      required: true
    }
  },
  data() {
    return {
      busy: false,
      loading: false,
      data: [],
      dataSize: 0,
      currentPage: 1,
      pageSize: 20,
      name: '',
      activeId: ''
    }
  },
  methods: {
    onSearch(value) {
      this.data = []
      this.name = value
      this.currentPage = 1
      this.getCompanyList(value)
    },
    companyPurchase(id) {
      this.activeId = id
      this.$emit('purchaseListId', id)
    },
    handleCompanyNameList() {
      const data = this.data
      this.loading = true
      if (data.length >= this.dataSize && this.dataSize !== 0) {
        this.$message.warning('暂时没有更多数据')
        this.busy = true
        this.loading = false
        return
      }
      this.getCompanyList(this.name)
    },
    getCompanyList(val) {
      const data = {}
      data.currentPage = this.currentPage
      data.pageSize = this.pageSize
      data.type = this.category
      data.name = val
      get(api.companyList, data).then(res => {
        if (res.data.code === 0) {
          this.dataSize = Number(res.data.data.total)
          this.data = this.data.concat(res.data.data.records)
          this.currentPage += 1
        }
        this.loading = false
      })
    }
  }

}
</script>

<style lang="less" scoped>
.purchase-left {
  border: 1px solid #eee;
  min-height: 840px;
  max-height: 840px;
  padding: 10px;
  box-sizing: border-box;

  .company-name {
    font-size: 14px;
    padding: 10px 20px;
    margin: 0;
    text-align: left;
    cursor: pointer;

    &.active {
      background-color: #4a90e2;
      color: #fff;
    }
  }
}

.demo-infinite-container {
  border: none;
  border-radius: 4px;
  overflow: auto;
  margin: 8px 0;
  padding: 0px 24px;
  max-height: 770px;
}

.demo-loading-container {
  margin-top: 40%;
  width: 100%;
  text-align: center;
}
</style>
