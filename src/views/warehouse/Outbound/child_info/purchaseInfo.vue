<template>
  <div class="purchase-info">
    <div class="prompt-title">
      <a-row>
        <a-col :span="16">
          <h3 class="prompt-h3">出库详情</h3>
        </a-col>
        <a-col :span="8" class="prompt-wrapper">
          <span class="prompt-delete" @click="printProductOrder">
            <a-icon type="printer" />
            <span>打印三联单</span>
          </span>
          <span
            class="prompt-delete"
            @click="orderPick"
            v-show="companyType === 'WAREHOUSE' && prchaseDetial.status !=='STORED_OUT'"
          >
            <a-icon type="plus-circle" style="color:#F0BB2E;margin-right:4px" />
            <span>确认发货</span>
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
        <a-form-item label="发货单号" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.applyCode}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="物流方式" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.oshippingMode}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="联系方式" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.ophone}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="客户" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.toName}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="地址" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.oaddress}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="收货人" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.oaddresseeName}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="备注" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.remarks}}</template>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <h3 class="purchase-info-title">发货列表</h3>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-table
          :columns="columnsDetail"
          :dataSource="prchaseDetial.orderOutstorageApplyDetailAssign"
          :pagination="false"
          :rowKey="record=> record.id"
        >
          <!-- <template
            slot="code"
            slot-scope="text,record"
          >{{record.fromSkuInfo?record.fromSkuInfo.code:record.fromSkuCode}}</template>
          <template
            slot="name"
            slot-scope="text,record"
          >{{record.fromSkuInfo?record.fromSkuInfo.name:record.toSkuName}}</template>
          <template
            slot="spec"
            slot-scope="text,record"
          >{{record.fromSkuInfo?record.fromSkuInfo.spec:record.toSkuSpec}}</template>-->
        </a-table>
      </a-col>
    </a-row>
    <!-- <a-row>
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
              :status="item.state === 'REJECTED'?'error':''"
            >
              <template slot="description">
                <span class="stepC">{{item.name }}</span>
                <p class="stepC">{{item.date}}</p>
              </template>
            </a-step>
          </template>
        </a-steps>
      </a-col>
    </a-row>-->
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
      <a-button disabled>保存</a-button>
    </div>
  </div>
</template>

<script>
import PromptTitle from '@/components/tools/prompt/PromptTitle'
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'
import { put } from '@/api/axios'
import api from '@/api/index'
import axios from 'axios'
import { columnsDetail } from '../base_lib/columns'
export default {
  mixins: [mixinBasic, mixinIsEdit],
  components: {
    'prompt-title': PromptTitle
  },
  props: ['prchaseDetial', 'prchaseId'],
  data() {
    return {
      columnsDetail,
      companyType: '',
      actionOrder: false
    }
  },
  created() {
    this.companyType = localStorage.getItem('companyType')
  },
  methods: {
    isDisabled(val) {
      this.disabled = !val
    },
    // 删除
    isDelete(val) {
      console.log(val)
    },
    orderPick() {
      if (this.actionOrder) {
        this.$message.warning('请不要重复操作')
        return
      }
      this.actionOrder = true
      const data = this.prchaseDetial.orderOutstorageApplyDetailAssign
      const params = []
      data.forEach(item => {
        params.push(item.id)
      })
      put(api.outStorageApplyStatus, params).then(res => {
        if (res.data.code === 0) {
          this.$message.success('操作成功')
          this.$emit('isDrawer', true)
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(() => {
        this.actionOrder = false
        this.$message.error('系统错误')
      })
    },
    printProductOrder() {
      axios.get(api.printOrderOutstorage + `/${this.prchaseId}`, { responseType: 'blob' }).then(res => {
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
/deep/ .ant-form-item-control,
/deep/.ant-form-item-children {
  width: 100% !important;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
