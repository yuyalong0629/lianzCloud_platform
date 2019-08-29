<template>
  <div class="purchase-info">
    <div class="prompt-title">
      <a-row>
        <a-col :span="18">
          <h3 class="prompt-h3">工单详情</h3>
        </a-col>
        <a-col
          :span="6"
          class="prompt-wrapper"
          v-show="prchaseDetial.status==='WAITING' && getDetailPermission.includes('UPDATE')"
        >
          <span class="prompt-edit" @click="orderPick('RECEIVED')">
            <i class="iconfont iconyijiedan" style="color:#F0BB2E;margin-right:4px"></i>
            <span>接单</span>
          </span>
          <span class="prompt-delete" @click="orderPick('REJECTED')">
            <i class="iconfont iconjujue" style="color:#D50304;margin-right:4px"></i>
            <span>拒单</span>
          </span>
          <!-- <span class="prompt-delete" @click="orderEdit">
            <a-icon style="color: green;margin-right: 4px;" type="edit" />
            <span>{{edit?'取消':'编辑'}}</span>
          </span>-->
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
          <template>
            <span>{{prchaseDetial.odOrderNumberO}}</span>
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="交期" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.odRequireDueDate?moment(prchaseDetial.odRequireDueDate).format('YYYY-MM-DD'):''}}</template>
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
          <template>{{prchaseDetial.receiveWay === 'WAREHOUSE'?'共享仓':''}}</template>
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
            <a href="javascript:;">{{prchaseDetial.odSkuName}}</a>
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="数量" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.odNumber}} {{prchaseDetial.unit}}</template>
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
                <span class="stepC">{{item.name}}</span>
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
        @click="onClose"
        :disabled="!edit"
        v-show="getDetailPermission.includes('UPDATE')"
      >保存</a-button>
    </div>

    <!-- 产品信息抽屉 -->
    <!-- <a-drawer
      placement="right"
      :closable="false"
      @close="closeDrawer"
      :visible="visible"
      :width="1040"
    >
      <GoodsInfo @isDrawer="isDrawer"></GoodsInfo>
    </a-drawer>-->
  </div>
</template>

<script>
// import GoodsInfo from '@/views/product/pdm/goods/child_info/GoodsInfo'
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'
import { postJson } from '@/api/axios'
import api from '@/api/index'
import moment from 'moment'
export default {
  mixins: [mixinBasic, mixinIsEdit],
  props: ['purchaseId', 'prchaseDetial'],
  components: {
    // GoodsInfo
  },
  data() {
    return {
      edit: false,
      visible: false,
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
    isDelete(val) {
      console.log(val)
    },
    // 接单/拒单
    orderPick(type) {
      if (!this.actionOrder) {
        this.actionOrder = true
        const data = {}
        data.id = this.purchaseId
        data.status = type
        postJson(api.updateFactoryStatus, data).then(res => {
          if (res.data.code === 0) {
            this.$message.success('操作成功')
            this.onClose()
          } else {
            this.actionOrder = false
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.actionOrder = false
          this.$message.error('系统错误')
        })
      } else {
        this.$message.warning('请不要重复操作')
      }
    },
    // 编辑
    orderEdit() {
      this.edit = !this.edit
    },
    choseBom() {
      this.visible = true
    },
    closeDrawer() {
      this.visible = false
    },
    isDrawer(val) {
      this.visible = val
    }
  }
}
</script>

<style lang="less" scoped>
@import "~styles/purchaseInfo.less";
</style>
