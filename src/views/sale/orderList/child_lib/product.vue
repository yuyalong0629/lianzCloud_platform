<template>
  <a-row>
    <a-table :columns="columns" :dataSource="data" :pagination="false" :scroll="{ x:1250 }">
      <template slot="name" slot-scope="text,record">
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{record.odSkuName}}-{{record.code || record.odSkuCode}}</span>
          </template>
          <a
            class="text-hidden"
            href="javascript:;"
            @click="getGoodsViews(record.skuId)"
          >{{record.odSkuName}}-{{record.code || record.odSkuCode}}</a>
        </a-tooltip>
      </template>
      <template
        v-for="col in ['odSkuCustPrice', 'odNumber', 'odAmount','odPurchaseOrderno','odRequireDueDate','odPromiseDueDate']"
        :slot="col"
        slot-scope="text, record"
      >
        <div :key="col">
          <a-input
            v-if="record.editable && (col!=='odRequireDueDate' && col !== 'odPromiseDueDate')"
            style="width:80px;"
            :value="text"
            size="small"
            @change="e => editCell(e.target.value, record.key, col)"
          />
          <template
            v-else-if="record.editable && (col ==='odRequireDueDate' || col === 'odPromiseDueDate')"
          >
            <a-date-picker
              v-if="text"
              style="width:100px;"
              size="small"
              :defaultValue="moment(moment(text).format('YYYY-MM-DD'), 'YYYY-MM-DD')"
              :format="'YYYY-MM-DD'"
              @change="(value,dateString) => editCell(dateString, record.key, col)"
            >
              <span slot="suffixIcon" style="display:none"></span>
            </a-date-picker>
            <a-date-picker
              v-else
              style="width:100px;"
              size="small"
              :format="'YYYY-MM-DD'"
              @change="(value,dateString) => editCell(dateString, record.key, col)"
            >
              <span slot="suffixIcon" style="display:none"></span>
            </a-date-picker>
          </template>
          <template v-else>
            <span
              v-if="col ==='odRequireDueDate' || col === 'odPromiseDueDate'"
            >{{text?moment(text).format('YYYY-MM-DD'):''}}</span>
            <span v-else>{{text}}</span>
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.key)" style="margin-right:10px">保存</a>
            <a-popconfirm title="确认删除吗?" @confirm="() => cancel(record.key)">
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <span v-if="selectAddress"></span>
            <a @click="() => edit(record.key)" v-else-if="!approval && editDetial || !editInfo">编辑</a>
            <span v-else></span>
          </span>
        </div>
      </template>
    </a-table>
    <span class="editable-add-btn" @click="onAddContact" v-show="!editInfo">+添加产品</span>
    <a-modal
      title="添加"
      :maskClosable="false"
      :closable="false"
      :footer="null"
      :visible="isAddContactInfo"
      @ok="handleOkContact"
      @cancel="handleOkContact"
    >
      <EditableCell
        v-if="isAddContactInfo"
        @showAddContactInfo="showAddContactInfo"
        :custId="custId"
      ></EditableCell>
    </a-modal>
    <a-drawer
      placement="right"
      :closable="false"
      @close="isDrawer"
      :visible="towVisible"
      :wrapStyle="{height: '100%',overflow: 'auto',paddingBottom: '108px'}"
      :width="1040"
    >
      <GoodsInfo @isDrawer="isDrawer" :goodsViewInfo="goodsViewInfo"></GoodsInfo>
    </a-drawer>
  </a-row>
</template>

<script>
import EditableCell from '../basic_lib/EditableCell'
import GoodsInfo from '@/views/product/pdm/goods/child_info/GoodsInfo'
import Bus from '@/Bus'
import moment from 'moment'
import api from '@/api/index.js'
import { get } from '@/api/axios.js'
import { columnsOrderInfo } from '../basic_lib/menu.js'
export default {
  props: {
    dataSource: {
      type: Array,
      required: true,
      default: function () {
        return []
      }
    },
    custId: {
      type: String,
      required: true
    },
    editInfo: {
      type: Boolean,
      required: true,
      default: false
    },
    editDetial: {
      type: Boolean,
      required: true,
      default: false
    },
    approval: {
      type: Boolean
    },
    selectAddress: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  components: {
    EditableCell,
    GoodsInfo
  },
  data() {
    return {
      columns: columnsOrderInfo,
      towVisible: false,
      isAddContactInfo: false,
      goodsViewInfo: {},
      data: this.dataSource
    }
  },
  methods: {
    moment,
    // 添加产品
    onAddContact() {
      if (this.custId !== '') {
        this.isAddContactInfo = true
      } else {
        this.$message.warning('请先选择客户名称')
      }
    },
    // 总价计算
    setOtotalSum(data) {
      let ototalSum = 0
      for (const i in data) {
        ototalSum += parseFloat(data[i].odAmount)
      }
      Bus.$emit('setOtotalSum', ototalSum)
    },
    // 关闭商品添加弹框
    handleOkContact(e) {
      setTimeout(() => {
        this.isAddContactInfo = false
      }, 1000)
    },
    showAddContactInfo(data) {
      this.isAddContactInfo = data.isAddContactInfo
      const dataSource = this.data
      if (data.sku) {
        data.sku.key = dataSource.length
        dataSource.push(data.sku)
        this.setOtotalSum(dataSource)
        this.data = dataSource
      }
    },
    // 产品编辑
    edit(key) {
      if (this.editInfo && !this.editDetial) {
        return
      }
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    // 产品列表数据修改
    editCell(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        if (column === 'odNumber' || column === 'odSkuCustPrice') {
          target['odAmount'] = Number((Number(target['odNumber']) * Number(target['odSkuCustPrice'])).toString().match(/^\d+(?:\.\d{0,2})?/))
        }
        this.data = newData
        this.setOtotalSum(newData)
      }
    },
    // 保存修改
    save(key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        delete target.editable
        this.data = newData
        this.setOtotalSum(newData)
      }
    },
    // 删除当前行
    cancel(key) {
      const newData = [...this.data]
      const target = newData.filter(item => key !== item.key)
      this.data = target
      this.setOtotalSum(this.data)
    },
    // 获取产品详情
    getGoodsViews(skuId) {
      this.getViewInfo(skuId)
      this.$store.commit('setPromptTitle', {
        title: '产品信息详情',
        isEdit: true
      })
    },
    getViewInfo(params) {
      get(api.goodsView + `?skuId=${params}`).then(res => {
        if (res.data.code === 0) {
          this.goodsViewInfo = res.data.data
          this.towVisible = true
        }
      }).catch(err => {
        console.log(err)
      })
    },
    isDrawer() {
      this.towVisible = false
    }
  }
}
</script>

<style lang='less' scoped>
.editable-add-btn {
  cursor: pointer;
  margin: 10px;
  display: block;
  line-height: 30px;
  text-align: center;
  border: 1px dashed #ccc;
}
.text-hidden {
  display: block;
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
