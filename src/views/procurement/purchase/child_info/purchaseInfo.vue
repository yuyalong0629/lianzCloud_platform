<template>
  <div class="purchase-info">
    <div class="prompt-title">
      <a-row>
        <a-col :span="18">
          <h3 class="prompt-h3">采购详情</h3>
        </a-col>
        <a-col :span="6" class="prompt-wrapper">
          <span
            class="prompt-delete"
            @click="orderHandle('CANCELLED')"
            v-show="prchaseDetial.status==='WAITING'"
          >
            <i class="iconfont iconjujue" style="color:#D50304;margin-right:4px"></i>
            <span>取消</span>
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
        <a-form-item label="采购编号" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.factoryOdNumber}}</template>
        </a-form-item>
      </a-col>
      <!-- <a-col :span="8">
        <a-form-item label="采购类型" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>
            <span></span>
          </template>
        </a-form-item>
      </a-col>-->
      <a-col :span="8">
        <a-form-item label="总价" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.odTotalPrice}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="采购部门" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>采购部</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="供应商" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.supplierName}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="交货日期" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.odRequireDueDate?moment(prchaseDetial.odRequireDueDate).format('YYYY-MM-DD'):''}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="采购员" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>操作者</template>
        </a-form-item>
      </a-col>
      <!-- <a-col :span="8">
        <a-form-item label="负责人" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>操作者</template>
        </a-form-item>
      </a-col>-->
      <a-col :span="8">
        <a-form-item label="备注" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.remark}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="订单进度" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.status | stateFilter}}</template>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <h3 class="purchase-info-title">产品信息</h3>
      </a-col>
    </a-row>
    <a-row v-if="prchaseDetial.toSkuInfo">
      <a-col :span="8">
        <a-form-item label="产品编码" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>
            {{prchaseDetial.toSkuInfo.code}}
            <!-- <a href="javascript:;">{{prchaseDetial.toSkuInfo.code}}</a> -->
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="产品名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.toSkuInfo.name}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="产品规格" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.toSkuInfo.spec}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="单位" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.toSkuInfo.unit}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="采购数量" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.odNumber}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="库存数量" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.toSkuInfo.storeCount}}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="采购净价" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template>{{prchaseDetial.odUnitPrice}}</template>
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
      <a-button type="primary" @click="onClose" :disabled="!edit">保存</a-button>
    </div>

    <!-- 产品信息抽屉 -->
    <a-drawer
      placement="right"
      :closable="false"
      @close="closeDrawer"
      :visible="visible"
      :width="1040"
    >
      <GoodsInfo @isDrawer="isDrawer"></GoodsInfo>
    </a-drawer>
  </div>
</template>

<script>
import GoodsInfo from '@/views/product/pdm/goods/child_info/GoodsInfo'
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'
import { put } from '@/api/axios'
import api from '@/api/index'
import moment from 'moment'
export default {
  mixins: [mixinBasic, mixinIsEdit],
  props: ['prchaseDetial'],
  components: {
    GoodsInfo
  },
  data() {
    return {
      edit: false,
      visible: false
    }
  },
  created() {
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
