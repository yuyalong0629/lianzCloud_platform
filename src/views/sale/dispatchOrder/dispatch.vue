<template>
  <div class="dispatch">
    <a-row>
      <a-col :span="14" class="dispatch-left">
        <inputSearch @changeInput="changeInput"></inputSearch>
        <list-scroll
          @handleInfiniteOnLoad="handleInfiniteOnLoad"
          @addCompany="addCompany"
          @infoView="infoView"
          :value="dataCompany"
          :busy="busy"
          :loading="loadingCompony"
        >
          <div class="item-left" slot="List" slot-scope="scope">
            <ul class="item-left-desc">
              <li>
                规格：
                <a-tooltip :value="scope.item.spec" />
              </li>
              <li>
                材质：
                <a-tooltip :value="scope.item.cz" />
              </li>
              <li>
                表面：
                <a-tooltip :value="scope.item.bmcl" />
              </li>
              <li>交期：{{scope.item.odPromiseDueDate?moment(scope.item.odPromiseDueDate).format(dateFormat):''}}</li>
              <li>数量：{{scope.item.odNumber}}{{scope.item.unit}}</li>
            </ul>
          </div>
          <a-row slot="ListRight" slot-scope="scope">
            <a-popover trigger="click" v-model="scope.item.clickedVisible">
              <template slot="content">
                <setPopover
                  v-if="scope.item.clickedVisible"
                  :checkItem="checkItem"
                  :deleteShow="getMenuPermission.includes('DELETE')"
                  @remove="remove"
                  @addLittle="addLittle"
                  @updataBom="updataBom"
                ></setPopover>
              </template>
              <a-icon
                type="ellipsis"
                class="item-right-edit"
                @click="e=>updataDes(e,scope.item,scope.index)"
              />
            </a-popover>
            <a-button type="primary" shape="circle" icon="plus"></a-button>
          </a-row>
        </list-scroll>
      </a-col>
      <a-col :span="10" class="dispatch-right">
        <div class="title">
          <span @click="showDrawer">{{companyName}}</span>
          <span @click="showDrawer" v-if="companyVisible">
            <a-icon type="double-right" />
          </span>
          <span @click="showDrawer">
            <a-icon type="double-left" />
          </span>
        </div>
        <div class="order-list demo-infinite-container">
          <a-list :dataSource="companyList">
            <a-list-item slot="renderItem" slot-scope="item, index">
              <div class="list-item">
                <div class="item-left">
                  <div class="item-left-top">
                    <a href="javascript:;">{{item.name}} {{item.bom}} {{item.craft}}</a>
                    <span>{{item.orderNumber}}</span>
                  </div>
                  <ul class="item-left-desc">
                    <li>
                      规格：
                      <a-tooltip :value="item.spec" />
                    </li>
                    <li>
                      材质：
                      <a-tooltip :value="item.cz" />
                    </li>
                    <li>
                      表面：
                      <a-tooltip :value="item.bmcl" />
                    </li>
                    <li>交期：{{item.odPromiseDueDate?moment(item.odPromiseDueDate).format(dateFormat):''}}</li>
                    <li>数量：{{item.odNumber}}{{item.unit}}</li>
                    <li>总价：{{item.odTotalPrice||0}}元</li>
                  </ul>
                </div>
                <div class="item-right">
                  <a-button
                    type="danger"
                    shape="circle"
                    icon="minus"
                    style="background:#f5222d;color:#fff;"
                    @click="minusCompany(item.id,index)"
                  ></a-button>
                </div>
              </div>
            </a-list-item>
          </a-list>
          <div style="height:40px"></div>
          <div class="dispatch-right-bottom">
            <a-form layout="inline">
              <a-form-item label="合计">
                {{allodTotalPrice}} 元
                <!-- <a-input :min="0" v-model="allodTotalPrice" addonAfter="元" style="width:170px;" /> -->
              </a-form-item>
              <a-form-item>
                <a-button @click="handleClose" style="margin-right:10px;">取消</a-button>
                <a-button
                  type="primary"
                  @click="submit"
                  :loading="submitLoading"
                  v-show="getMenuPermission.includes('ADD')"
                >确定</a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </a-col>
    </a-row>
    <!-- Moadl -->
    <a-modal
      title="选择BOM"
      :visible="visibleModal"
      @ok="onModalOk"
      @cancel="onModalNo"
      :zIndex="10000"
    >
      <ul class="bom-modal-list">
        <li :class="{modalActive: isModalActive === 0 ? true : false}" @click="onModalInfo(0)">设置BOM</li>
        <li :class="{modalActive: isModalActive === 1 ? true : false}" @click="onModalInfo(1)">选择BOM</li>
      </ul>
    </a-modal>
    <!-- 工厂名称抽屉 -->
    <a-drawer
      placement="right"
      :closable="false"
      @close="onClose"
      :visible="companyVisible"
      :width="300"
    >
      <companyList :factoryId="factoryId" @selectCompany="selectName"></companyList>
    </a-drawer>
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
        :goodsViewInfo="goodsViewInfo"
        @setDispatchInfo="setDispatchInfo"
      ></dispatchInfo>
    </a-drawer>
  </div>
