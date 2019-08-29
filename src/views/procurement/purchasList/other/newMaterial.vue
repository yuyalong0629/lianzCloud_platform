<template>
  <a-row class="material">
    <a-col :span="12" class="new-material">
      <a-tree :treeData="gData" @select="onExpand" :autoExpandParent="autoExpandParent"></a-tree>
    </a-col>
    <a-col :span="12" style="padding:0 10px">
      <div
        class="order-list order-list-item demo-infinite-container"
        v-infinite-scroll="handleInfiniteOnLoad"
        :infinite-scroll-disabled="busy"
        :infinite-scroll-distance="10"
      >
        <a-list :dataSource="data">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <div class="list-item" @click="addMaterial(item.id,item.unit)">
              <div class="item-left">
                <div class="item-left-top">
                  <a href="javascript:;">{{item.name}} {{item.code}}</a>
                </div>
                <ul class="item-left-desc">
                  <li>{{item.spec}}</li>
                  <li>{{item.cz}}</li>
                  <li>{{item.standard}}</li>
                </ul>
              </div>
              <div class="item-right">
                <a-button type="primary" shape="circle" icon="plus"></a-button>
              </div>
            </div>
          </a-list-item>
          <div v-if="loading && !busy" class="demo-loading-container">
            <a-spin />
          </div>
        </a-list>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import infiniteScroll from 'vue-infinite-scroll'
import api from '@/api/index'
import { get, post, postJson } from '@/api/axios'
export default {
  directives: { infiniteScroll },
  data() {
    return {
      expandedKeys: [],
      autoExpandParent: true,
      gData: [],
      busy: false,
      loading: false,
      currentPage: 1,
      pages: 1,
      data: []
    }
  },
  created() {
    this.getCategoryBomTree()
  },
  methods: {
    onExpand(val) {
      if (val.length) {
        this.expandedKeys = val
        this.data = []
        this.currentPage = 1
        this.getQueryMaterialBaseInfo()
      }
    },
    handleInfiniteOnLoad() {
      this.busy = true
      this.loading = true
      if (this.expandedKeys.length) {
        if (this.currentPage > this.pages) {
          return
        } else {
          this.getQueryMaterialBaseInfo(this.currentPage)
        }
        this.busy = false
        this.loading = false
      }
    },
    // 获取公司所有原材料分类
    getCategoryBomTree() {
      get(api.bomCategoryTree).then(res => {
        if (res.data.code === 0) {
          const mapObj = {
            name: 'title',
            id: 'key',
            childrens: 'children'
          }
          // 全局替换字段名
          const conversion = JSON.parse(JSON.stringify(res.data.data).replace(/name|id|childrens/gi, function (matched) {
            return mapObj[matched]
          }))
          this.gData = Array.from(conversion)
        }
      })
    },
    // 获取原材料基本信息
    getQueryMaterialBaseInfo(currentPage = 1) {
      const data = {}
      data.catId = this.expandedKeys[0]
      data.pageSize = 15
      data.currentPage = currentPage
      post(api.getQueryMaterialBaseInfo, data).then(res => {
        if (res.data.code === 0) {
          this.currentPage += 1
          this.data = this.data.concat(res.data.data.records)
          this.pages = Number(res.data.data.pages)
        }
      })
    },
    // 添加新材料
    addMaterial(id, unit) {
      console.log(1)
      postJson(api.addMaterialOrderMateriala, { materialId: id, unit: unit }).then(res => {
        if (res.data.code === 0) {
          this.$message.success('添加成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~styles/dispach.less";
.material {
  overflow: auto;
  min-height: 60vh;
  max-height: 60vh;
}
.new-material {
  padding: 0 10px;
  min-height: 60vh;
}

.demo-infinite-container {
  border-left: 1px solid #ccc;
  min-height: 60vh;
}
</style>
