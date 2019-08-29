<template>
  <div class="purchase-info">
    <div class="prompt-title">
      <a-row>
        <a-col :span="18">
          <h3 class="prompt-h3">销售详情</h3>
        </a-col>
        <a-col :span="6" class="prompt-wrapper">
          <span
            class="prompt-edit"
            @click="orderHandle('RECEIVED')"
            v-show="prchaseDetial.status==='WAITING'"
          >
            <a-icon type="check-circle" style="color:#F0BB2E;margin-right:4px" />
            <span>接单</span>
          </span>
          <span
            class="prompt-delete"
            @click="orderHandle('REJECTED')"
            v-show="prchaseDetial.status==='WAITING'"
          >
            <a-icon type="close-circle" style="color:#D50304;margin-right:4px" />
            <span>拒单</span>
          </span>
          <!-- <span class="prompt-delete">
            <a-icon style="color: green;margin-right: 4px;" type="edit"/>
            <span>编辑</span>
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
          <template>{{prchaseDetial.supplierOdNumber}}</template>
        </a-form-item>
      </a-col>
      <!-- <a-col :span="8">
        <a-form-item label="采购单号" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.factoryOdNumber}}</template>
        </a-form-item>
      </a-col>-->
      <a-col :span="8">
        <a-form-item label="客户名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.factoryName}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="总价" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.totalPrice}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="订单类型" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>原材料销售单</template>
        </a-form-item>
      </a-col>
      <!-- <a-col :span="8">
        <a-form-item label="预收款" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>
            <a-switch :checked="prchaseDetial.craft" disabled/>
          </template>
        </a-form-item>
      </a-col>-->
      <a-col :span="8">
        <a-form-item label="备注" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.remarks}}</template>
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
        <h3 class="purchase-info-title">产品详情</h3>
      </a-col>
    </a-row>
    <a-row v-if="prchaseDetial.fromSkuInfo">
      <a-col :span="8">
        <a-form-item label="产品编码" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.fromSkuInfo.code}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="产品名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.fromSkuInfo.name}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="产品规格" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.fromSkuInfo.spec}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="产品材质" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.fromSkuInfo.cz}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="表面处理" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.fromSkuInfo.bmcl}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="单价" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.fromSkuInfo.price}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="订单数量" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.odNumber}} {{prchaseDetial.unit}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="要求交期" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>
            <span
              v-if="prchaseDetial.odRequireDueDate"
            >{{prchaseDetial.odRequireDueDate | formatDate}}</span>
            <span v-else></span>
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="承诺交期" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>
            <span
              v-if="prchaseDetial.odPromiseDueDate"
            >{{prchaseDetial.odPromiseDueDate | formatDate}}</span>
            <span v-else></span>
          </template>
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
      <a-button type="primary" @click="onClose" disabled>保存</a-button>
    </div>
  </div>
</template>

<script>
import PromptTitle from '@/components/tools/prompt/PromptTitle'
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'
import { get, put } from '@/api/axios'
import api from '@/api/index'
export default {
  mixins: [mixinBasic, mixinIsEdit],
  components: {
    'prompt-title': PromptTitle
  },
  props: ['purchaseId'],
  data() {
    return {
      prchaseDetial: {},
      data: []
    }
  },
  created() {
    this.getProcurementDetial(this.purchaseId)
  },
  methods: {
    isDisabled(val) {
      this.disabled = !val
    },
    // 删除
    isDelete(val) {
      console.log(val)
    },
    // 获取渠道商采购详情
    getProcurementDetial(id) {
      get(api.getFactoryMaterialSupplierListDetail + `${id}`).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data
          data.fromSkuInfo = JSON.parse(data.fromSkuInfo)
          this.prchaseDetial = data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    orderHandle(type) {
      const prchaseDetial = this.prchaseDetial
      const data = {
        id: prchaseDetial.id,
        status: type,
        supplierSaleOrderDetail: {
          id: prchaseDetial.ssodId,
          status: type
        }
      }
      put(api.updateSupplierSaleOrder, data).then(res => {
        if (res.data.code === 0) {
          this.$message.success('操作成功')
          this.$emit('isDrawer', true)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~styles/purchaseInfo.less";
</style>
