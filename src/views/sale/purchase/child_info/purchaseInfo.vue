<template>
  <div class="purchase-info">
    <div class="prompt-title">
      <a-row>
        <a-col :span="18">
          <h3 class="prompt-h3">采购详情</h3>
        </a-col>
        <a-col :span="6" class="prompt-wrapper" v-show="prchaseDetial.status==='WAITING'">
          <span
            class="prompt-delete"
            @click="orderPick"
            v-show="getDetailPermission.includes('DELETE')"
          >
            <i class="iconfont iconjujue" style="color:#D50304;margin-right:4px"></i>
            <span>取消</span>
          </span>
          <span
            class="prompt-delete"
            @click="orderEdit"
            v-show="getDetailPermission.includes('UPDATE')"
          >
            <a-icon style="color: green;margin-right: 4px;" type="edit" />
            <span>{{edit?'取消':'编辑'}}</span>
          </span>
        </a-col>
      </a-row>
    </div>
    <a-row>
      <a-col :span="24">
        <h3 class="purchase-info-title">基本信息</h3>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="8">
        <a-form-item label="订单编码" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.odOrderNumber}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="销售单号" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.odOrderNumberO}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="交期" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template v-if="edit">
            <a-date-picker
              v-if="prchaseDetial.odRequireDueDate"
              format="YYYY-MM-DD"
              :defaultValue="moment(prchaseDetial.odRequireDueDate, 'YYYY-MM-DD')"
              style="width:180px;"
            />
            <a-date-picker v-else showTime format="YYYY-MM-DD" style="width:180px;" />
          </template>
          <template v-else>{{prchaseDetial.odRequireDueDate}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="生产厂家" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.companyName}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="总价" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.odTotalPrice}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="工艺确认" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>
            <a-switch :checked="prchaseDetial.craft" disabled />
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="收货方式" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.receiveWay==='WAREHOUSE'?'共享仓':''}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="订单状态" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.status | stateFilter}}</template>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <h3 class="purchase-info-title">产品信息</h3>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="8">
        <a-form-item label="客户编码" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.ocustCode}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="产品名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>
            <a
              href="javascript:;"
              @click="infoProduct(prchaseDetial.skuId)"
            >{{prchaseDetial.odSkuName}}</a>
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="数量" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template v-if="edit">
            <a-input style="width:180px" v-model="prchaseDetial.odNumber" />
          </template>
          <template v-else>{{prchaseDetial.odNumber}}{{prchaseDetial.unit}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="客户名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.ocustName}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="产品规格" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.odSpec}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="单价" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.odUnitPrice}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="当前版本" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.groupName}}</template>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <h3 class="purchase-info-title">订单进度</h3>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12" style="margin-top:20px">
        <a-steps progressDot :current="prchaseDetial.num" v-if="prchaseDetial.orderProgress">
          <template v-for="(item,index) in prchaseDetial.orderProgress.list">
            <a-step
              :title="item.state | stateFilter"
              :key="index"
              :status="item.state === 'REJECTED' || item.state ==='CANCELLED'?'error':''"
            >
              <template slot="description">
                <span class="stepC">{{item.name }}</span>
                <p class="stepC">{{item.date}}</p>
              </template>
            </a-step>
          </template>
        </a-steps>
      </a-col>
    </a-row>
    <div
      :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #E9E9E9',
          padding: '10px 16px',
          background: '#FFF',
          textAlign: 'right',
        }"
    >
      <a-button :style="{marginRight: '8px'}" @click="onClose">取消</a-button>
      <a-button
        type="primary"
        @click="submit"
        :disabled="!edit"
        :loading="loading"
        v-show="getDetailPermission.includes('UPDATE')"
      >保存</a-button>
    </div>
    <a-drawer
      :destroyOnClose="true"
      placement="right"
      :closable="false"
      @close="closeProductDrawer"
      :visible="productVisible"
      :width="1040"
      :wrapStyle="{height: '100%',overflow: 'auto',paddingBottom: '108px'}"
    >
      <dispatchInfo @isDrawer="isProductDrawer" :goodsViewInfo="goodsViewInfo" />
    </a-drawer>
  </div>
</template>

<script>
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'
import { viewProductDetail } from '@/components/productDetails/productDetail'
import { postJson } from '@/api/axios'
import dispatchInfo from '@/views/product/pdm/goods/child_info/GoodsInfo'
import api from '@/api/index'
import moment from 'moment'
export default {
  mixins: [mixinBasic, mixinIsEdit, viewProductDetail],
  props: ['purchaseId', 'prchaseDetial'],
  data() {
    return {
      edit: false,
      loading: false,
      actionOrder: false
    }
  },
  computed: {
    getDetailPermission() {
      return this.$store.state.detailPermission
    }
  },
  methods: {
    moment,
    isDisabled(val) {
      this.disabled = !val
    },
    // 删除
    orderPick() {
      if (this.actionOrder) {
        this.$message.warning('请不要重复操作')
        return
      }
      this.actionOrder = true
      postJson(api.delProcurementDetail, { id: this.purchaseId }).then(res => {
        if (res.data.code === 0) {
          this.$message.success('取消成功')
          this.$emit('isDrawer', true)
        } else {
          this.actionOrder = false
          this.$message.error(res.data.msg)
        }
      }).catch(() => {
        this.actionOrder = false
        this.$message.error('系统错误')
      })
    },
    submit() {
      const data = {}
      const prchaseDetial = this.prchaseDetial
      data.id = this.purchaseId
      data.odNumber = prchaseDetial.odNumber
      data.odRequireDueDate = prchaseDetial.odRequireDueDate
      this.loading = true
      postJson(api.updateProcurementDetail, data).then(res => {
        if (res.data.code === 0) {
          this.$message.success('修改成功')
          this.$emit('isDrawer', true)
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading = false
      })
    },
    // 编辑
    orderEdit() {
      this.edit = !this.edit
    },
    infoProduct(skuId) {
      this.getViewInfo(skuId)
    }
  },
  components: {
    dispatchInfo
  }
}
</script>

<style lang="less" scoped>
@import "~styles/purchaseInfo.less";
</style>
