<template>
  <div class="address">
    <a-form :form="form">
      <a-form-item label="收件人姓名" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" required>
        <a-input
          v-decorator="['obj.receiver',{rules:[{ required: true, message: '请输入收件人姓名'}],initialValue:obj.receiver}]"
        />
      </a-form-item>
      <a-form-item label="手机号码" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" required>
        <a-input
          v-decorator="['obj.phone',{rules:[{ required: true, message: '请输入收件人手机号码'}],initialValue:obj.phone}]"
          max="11"
        />
      </a-form-item>
      <a-form-item label="所在地区" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" required>
        <a-cascader
          :options="areas"
          placeholder
          v-decorator="['obj.areas',{rules:[{ required: true, message: '请选择收件人所在地区'}],initialValue:obj.areas}]"
          :fieldNames="{label:'name',value:'id',children:'childrens'}"
          @change="areaHandleChange"
        />
      </a-form-item>
      <a-form-item label="街道地址" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" required>
        <a-input
          v-decorator="['obj.detailAddr',{rules:[{ required: true, message: '请输入收件人详细地址'}],initialValue:obj.detailAddr}]"
        />
      </a-form-item>
      <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 14,offset:5 }">
        <a-checkbox @change="defaultSelect" :defaultChecked="defaultAdd">设为默认收货地址</a-checkbox>
      </a-form-item>
      <a-form-item style="text-align:center">
        <a-button
          type="primary"
          style="background:#8F939A;border:none;margin-right:8px;"
          @click="handleCancel"
        >关闭</a-button>
        <a-button type="primary" style="background:#F0BB2E;border:none;" @click="handleOk">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { postJson } from '@/api/axios.js'
import api from '@/api/index.js'
const areas = require('@/assets/utils/area.js')
export default {
  props: {
    custId: {
      type: String,
      default: '',
      required: false
    },
    obj: {
      type: Object,
      required: false,
      default: function () {
        return {
          area: '',
          areaStr: '',
          city: '',
          cityStr: '',
          custId: this.custId,
          defaultGoodsAddr: '',
          detailAddr: '',
          phone: '',
          province: '',
          provinceStr: '',
          receiver: '',
          areas: []
        }
      }
    }
  },
  data() {
    return {
      areas: areas.areas,
      defaultAdd: false,
      form: this.$form.createForm(this)
    }
  },

  methods: {
    defaultSelect(e) {
      this.defaultAdd = e.target.checked
    },
    areaHandleChange(val, selectedOptions) {
      if (val.length) {
        const result = selectedOptions.map(o => o.name)
        this.obj.province = val[0]
        this.obj.city = val[1]
        this.obj.area = val[2]
        this.obj.provinceStr = result[0]
        this.obj.cityStr = result[1]
        this.obj.areaStr = result[2]
      }
    },
    handleOk(e) {
      e.preventDefault()
      let data = this.obj
      this.form.validateFields(
        (err, val) => {
          if (!err) {
            data = { ...data, ...(val.obj) }
            data.defaultGoodsAddr = this.defaultAdd ? 1 : 0
            delete data.areas
            postJson(api.setAddressIvo, data).then(res => {
              if (res.data.code === 0) {
                this.$message.success('添加地址成功')
              }
              this.$emit('addressCancel', true)
            })
            this.form.resetFields()
          }
        }
      )
    },
    handleCancel(e) {
      this.$emit('addressCancel', false)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~styles/variable.less";

.inputWidth {
  .inputWidth();
}
</style>
