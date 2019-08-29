<template>
  <div class="purchase-info">
    <div class="prompt-title">
      <a-row>
        <a-col :span="16">
          <h3 class="prompt-h3">工单详情</h3>
        </a-col>
        <a-col :span="8" class="prompt-wrapper" v-show="getDetailPermission.includes('UPDATE')">
          <span class="prompt-delete" @click="printProductOrder">
            <a-icon type="printer" />
            <span>打印</span>
          </span>
          <span
            class="prompt-edit"
            @click="orderPick('RECEIVED')"
            v-show="prchaseDetial.num === -1"
          >
            <i class="iconfont iconyijiedan" style="color:#F0BB2E;margin-right:4px"></i>
            <span>接单</span>
          </span>
          <span
            class="prompt-delete"
            @click="orderPick('IN_PRODUCTION')"
            v-show="prchaseDetial.status === 'RECEIVED'"
          >
            <a-icon type="file-protect" style="color:#017600;margin-right:4px" />
            <span>生产</span>
          </span>
          <span
            class="prompt-delete"
            @click="orderPick('COMPLETED')"
            v-show="prchaseDetial.status === 'IN_PRODUCTION'"
          >
            <a-icon type="file-done" style="color:#1890ff;margin-right:4px" />
            <span>完成</span>
          </span>
          <span
            class="prompt-delete"
            @click="orderPick('CANCELLED')"
            v-show="prchaseDetial.num === -1 || prchaseDetial.status === 'RECEIVED'"
          >
            <i class="iconfont iconjujue" style="color:#D50304;margin-right:4px"></i>
            <span>取消</span>
          </span>
          <!-- <span class="prompt-delete" @click="orderEdit">
            <a-icon style="color: green;margin-right: 4px;" type="edit"/>
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
        <a-form-item label="产品名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.name}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="承诺交期" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.odRequireDueDate?moment(prchaseDetial.odRequireDueDate).format('YYYY-MM-DD'):''}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="产品规格" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.spec}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="当前版本" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.groupName}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="总数量" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.totalCount}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="工艺确认" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>
            <a-switch :checked="prchaseDetial.craft" disabled />
          </template>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <h3 class="purchase-info-title">工厂生产单详情</h3>
      </a-col>
    </a-row>
    <a-row>
      <a-table :columns="detailColumns" :dataSource="prchaseDetial.list" :pagination="false">
        <template slot="receiveWay" slot-scope="text">{{text==='WAREHOUSE'?'共享仓':''}}</template>
      </a-table>
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
              :status="item.state === 'REJECTED' || item.state==='CANCELLED'?'error':''"
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
import { detailColumns } from '../base_lib/columns'
import api from '@/api/index'
import axios from 'axios'
import moment from 'moment'
export default {
  mixins: [mixinBasic, mixinIsEdit],
  props: ['purchaseId', 'factoryProductionOrderId', 'prchaseDetial'],
  data() {
    return {
      edit: false,
      detailColumns,
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
    // 接单/拒单 1.RECEIVED.已接单 2.IN_PRODUCTION.生产中 3.COMPLETED.已完成 4.CANCELLED.已取消
    orderPick(type) {
      if (!this.actionOrder) {
        const data = {}
        this.actionOrder = true
        data.id = this.purchaseId
        data.status = type
        postJson(api.updateFactoryPolicyStatus, data).then(res => {
          if (res.data.code === 0) {
            this.$message.success('操作成功')
            this.onClose()
          } else {
            this.actionOrder = false
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.$message.error('系统错误')
          this.actionOrder = false
        })
      } else {
        this.$message.warning('请不要重复操作')
      }
    },
    // 订单打印
    printProductOrder() {
      const params = new URLSearchParams()
      params.append('factoryProductionOrderId', this.factoryProductionOrderId)
      axios.get(api.printProductionOrder, { responseType: 'blob', params: params }).then(res => {
        this.download(res)
      })
    },
    download(data) { // pdf打印
      if (!data) {
        return
      }
      const deleteNode = document.getElementsByTagName('iframe')[0]
      if (deleteNode) {
        document.body.removeChild(deleteNode)
      }
      const blob = new Blob([data.data], { type: 'application/pdf;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const aLink = document.createElement('iframe')
      aLink.style.display = 'none'
      aLink.id = 'rm'
      aLink.src = url
      document.body.appendChild(aLink)
      const target = document.getElementById('rm')
      target.contentWindow.print()
    }
  }
}
</script>

<style lang="less" scoped>
@import "~styles/purchaseInfo.less";
</style>
