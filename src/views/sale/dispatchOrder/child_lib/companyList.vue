<template>
  <div>
    <div
      class="company-name-list"
      v-infinite-scroll="handleCompanyNameList"
      :infinite-scroll-disabled="busy"
      :infinite-scroll-distance="10"
    >
      <a-list :dataSource="dataCompany">
        <a-list-item slot="renderItem" slot-scope="item">
          <p
            class="company-list-item"
            :class="{active:factoryId===item.id}"
            @click="setFactoryId(item.id,item.companyName)"
          >{{item.companyName}}</p>
        </a-list-item>
        <div v-if="loadingCompony" class="demo-loading-container">
          <a-spin />
        </div>
      </a-list>
    </div>
  </div>
</template>

<script>
import infiniteScroll from 'vue-infinite-scroll'
import api from '@/api/index'
import { get } from '@/api/axios'
export default {
  props: ['factoryId'],
  directives: { infiniteScroll },
  data() {
    return {
      companyNameListSize: 0,
      dataCompany: [],
      busy: false,
      loadingCompony: false,
      currentPage: 1,
      pageSize: 50,
      name: ''
    }
  },
  methods: {
    setFactoryId(id, name) {
      this.$emit('selectCompany', { id, name })
    },
    handleCompanyNameList() {
      const data = this.dataCompany
      this.loadingCompony = true
      if (data.length >= this.companyNameListSize && this.companyNameListSize !== 0) {
        this.$message.warning('暂时没有更多数据')
        this.busy = true
        this.loadingCompony = false
        return false
      } else {
        this.getCompanyList()
        this.loadingCompony = false
      }
    },
    getCompanyList() {
      const data = {}
      data.currentPage = this.currentPage
      data.pageSize = this.pageSize
      data.type = 'FACTORY'
      get(api.companyList, data).then(res => {
        if (res.data.code === 0) {
          this.companyNameListSize = Number(res.data.data.total)
          if (this.dataCompany) {
            this.dataCompany = this.dataCompany.concat(res.data.data.records)
          } else {
            this.dataCompany = res.data.data.records
          }
          this.currentPage += 1
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.company-list-item {
  margin: 10px;
  cursor: pointer;
  &.active {
    color: #007aff;
  }
}
</style>
