<template>
  <div class="dispatch">
    <a-row>
      <a-col :span="12" class="dispatch-left">
        <a-row class="search" :span="24">
          <inputSearch @dataChange="dataChange"></inputSearch>
        </a-row>
        <a-row class="order-list" :span="24">
          <div
            class="order-list-item demo-infinite-container"
            v-infinite-scroll="handleInfiniteOnLoad"
            :infinite-scroll-disabled="busy"
            :infinite-scroll-distance="10"
          >
            <a-list :dataSource="dataCompany">
              <a-list-item slot="renderItem" slot-scope="item, index">
                <div
                  class="list-item"
                  @click="addCompany(item.id,index)"
                  :class="selectIndex.indexOf(index) !== -1?'active':''"
                >
                  <div class="item-left">
                    <div class="item-left-top">
                      <a href="javascript:;">{{item.name}}</a>
                      <span>{{item.odOrderNumber}}</span>
                    </div>
                    <ul class="item-left-desc">
                      <li>{{item.spec}}</li>
                      <li>{{item.cz}}</li>
                      <li>{{item.bmcl}}</li>
                      <li>{{item.odNumber}}</li>
                    </ul>
                  </div>
                  <div class="item-right">
                    <a-popover trigger="click" v-model="item.clickedVisible">
                      <template slot="content">
                        <a-form-item label="紧急程度" :label-col="{ span: 12}" :wrapper-col="{span:12}">
                          <a-switch v-model="requireLevel" />
                        </a-form-item>
                        <a-form-item class="mb" v-show="getMenuPermission.includes('DELETE')">
                          <a-button type="danger" @click="removeItem(index,item.id)">移除</a-button>
                        </a-form-item>
                      </template>
                      <a-icon
                        type="ellipsis"
                        class="item-right-edit"
                        @click="e=>updataDes(e,index)"
                      />
                    </a-popover>
                    <a-button type="primary" shape="circle" icon="plus"></a-button>
                  </div>
                </div>
              </a-list-item>
              <div v-if="loadingCompony && !busy" class="demo-loading-container">
                <a-spin />
              </div>
            </a-list>
          </div>
        </a-row>
      </a-col>
      <a-col :span="12" class="dispatch-right procurement">
        <div class="order-list demo-infinite-container">
          <a-list :dataSource="companyList">
            <a-list-item slot="renderItem" slot-scope="item">
              <div class="list-item">
                <div class="item-left">
                  <div class="item-left-top">
                    <a href="javascript:;">{{item.channelName}}</a>
                    <span>{{item.relateOrderCode}}</span>
                  </div>
                  <ul class="item-left-desc">
                    <li>{{item.relateCustName}}</li>
                    <li>{{item.num}}</li>
                  </ul>
                </div>
                <div class="item-right">
                  <a-input-number :min="0" :max="item.num" v-model="item.putNum" />
                </div>
              </div>
            </a-list-item>
          </a-list>
          <div style="height:40px"></div>
          <div class="dispatch-right-bottom">
            <a-button @click="cancelSubmit">取消</a-button>
            <a-button
              type="primary"
              @click="submit"
              :loading="submitLoading"
              v-show="getMenuPermission.includes('ADD')"
            >入库</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import infiniteScroll from 'vue-infinite-scroll'
