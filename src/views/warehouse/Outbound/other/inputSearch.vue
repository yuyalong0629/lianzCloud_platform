<template>
  <a-form layout="inline" style="margin-bottom:16px;">
    <a-row>
      <a-col :span="24">
        <a-row>
          <a-col :span="24" style="margin: 8px 0;">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="发货单号">
              <a-input class="inputWidth"></a-input>
            </a-form-item>
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="客户信息"></a-form-item>
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="状态"></a-form-item>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
</script>

<style lang='less' scoped>
@import "~styles/variable.less";

.inputWidth {
  width: 200px;
}
</style>
