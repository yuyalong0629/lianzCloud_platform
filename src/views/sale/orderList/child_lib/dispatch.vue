<template>
  <a-row>
    <a-col :span="8">
      <a-form-item label="计划员：" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input class="inputWidth" placeholder="请输入订单编号"/>
      </a-form-item>
    </a-col>
    <a-col :span="8">
      <a-form-item label="工厂厂长：" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input class="inputWidth" placeholder="请输入净价总价"/>
      </a-form-item>
    </a-col>
    <a-col :span="8">
      <a-form-item label="生产基地：" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-cascader
          :options="areas"
          placeholder="请选择生产基地"
          class="inputWidth"
          :fieldNames="{label:'name',value:'id',children:'childrens'}"
        />
      </a-form-item>
    </a-col>
  </a-row>
</template>

<script>
import { areas } from 'utils/area.js'
export default {
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      areas
    }
  }
}
</script>

<style lang="less" scoped>
@import "~styles/variable.less";
.inputWidth {
  .inputWidth();
}

/deep/ .ant-input-disabled {
  border: none !important;
}
</style>