import api from '@/api/index.js'
import inputSearch from './other/inputSearch'
import { postJson } from '@/api/axios.js'
import { mixinBasic } from '@/components/tools/mixin/mixin'
export default {
  directives: { infiniteScroll },
  mixins: [mixinBasic],
  components: {
    inputSearch
  },
  data() {
    return {
      busy: false,
      loadingCompony: false,
      dataCompanySize: 0,
      dataCompany: [],
      currentPage: 1,
      pageSize: 15,
      companyList: [],
      submitLoading: false,
      selectIndex: [],
      requireLevel: false,
      disabledUp: false,
      data: {}
    }
  },
  computed: {
    getMenuPermission() {
      return this.$store.state.menuPermission
    }
  },
  methods: {
    dataChange(data) {
      this.data = { ...data }
      this.currentPage = 1
      this.dataCompany = []
      this.getFactoryOrder()
    },
    handleInfiniteOnLoad() {
      const data = this.dataCompany
      this.loadingCompony = true
      if (data.length >= this.dataCompanySize && this.dataCompanySize !== 0 || this.disabledUp) {
        this.$message.warning('暂时没有更多数据')
        this.busy = true
        this.loadingCompony = false
      } else {
        this.getFactoryOrder(this.currentPage)
        this.loadingCompony = false
      }
    },
    removeItem(index, id) {
      const _this = this
      this.$confirm({
        title: '移除入库信息',
        content: '您确定要移除这条入库吗?',
        zIndex: 99999,
        onOk() {
          postJson(api.delWarehousing, { id }).then(res => {
            if (res.data.code === 0) {
              _this.$message.success('移除成功')
              _this.dataCompany.splice(index, 1)
              _this.dataCompanySize--
            } else {
              _this.$message.error(res.data.msg)
            }
          })
        },
        onCancel() { }
      })
    },
    // 入库
    addCompany(id, index) {
      const selectIndex = this.selectIndex
      if (selectIndex.length === 0) {
        selectIndex.push(index)
      } else {
        if (selectIndex.indexOf(index) === -1) {
          selectIndex.push(index)
        } else {
          return false
        }
      }
      postJson(api.getWarehousingOrderSale, { id }).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data
          data.forEach(item => {
            console.log(data)
            item.parentId = id
            item.putNum = item.num
          })
          this.companyList = this.companyList.concat(data)
        }
      })
    },
    // 获取入库列表
    getFactoryOrder(currentPage = 1, pageSize = 15) {
      this.disabledUp = true
      const data = this.data
      data.currentPage = currentPage
      data.pageSize = pageSize
      postJson(api.putWarehousing, data).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data.records
          this.dataCompanySize = Number(res.data.data.total)
          if (data.length) {
            data.forEach(item => {
              item.clickedVisible = false
            })
            this.dataCompany = this.dataCompany.concat(data)
          }
          this.disabledUp = false
          this.currentPage += 1
        }
      })
    },
    updataDes(e, index) {
      window.event ? window.event.cancelBubble = true : e.stopPropagation()
      this.dataCompany[index].clickedVisible = true
    },
    // 提交入库申请
    submit() {
      const data = {}
      data.list = this.dataSplic()
      data.requireLevel = this.requireLevel ? 'LEVEL1' : 'LEVEL0'
      if (data.list.length === 0) { return }
      this.submitLoading = true
      postJson(api.applyWarehousing, data).then(res => {
        if (res.data.code === 0) {
          this.$message.success('入库成功')
          this.currentPage = 1
          this.companyList = []
          this.dataCompany = []
          this.selectIndex = []
          this.getFactoryOrder()
        } else {
          this.$message.error(res.data.msg)
        }
        this.submitLoading = false
      }).catch(() => {
        this.$message.error('系统错误')
        this.submitLoading = false
      })
    },
    // 拼接上传数据
    dataSplic() {
      const companyList = this.companyList
      const data = []
      companyList.forEach(item => {
        if (item.putNum !== 0) {
          const fillterData = data.filter(itm => itm.id === item.parentId)
          if (fillterData.length === 0) {
            data.push(
              {
                id: item.parentId,
                list: [
                  {
                    id: item.id,
                    number: item.putNum
                  }
                ],
                number: item.putNum
              }
            )
          } else {
            data.forEach(itm => {
              if (itm.id === item.parentId) {
                itm.list.push({
                  id: item.id,
                  number: item.putNum
                })
                itm.number += item.putNum
              }
            })
          }
        }
      })
      return data
    },
    // 取消
    cancelSubmit() {
      this.companyList = []
      this.selectIndex = []
    }
  }
}
</script>

<style lang="less" scoped>
@import "~styles/dispach.less";
</style>