</template>

<script>
import Bus from '@/Bus.js'
import { mixinBasic, mixinDrawer } from '@/components/tools/mixin/mixin'
import { postJson, get } from '@/api/axios.js'
import api from '@/api/index.js'
import moment from 'moment'
import aTooltip from '@/components/tooltip/aTooltip'
import infiniteScroll from 'vue-infinite-scroll'
import companyList from './child_lib/companyList'
import dispatchInfo from '@/views/product/pdm/goods/child_info/GoodsInfo'
import inputSearch from './other/inputSearch'
import setPopover from './other/setPopover'
import ListScroll from './other/ListScroll'
export default {
  directives: { infiniteScroll },
  mixins: [mixinBasic, mixinDrawer],
  components: {
    companyList,
    dispatchInfo,
    inputSearch,
    setPopover,
    'a-tooltip': aTooltip,
    'list-scroll': ListScroll
  },
  data() {
    return {
      companyType: 'CHANNEL',
      factoryId: '',
      dateFormat: 'YYYY-MM-DD',
      busy: false,
      companyVisible: false,
      loadingCompony: false,
      dataCompanySize: 0,
      dataCompany: [],
      currentPage: 1,
      pageSize: 15,
      searchTerm: {},
      companyName: '请选择工厂',
      companyList: [],
      companyNameList: [],
      checkItem: {},
      submitLoading: false,
      goodsViewInfo: {},
      isModalActive: 0,
      visibleModal: false,
      channelSkuId: '',
      selectIndex: '',
      disableUp: false
    }
  },
  computed: {
    getMenuPermission() {
      return this.$store.state.menuPermission
    },
    allodTotalPrice() {
      let sum = 0
      this.companyList.forEach(item => {
        if (item.odTotalPrice) {
          sum += +item.odTotalPrice
        }
      })
      return sum
    }
  },
  methods: {
    moment,
    // 按条件搜索渠道商订单列表
    changeInput(val) {
      this.dataCompany = []
      this.searchTerm = val
      this.getFactoryOrder()
    },
    // 滚动滑动条加载订单
    handleInfiniteOnLoad() {
      const data = this.dataCompany
      this.loadingCompony = true
      this.busy = true
      if (data.length >= this.dataCompanySize && this.dataCompanySize !== 0 || this.disableUp) {
        this.busy = true
        this.loadingCompony = false
      } else {
        this.getFactoryOrder(this.currentPage)
        this.busy = false
        this.loadingCompony = false
      }
    },
    // 移除订单
    remove(val) {
      var _this = this
      this.$confirm({
        title: '移除订单信息',
        content: '您确定要移除这条订单消息吗?',
        zIndex: 99999,
        onOk() {
          postJson(api.delFactoryOrder, { id: val.id }).then(res => {
            if (res.data.code === 0) {
              _this.$message.success('移除成功', 1)
              _this.dataCompany.splice(val.index, 1)
              _this.dataCompanySize--
            }
          })
        },
        onCancel() { }
      })
    },
    addLittle(val) {
      const updateList = {
        num: val.num,
        date: val.date,
        odUnitPrice: val.odUnitPrice,
        odTotalPrice: val.odTotalPrice
      }
      this.addCompany(val.index, updateList)
    },
    // 打开抽屉
    showDrawer() {
      this.companyVisible = !this.companyVisible
    },
    // 关闭抽屉
    onClose() {
      this.companyVisible = false
    },
    /**
     * @description 分派订单到待分配列表
     * @param {Number} index 当前所分配订单的下标
     * @param {Object} updateList 当前所分配订单修改的日期/数量/单价/总价
     * @param target 当前所分配订单
     * @param team 拷贝当前所分配订单 后续操作自行理解
     * @returns
     */
    addCompany(index, updateList) {
      const companyList = this.companyList
      this.channelSkuId = this.dataCompany[index].skuId
      this.selectIndex = index
      if (this.dataCompany[index].bom === null) {
        this.visibleModal = true
        return
      }
      this.dataCompany[index].clickedVisible = false
      const target = this.dataCompany[index]
      const team = JSON.parse(JSON.stringify(target))
      team.odPromiseDueDate = updateList ? updateList.date : team.odPromiseDueDate
      team.odNumber = updateList ? updateList.num : team.odNumber
      team.odUnitPrice = updateList ? updateList.odUnitPrice : null
      team.odTotalPrice = updateList ? updateList.odTotalPrice : 0
      const tar = companyList.filter(item => item.id === team.id && item.odPromiseDueDate === team.odPromiseDueDate && item.odUnitPrice === team.odUnitPrice && item.bomGroupId === team.bomGroupId && item.craftGroupId === team.craftGroupId)[0]
      if (tar) {
        tar.odTotalPrice += team.odTotalPrice
        tar.odNumber += team.odNumber
      } else {
        companyList.push(team)
      }
      if (team.odNumber >= target.odNumber) {
        this.dataCompany.splice(index, 1)
        this.dataCompanySize--
      } else {
        target.odNumber -= updateList.num
      }
    },
    // 删除工厂中的订单
    minusCompany(id, index) {
      const dataCompany = this.dataCompany
      const companyList = this.companyList
      const target = dataCompany.filter(item => item.id === id)[0]
      if (target) {
        target.odNumber += companyList[index].odNumber
      } else {
        dataCompany.push(companyList[index])
        this.dataCompanySize += 1
      }
      companyList.splice(index, 1)
    },
    // 点击取消
    handleClose() {
      this.currentPage = 1
      this.companyList = []
      this.dataCompany = []
      this.getFactoryOrder()
    },
    // 获取渠道商订单列表
    getFactoryOrder(current = 1, pageSize = 20) {
      this.disableUp = true
      const data = { ...this.searchTerm }
      data.currentPage = current
      data.pageSize = pageSize
      postJson(api.getFactoryOrder, data).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data.records
          data.forEach(item => {
            item.clickedVisible = false
          })
          this.disableUp = false
          this.dataCompanySize = +res.data.data.total
          this.dataCompany = this.dataCompany.concat(data)
          this.currentPage += 1
        }
      })
    },
    // 设置选中的订单产品的数量和交期
    updataDes(e, item, index) {
      window.event ? window.event.cancelBubble = true : e.stopPropagation()
      this.selectIndex = index
      this.channelSkuId = item.skuId
      const target = { ...item }
      target.index = index
      this.checkItem = target
      this.dataCompany[index].clickedVisible = true
    },
    // 订单分派提交
    submit() {
      if (this.companyList.length === 0) {
        return
      }
      if (this.factoryId === '') {
        this.$message.warning('请选择工厂')
        return
      }
      const addFactorySaleOrderPostBean = {
        factoryId: this.factoryId,
        list: [],
        totalPrice: this.allodTotalPrice
      }
      const list = addFactorySaleOrderPostBean.list
      const companyList = this.companyList
      companyList.forEach(item => {
        list.push(
          {
            id: item.id,
            bomGroupId: item.bomGroupId,
            craftGroupId: item.craftGroupId,
            number: item.odNumber,
            orderNumber: item.orderNumber,
            odRequireDueDate: item.odPromiseDueDate,
            odUnitPrice: item.odUnitPrice,
            odTotalPrice: item.odTotalPrice
          }
        )
      })
      this.submitLoading = true
      postJson(api.addFactoryOrder, addFactorySaleOrderPostBean).then(res => {
        this.submitLoading = false
        if (res.data.code === 0) {
          this.$message.success('分派成功')
          this.currentPage = 1
          this.companyList = []
          this.dataCompany = []
          this.getFactoryOrder()
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(() => {
        this.submitLoading = false
        this.$message.error('系统错误')
      })
    },
    // 替换显示工厂名字以及工厂id
    selectName(data) {
      this.factoryId = data.id
      this.companyName = data.name
      this.companyVisible = false
    },
    // 关闭抽屉
    isDrawer(val) {
      this.visible = val
    },
    // 查看产品详情
    infoView(val) {
      this.channelSkuId = val.id
      this.selectIndex = val.index
      this.visibleModal = true
    },
    getViewInfo(id) {
      get(api.goodsView + `?skuId=${id}`).then(res => {
        if (res.data.code === 0) {
          this.goodsViewInfo = res.data.data
          this.visible = true
        }
      }).then(() => {
        Bus.$emit('setBomButton', true)
        Bus.$emit('basicInfo', {
          skuId: this.goodsViewInfo.sku.id,
          type: this.isModalActive
        })
      }).catch(err => {
        console.log(err)
      })
    },
    updataBom() {
      const index = this.selectIndex
      this.dataCompany[index].clickedVisible = false
      this.isModalActive = 1
      this.onModalOk()
    },
    onModalInfo(key) {
      this.isModalActive = key
    },
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
      val.forEach(item => {
        if (item.defaultMaterials) {
          dataCompany[index].bom = item.groupName
          dataCompany[index].bomGroupId = item.id
        }
        if (item.defaultCraft) {
          dataCompany[index].craft = item.inputVal
          dataCompany[index].craftGroupId = item.id
        }
      })
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
@import "~styles/dispach.less";
.item-left-desc {
  margin-bottom: 0 !important;
  li {
    width: 140px;
  }
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
