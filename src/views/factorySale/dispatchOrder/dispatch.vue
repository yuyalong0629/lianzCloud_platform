<template>
  <div class="dispatch">
    <a-row>
      <a-col :span="12" class="dispatch-left">
        <inputSearch @changeInput="changeInput"></inputSearch>
        <div class="order-list">
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
                  @click="addCompany(item.channelSkuId,index,item.number,item.odRequireDueDate)"
                >
                  <div class="item-left">
                    <div class="item-left-top">
                      <a
                        href="javascript:;"
                        @click="e=>infoView(e,item.channelSkuId,index)"
                      >{{item.name}}</a>
                      <span>{{item.bom}} {{item.craft}}</span>
                    </div>
                    <ul class="item-left-desc">
                      <li>{{item.spec}}</li>
                      <li>{{item.cz}}</li>
                      <li>{{item.odRequireDueDate?moment(item.odRequireDueDate).format(dateFormat):''}}</li>
                      <li>{{item.number}}{{item.unit}}</li>
                    </ul>
                  </div>
                  <div class="item-right">
                    <a-popover trigger="click" v-model="item.clickedVisible">
                      <template slot="content">
                        <a-form-item
                          label="交期"
                          :label-col="{ span: 5,offset:0 }"
                          :wrapper-col="{span:12}"
                          class="mb"
                        >
                          <a-date-picker
                            v-if="updateList.date"
                            format="YYYY-MM-DD"
                            :value="moment(updateList.date, 'YYYY-MM-DD')"
                            style="width:170px;"
                            @change="updateTime"
                          />
                          <a-date-picker
                            v-else
                            format="YYYY-MM-DD"
                            style="width:170px;"
                            @change="updateTime"
                          />
                        </a-form-item>
                        <a-form-item
                          label="数量"
                          :label-col="{ span: 5,offset:0 }"
                          :wrapper-col="{span:12}"
                          class="mb"
                        >
                          <a-input-number
                            :min="1"
                            :max="item.number"
                            v-model="updateList.num"
                            style="width:170px;"
                          />
                        </a-form-item>
                        <a-form-item class="mb">
                          <a-button @click="uploadBom(item,index)">修改BOM/工艺</a-button>
                        </a-form-item>
                        <a-form-item class="mb" v-show="getMenuPermission.includes('DELETE')">
                          <a-button type="danger" @click="removeItem(item.id,index)">移除</a-button>
                        </a-form-item>
                        <a-form-item class="mb">
                          <a-button type="primary" @click="addLittle(item.channelSkuId,index)">确定</a-button>
                        </a-form-item>
                      </template>
                      <a-icon
                        type="ellipsis"
                        class="item-right-edit"
                        @click="e=>updataDes(e,item.number,item.odRequireDueDate, index)"
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
        </div>
      </a-col>
      <a-col :span="12" class="dispatch-right">
        <div class="order-list demo-infinite-container">
          <a-list :dataSource="companyList">
            <a-list-item slot="renderItem" slot-scope="item, index">
              <div class="list-item">
                <div class="item-left">
                  <div class="item-left-top">
                    <a href="javascript:;">{{item.name}}</a>
                    <span>{{item.bom}} {{item.craft}}</span>
                  </div>
                  <ul class="item-left-desc">
                    <li>{{item.spec}}</li>
                    <li>{{item.cz}}</li>
                    <li>{{item.odRequireDueDate?moment(item.odRequireDueDate).format(dateFormat):''}}</li>
                    <li>{{item.number}}{{item.unit}}</li>
                  </ul>
                </div>
                <div class="item-right">
                  <a-button
                    type="danger"
                    shape="circle"
                    icon="minus"
                    style="background:#f5222d;color:#fff;"
                    @click="minusCompany(index)"
                  ></a-button>
                </div>
              </div>
            </a-list-item>
          </a-list>
          <div style="height:40px"></div>
          <div class="dispatch-right-bottom">
            <a-button @click="minusCompany">取消</a-button>
            <a-button
              type="primary"
              @click="submit"
              :loading="submitLoading"
              v-show="getMenuPermission.includes('ADD')"
            >生成工单</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
    <!-- Moadl -->
    <a-modal title="选择工艺" :visible="visibleModal" @ok="onModalOk" @cancel="onModalNo">
      <ul class="bom-modal-list">
        <li
          :class="{modalActive: isModalActive === 0 ? true : false}"
          @click="onModalInfo(0)"
        >设置工艺和BOM</li>
        <li
          :class="{modalActive: isModalActive === 1 ? true : false}"
          @click="onModalInfo(1)"
        >选择工艺和BOM</li>
      </ul>
    </a-modal>
    <!-- 产品信息抽屉 -->
    <a-drawer
      destroyOnClose
      placement="right"
      :closable="false"
      @close="closeDrawer"
      :visible="visible"
      :width="1040"
      :wrapStyle="{height: '100%',overflow: 'auto',paddingBottom: '108px'}"
    >
      <dispatchInfo
        @isDrawer="isDrawer"
        @setDispatchInfo="setDispatchInfo"
        :goodsViewInfo="goodsViewInfo"
      ></dispatchInfo>
    </a-drawer>
  </div>
