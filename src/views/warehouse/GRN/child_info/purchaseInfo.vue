<template>
  <div class="purchase-info">
    <div class="prompt-title">
      <a-row>
        <a-col :span="18">
          <h3 class="prompt-h3">入库详情</h3>
        </a-col>
        <!-- 需要修改状态 0.PRODUCTION.生产中 1.WAITING_IN.等待入库 2.STORED_IN.已入库 8.CANCEL_IN.取消入库 10.SUBMISSION.已提交入库申请 -->
        <a-col :span="6" class="prompt-wrapper" v-show="getDetailPermission.includes('UPDATE')">
          <span
            class="prompt-delete"
            @click="orderPick('WAITING_IN')"
            v-show="companyType && prchaseDetial.status === 'SUBMISSION'"
          >
            <a-icon type="plus-circle" style="color:#F0BB2E;margin-right:4px" />
            <span>确认入库</span>
          </span>
          <span
            class="prompt-delete"
            @click="orderPick('STORED_IN')"
            v-show="companyType && prchaseDetial.status === 'WAITING_IN'"
          >
            <a-icon type="check-circle" style="color:#1890ff;margin-right:4px" />
            <span>完成入库</span>
          </span>
          <span
            class="prompt-delete"
            @click="orderPick('CANCEL_IN')"
            v-show="prchaseDetial.status === 'SUBMISSION' || prchaseDetial.status === 'WAITING_IN'"
          >
            <a-icon type="close-circle" style="color:#D50304;margin-right:4px" />
            <span>取消入库</span>
          </span>
        </a-col>
      </a-row>
    </div>
    <a-row>
      <a-col :span="24">
        <h3 class="purchase-info-title">基本数据</h3>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="8">
        <a-form-item label="入库单号" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.applyCode}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="生产单号" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-tooltip placement="topLeft" :overlayStyle="{'maxWidth':'300px'}">
            <template slot="title">
              <span>{{prchaseDetial.productionCode}}</span>
            </template>
            <span>{{prchaseDetial.productionCode}}</span>
          </a-tooltip>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="入库类型" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.instorageType | putStorageType}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="入库数量" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.inCount}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="紧急程度" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>
            <a-switch :checked="prchaseDetial.requireLevel!=='LEVEL0'?true:false" disabled />
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="备注" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.remark}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="入库状态" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.status | putStorageStatus}}</template>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <h3 class="purchase-info-title">产品详情</h3>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="8">
        <a-form-item label="产品名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.name}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="库位" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.custName}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="订单数量" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.odNumber}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="产品规格" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.spec}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="单位" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.unit}}</template>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <h3 class="purchase-info-title">销售列表</h3>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-table :columns="columns" :dataSource="prchaseDetial.list" :pagination="false" />
      </a-col>
    </a-row>
    <a-row style="margin-top:20px">
      <a-col :span="24">
        <h3 class="purchase-info-title">订单进度</h3>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12" style="margin-top:20px">
        <a-steps progressDot :current="prchaseDetial.num" v-if="prchaseDetial.progressList">
          <template v-for="(item,index) in prchaseDetial.progressList">
            <a-step
              :title="item.state | putStorageStatus"
              :key="index"
              :status="item.state === 'CANCEL_IN'?'error':''"
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
      <a-button type="primary" @click="onClose" :disabled="!edit">保存</a-button>
    </div>
  </div>
</template>

<script>
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'
import { postJson } from '@/api/axios'
import api from '@/api/index'
import { columnsDetial } from '../base_lib/columns'

export default {
  mixins: [mixinBasic, mixinIsEdit],
  props: ['prchaseDetial', 'purchaseId'],
  data() {
    return {
      edit: false,
      columns: columnsDetial,
      companyType: '',
      actionOrder: false
    }
  },
  created() {
    this.companyType = localStorage.getItem('companyType') === 'WAREHOUSE'
  },
  computed: {
    getDetailPermission() {
      return this.$store.state.detailPermission
    }
  },
  methods: {
    isDisabled(val) {
      this.disabled = !val
    },
    // 删除
    isDelete(val) {
      console.log(val)
    },

    // 取消入库
    orderPick(type) {
      if (!this.actionOrder) {
        this.actionOrder = true
        const data = {}
        data.id = this.purchaseId
        data.status = type
        postJson(api.updateWarehousingStatus, data).then(res => {
          if (res.data.code === 0) {
            this.$message.success('操作成功', 1)
            this.$emit('isDrawer', true)
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
    }
  }
}
</script>

<style lang="less" scoped>
@import "~styles/purchaseInfo.less";
/deep/ .ant-form-item-control,
/deep/.ant-form-item-children {
  width: 100% !important;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
