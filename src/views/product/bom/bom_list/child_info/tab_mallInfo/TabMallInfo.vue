<template>
  <a-form :form="tabMallAttr" layout="horizontal" hideRequiredMark>
    <a-row>
      <a-col :span="8">
        <a-form-item
          label="公差等级"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-select allowClear v-if="disabled" placeholder="请输入弹簧种类">
            <a-select-option v-for="d in springType" :key="d.id">{{ d.name }}</a-select-option>
          </a-select>
          <template v-else="disabled">getProcessInfo</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="商品广告语"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入商品广告语"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="上架状态"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入上架状态"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="原价"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入原价"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="起售数量"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入起售数量"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="发货城市"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入发货城市"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="发货期"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入发货期"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="售后说明"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入售后说明"/>

          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="使用邮费模版"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入使用邮费模版"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="上架时间"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入上架时间"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="下架时间"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入下架时间"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="力值"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入力值"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="推荐产品"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入推荐产品"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="最大包装方式名称"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入最大包装方式名称"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="最大包装容量"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入最大包装容量"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="中等包装方式"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入中等包装方式"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="中等包装容量"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入中等包装容量"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="最小包装容量"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入最小包装容量"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="详细描述"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入详细描述"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="关键尺寸图"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入关键尺寸图"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="详情尺寸图"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入详情尺寸图"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="3D图"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入3D图"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="创建人"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入创建人"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="创建时间"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入创建时间"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="修改人"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入修改人"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="修改时间"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入修改时间"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="商城价格"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="disabled" v-decorator="['processCode']" placeholder="请输入商城价格"/>
          <!-- <template v-else="disabled">{{getProcessInfo.code}}</template> -->
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script>
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'
import { springType } from '../../basic_lib/column'

export default {
  name: 'TabMallAttr',
  mixins: [mixinBasic, mixinIsEdit],
  data() {
    return {
      tabMallAttr: this.$form.createForm(this),
      springType
    }
  },
  created() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
</style>