</template>

<script>
import Bus from '@/Bus.js'
import infiniteScroll from 'vue-infinite-scroll'
import { postJson, get } from '@/api/axios.js'
import api from '@/api/index.js'
import moment from 'moment'
import dispatchInfo from '@/views/product/pdm/goods/child_info/GoodsInfo'
import inputSearch from './other/inputSearch'
import { mixinBasic, mixinDrawer } from '@/components/tools/mixin/mixin'
export default {
  directives: { infiniteScroll },
  mixins: [mixinBasic, mixinDrawer],
  components: {
    dispatchInfo,
    inputSearch
  },
  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      busy: false,
      loadingCompony: false,
      dataCompanySize: 0,
      dataCompany: [],
      orderMerge: [],
      currentPage: 1,
      pageSize: 15,
      searchTerm: {},
      updateList: {
        num: 0,
        date: ''
      },
      companyList: [],
      submitLoading: false,
      goodsViewInfo: {},
      visibleModal: false,
      selectIndex: '',
      isModalActive: 0,
      channelSkuId: '',
      disabledUp: false
    }
  },
  computed: {
    getMenuPermission() {
      return this.$store.state.menuPermission
    }
  },
  methods: {
    moment,
    // 按条件搜索渠道商订单列表
    changeInput(val, type) {
      this.dataCompany = []
      this.searchTerm = val
      this.currentPage = 1
      this.getFactoryOrder()
    },
    // 滚动滑动条加载订单
    handleInfiniteOnLoad() {
      const data = this.dataCompany
      this.loadingCompony = true
      this.busy = true
      if (data.length >= this.dataCompanySize && this.dataCompanySize !== 0 || this.disabledUp) {
        this.busy = true
        this.loadingCompony = false
      } else {
        this.getFactoryOrder(this.currentPage)
        this.busy = false
        this.loadingCompony = false
      }
    },
    // 移除订单
    removeItem(id, index) {
      const _this = this
      this.$confirm({
        title: '移除订单信息',
        content: '您确定要移除这条订单消息吗?',
        zIndex: 99999,
        onOk() {
          postJson(api.delFactoryPolicyOrder, { id }).then(res => {
            if (res.data.code === 0) {
              _this.$message.success('订单移除成功')
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
    addCompany(channelSkuId, index, num, date) {
      this.dispatchAction(channelSkuId, index, num, date)
    },
    addLittle(channelSkuId, index) {
      const updateList = this.updateList
      this.dispatchAction(channelSkuId, index, updateList.num, updateList.date)
    },
    /**
    * @description 订单分派
    * @param channelSkuId 产品SkuID 查询产品详情
    * @param index 当前点击的索引
    * @description 先判断是否设置制造工艺和BOM
    * 一、设置。判断是否已经添加过产品。已经有添加的产品则在进行判断规格、材质、制造工艺、BOM是否一致，一致则添加不一致则警告；如果没有添加过产品则直接将 产品添加过去。
    * 二、未设置。提示用户先设置制造工艺和BOM，确定设置则直接右侧抽屉展开
    */
    dispatchAction(channelSkuId, index, num, date) {
      this.selectIndex = index
      this.channelSkuId = channelSkuId
      const dataCompany = this.dataCompany
      const companyList = this.companyList
      const item = dataCompany[index]
      const target = JSON.parse(JSON.stringify(item))
      const tar = companyList.filter(itm => itm.odRequireDueDate === date)[0]
      dataCompany[index].clickedVisible = false
      if (item.bom === null || item.craft === null) {
        this.visibleModal = true
        this.channelSkuId = channelSkuId
        return
      }
      if (companyList.length !== 0) {
        if (item.channelSkuId !== companyList[0].channelSkuId) {
          this.$message.warning('不同产品不能合并生成工单。', 1)
          return
        }
        if (item.bomGroupId !== companyList[0].bomGroupId && item.craftGroupId !== companyList[0].craftGroupId) {
          this.$message.warning('不同制造工艺和BOM不能合并生成工单。', 1)
          return
        }
        if (!tar) {
          this.$message.warning('不同的交期不能合并生成工单', 1)
          return
        }
        const tarList = companyList.filter(itm => itm.id === item.id)[0]
        if (!tarList) {
          target.odRequireDueDate = date
          target.number = num
          companyList.push(target)
        } else {
          tarList.number += num
        }
        if (num >= item.number) {
          dataCompany.splice(index, 1)
        } else {
          item.number -= num
        }
      } else {
        target.odRequireDueDate = date
        target.number = num
        if (num >= item.number) {
          dataCompany.splice(index, 1)
        } else {
          item.number -= num
        }
        companyList.push(target)
      }
    },
    uploadBom(item, index) {
      this.selectIndex = index
      this.dataCompany[index].clickedVisible = false
      this.channelSkuId = item.channelSkuId
      this.isModalActive = 1
      this.onModalOk()
    },
    // MOdal
    onModalOk() {
      this.visibleModal = false
      this.getViewInfo(this.channelSkuId)
      this.$store.commit('setPromptTitle', {
        title: '产品信息',
        isEdit: true
      })
    },
    onModalNo() {
      this.visibleModal = false
    },
    setDispatchInfo(val) {
      const dataCompany = this.dataCompany
      const index = this.selectIndex
      const data = {
        id: dataCompany[index].id,
        bomGroupId: dataCompany[index].bomGroupId,
        craftGroupId: dataCompany[index].craftGroupId
      }
      val.forEach(item => {
        if (item.defaultMaterials) {
          dataCompany[index].bom = item.groupName
          dataCompany[index].bomGroupId = item.id
          data.bomGroupId = item.id
        }
        if (item.defaultCraft) {
          dataCompany[index].craft = item.inputVal
          dataCompany[index].craftGroupId = item.id
          data.craftGroupId = item.id
        }
      })
      data.id = dataCompany[index].id
      postJson(api.updateBomCraft, data).then(res => {
        if (res.data.code === 0) {
          this.visible = false
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // Modal Tabs
    onModalInfo(key) {
      this.isModalActive = key
    },
    // 删除工厂中的订单
    minusCompany(index) {
      if (index >= 0) {
        const companyList = this.companyList
        const dataCompany = this.dataCompany
        const item = companyList[index]
        const target = dataCompany.filter(itm => itm.id === item.id)[0]
        if (target) {
          target.number += item.number
        } else {
          dataCompany.push(item)
          this.dataCompanySize += 1
        }
        companyList.splice(index, 1)
      } else {
        this.companyList = []
        this.dataCompany = []
        this.currentPage = 1
        this.getFactoryOrder()
      }
    },
    // 获取工厂订单列表
    getFactoryOrder(currentPage = 1, pageSize = 15) {
      this.disabledUp = true
      const data = this.searchTerm
      data.currentPage = currentPage
      data.pageSize = pageSize
      postJson(api.getFactoryPolicyOrder, data).then(res => {
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
      }).catch(() => {
        this.$message.error('系统错误')
      })
    },
    updataDes(e, num, data, index) {
      window.event ? window.event.cancelBubble = true : e.stopPropagation()
      const updateList = this.updateList
      updateList.num = num
      updateList.date = data
      this.dataCompany[index].clickedVisible = true
    },
    updateTime(dates, dateStrings) {
      this.updateList.date = dateStrings
    },
    // 订单分派提交
    submit() {
      if (this.companyList.length === 0) {
        return
      }
      this.submitLoading = true
      const list = []
      var totalNumber = null
      var odRequireDueDate = null
      this.companyList.forEach(item => {
        list.push({
          id: item.id,
          number: item.number
        })
        totalNumber += item.number
        odRequireDueDate = item.odRequireDueDate
      })
      postJson(api.putFactoryPolicyOrderAdd, {
        list,
        totalNumber: totalNumber,
        odRequireDueDate: odRequireDueDate,
        remarks: ''
      }).then(res => {
        if (res.data.code === 0) {
          this.$message.success('分单成功')
          this.currentPage = 1
          this.companyList = []
          this.orderMerge = {}
          this.dataCompany = []
          this.getFactoryOrder()
        } else {
          this.$message.error(res.data.msg)
        }
        this.submitLoading = false
      }).catch(() => {
        this.submitLoading = false
        this.$message.error('系统错误')
      })
    },
    // 关闭抽屉
    isDrawer(val) {
      this.visible = val
    },
    // 查看产品详情
    infoView(e, id, index) {
      window.event ? window.event.cancelBubble = true : e.stopPropagation()
      this.channelSkuId = id
      this.selectIndex = index
      this.visibleModal = true
    },
    getViewInfo(params) {
      get(api.goodsView + `?skuId=${params}`)
        .then(res => {
          if (res.data.code === 0) {
            this.goodsViewInfo = res.data.data
            this.visible = true
          }
        })
        .then(() => {
          Bus.$emit('setBomButton', true)
          Bus.$emit('basicInfo', {
            skuId: this.goodsViewInfo.sku.id,
            type: this.isModalActive
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleCancel() {
      this.selectBom = false
    }
  }
}
</script>

<style lang="less" scoped>
@import "~styles/dispach.less";
.item-left-desc li {
  width: 140px;
}
.bom-modal-list {
  text-align: center;
  li {
    display: inline-block;
    width: 140px;
    height: 60px;
    margin: 0 10px;
    border: 1px solid #d9d9d9;
    line-height: 60px;
    text-align: center;
    border-radius: 4px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .modalActive {
    border: 1px solid #1890ff;
  }
}
</style>
