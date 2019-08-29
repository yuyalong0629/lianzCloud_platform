<template>
  <a-form :form="productAttrForm" layout="horizontal" hideRequiredMark>
    <a-row>
      <a-col :span="8" v-if="['YA', 'LA', 'NIU', 'DIE', 'BO', 'BAN'].includes(springVal)">
        <a-form-item
          label="公差等级"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-select v-if="childDisabled" allowClear placeholder="请输入公差等级" v-decorator="['gcdj']">
            <a-select-option key="1">1</a-select-option>
            <a-select-option key="2">2</a-select-option>
            <a-select-option key="3">3</a-select-option>
          </a-select>
          <template v-else="childDisabled">{{ springInfoData.gcdj }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="['YA', 'LA', 'NIU', 'BO'].includes(springVal)">
        <a-form-item
          label="线径"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input-search
            v-if="childDisabled"
            v-decorator="['xj', {rules: [{pattern: '^[0-9]*$', message: '请输入数字', type: 'string'}], validateTrigger: ['change', 'blur']}]"
            placeholder="请输入线径"
          >
            <a-button slot="enterButton">mm</a-button>
          </a-input-search>
          <template v-else="childDisabled">{{ springInfoData.xj + 'mm' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="['YA', 'LA', 'NIU', 'DIE', 'BO', 'BAN'].includes(springVal)">
        <a-form-item
          label="外径"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input-search
            v-if="childDisabled"
            v-decorator="['wj', {rules: [{pattern: '^[0-9]*$', message: '请输入数字', type: 'string'}], validateTrigger: ['change', 'blur']}]"
            placeholder="请输入外径"
          >
            <a-button slot="enterButton">mm</a-button>
          </a-input-search>
          <template v-else="childDisabled">{{ springInfoData.wj + 'mm' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="['YA', 'LA', 'NIU', 'DIE', 'BO'].includes(springVal)">
        <a-form-item
          label="自由高度"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input-search
            v-if="childDisabled"
            v-decorator="['zygd', {rules: [{pattern: '^[0-9]*$', message: '请输入数字', type: 'string'}], validateTrigger: ['change', 'blur']}]"
            placeholder="请输入自由高度"
          >
            <a-button slot="enterButton">mm</a-button>
          </a-input-search>
          <template v-else="childDisabled">{{ springInfoData.zygd + 'mm' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="['YA', 'LA', 'BO'].includes(springVal)">
        <a-form-item
          label="总圈数"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input-search
            v-if="childDisabled"
            v-decorator="['zqs', {rules: [{pattern: '^[0-9]*$', message: '请输入数字', type: 'string'}], validateTrigger: ['change', 'blur']}]"
            placeholder="请输入总圈数"
          >
            <a-button slot="enterButton">圈</a-button>
          </a-input-search>
          <template v-else="childDisabled">{{ springInfoData.zqs + '圈' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="['YA', 'LA', 'NIU', 'DIE', 'BO', 'BAN'].includes(springVal)">
        <a-form-item
          label="材质"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-select v-if="childDisabled" allowClear placeholder="请输入材质" v-decorator="['cz']">
            <a-select-option v-for="item of materialOptions" :key="item">{{ item }}</a-select-option>
          </a-select>
          <template v-else="childDisabled">{{ springInfoData.cz }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="['YA', 'BO'].includes(springVal)">
        <a-form-item
          label="压并高度"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input-search
            v-if="childDisabled"
            v-decorator="['ybgd', {rules: [{pattern: '^[0-9]*$', message: '请输入数字', type: 'string'}], validateTrigger: ['change', 'blur']}]"
            placeholder="请输入压并高度"
          >
            <a-button slot="enterButton">mm</a-button>
          </a-input-search>
          <template v-else="childDisabled">{{ springInfoData.ybgd + 'mm' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="['YA', 'DIE', 'BO'].includes(springVal)">
        <a-form-item
          label="工作高度"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input-search
            v-if="childDisabled"
            v-decorator="['gzgd', {rules: [{pattern: '^[0-9]*$', message: '请输入数字', type: 'string'}], validateTrigger: ['change', 'blur']}]"
            placeholder="请输入工作高度"
          >
            <a-button slot="enterButton">mm</a-button>
          </a-input-search>
          <template v-else="childDisabled">{{ springInfoData.gzgd + 'mm' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="['YA', 'NIU'].includes(springVal)">
        <a-form-item
          label="有效圈数"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input-search
            v-if="childDisabled"
            v-decorator="['yxqs', {rules: [{pattern: '^[0-9]*$', message: '请输入数字', type: 'string'}], validateTrigger: ['change', 'blur']}]"
            placeholder="请输入有效圈数"
          >
            <a-button slot="enterButton">圈</a-button>
          </a-input-search>
          <template v-else="childDisabled">{{ springInfoData.yxqs + '圈' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="['YA', 'LA', 'NIU', 'BO', 'BAN'].includes(springVal)">
        <a-form-item
          label="力值"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input-search
            v-if="childDisabled"
            v-decorator="['lz', {rules: [{pattern: '^[0-9]*$', message: '请输入数字', type: 'string'}], validateTrigger: ['change', 'blur']}]"
            placeholder="请输入力值"
          >
            <a-button slot="enterButton">N</a-button>
          </a-input-search>
          <template v-else="childDisabled">{{ springInfoData.lz + 'N' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="['YA', 'LA', 'NIU', 'BO'].includes(springVal)">
        <a-form-item
          label="旋向"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-select v-if="childDisabled" allowClear placeholder="请输入旋向" v-decorator="['xx']">
            <a-select-option value="左旋">左旋</a-select-option>
            <a-select-option value="右旋">右旋</a-select-option>
          </a-select>
          <template v-else="childDisabled">{{ springInfoData.xx }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="['YA'].includes(springVal)">
        <a-form-item
          label="螺旋角"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input-search
            v-if="childDisabled"
            v-decorator="['lxj', {rules: [{pattern: '^[0-9]*$', message: '请输入数字', type: 'string'}], validateTrigger: ['change', 'blur']}]"
            placeholder="请输入螺旋角"
          >
            <a-button slot="enterButton">°</a-button>
          </a-input-search>
          <template v-else="childDisabled">{{ springInfoData.lxj + '°' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="['YA', 'LA', 'NIU', 'BO'].includes(springVal)">
        <a-form-item
          label="展开长度"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input-search
            v-if="childDisabled"
            v-decorator="['zkcd', {rules: [{pattern: '^[0-9]*$', message: '请输入数字', type: 'string'}], validateTrigger: ['change', 'blur']}]"
            placeholder="请输入展开长度"
          >
            <a-button slot="enterButton">mm</a-button>
          </a-input-search>
          <template v-else="childDisabled">{{ springInfoData.zkcd + 'mm' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="['DIE', 'BO', 'BAN'].includes(springVal)">
        <a-form-item
          label="内径"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input-search
            v-if="childDisabled"
            v-decorator="['nj', {rules: [{pattern: '^[0-9]*$', message: '请输入数字', type: 'string'}], validateTrigger: ['change', 'blur']}]"
            placeholder="请输入内径"
          >
            <a-button slot="enterButton">mm</a-button>
          </a-input-search>
          <template v-else="childDisabled">{{ springInfoData.nj + 'mm' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="['DIE', 'BAN'].includes(springVal)">
        <a-form-item
          label="厚度"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input-search
            v-if="childDisabled"
            v-decorator="['hd', {rules: [{pattern: '^[0-9]*$', message: '请输入数字', type: 'string'}], validateTrigger: ['change', 'blur']}]"
            placeholder="请输入厚度"
          >
            <a-button slot="enterButton">mm</a-button>
          </a-input-search>
          <template v-else="childDisabled">{{ springInfoData.hd + 'mm' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="['BO'].includes(springVal)">
        <a-form-item
          label="波数"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input-search
            v-if="childDisabled"
            v-decorator="['bs', {rules: [{pattern: '^[0-9]*$', message: '请输入数字', type: 'string'}], validateTrigger: ['change', 'blur']}]"
            placeholder="请输入波数"
          >
            <a-button slot="enterButton">波</a-button>
          </a-input-search>
          <template v-else="childDisabled">{{ springInfoData.bs + '波' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="['BO'].includes(springVal)">
        <a-form-item
          label="层数"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input-search
            v-if="childDisabled"
            v-decorator="['cs', {rules: [{pattern: '^[0-9]*$', message: '请输入数字', type: 'string'}], validateTrigger: ['change', 'blur']}]"
            placeholder="请输入层数"
          >
            <a-button slot="enterButton">层</a-button>
          </a-input-search>
          <template v-else="childDisabled">{{ springInfoData.cs + '层' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="['YA', 'LA', 'DIE', 'BO'].includes(springVal)">
        <a-form-item
          label="应力"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input-search
            v-if="childDisabled"
            v-decorator="['yl', {rules: [{pattern: '^[0-9]*$', message: '请输入数字', type: 'string'}], validateTrigger: ['change', 'blur']}]"
            placeholder="请输入应力"
          >
            <a-button slot="enterButton">MPa</a-button>
          </a-input-search>
          <template v-else="childDisabled">{{ springInfoData.yl + 'MPa' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="['YA', 'LA', 'DIE', 'BO', 'BAN'].includes(springVal)">
        <a-form-item
          label="刚度"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input-search
            v-if="childDisabled"
            v-decorator="['gd', {rules: [{pattern: '^[0-9]*$', message: '请输入数字', type: 'string'}], validateTrigger: ['change', 'blur']}]"
            placeholder="请输入刚度"
          >
            <a-button slot="enterButton">N/mm</a-button>
          </a-input-search>
          <template v-else="childDisabled">{{ springInfoData.gd + 'N/mm' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="['YA', 'DIE', 'BO'].includes(springVal)">
        <a-form-item
          label="最大变形量"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input-search
            v-if="childDisabled"
            v-decorator="['zdbxl', {rules: [{pattern: '^[0-9]*$', message: '请输入数字', type: 'string'}], validateTrigger: ['change', 'blur']}]"
            placeholder="请输入最大变形量"
          >
            <a-button slot="enterButton">mm</a-button>
          </a-input-search>
          <template v-else="childDisabled">{{ springInfoData.zdbxl + 'mm' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="['YA', 'LA', 'NIU', 'BO'].includes(springVal)">
        <a-form-item
          label="旋绕比"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input-search
            v-if="childDisabled"
            v-decorator="['xrb', {rules: [{pattern: '^[0-9]*$', message: '请输入数字', type: 'string'}], validateTrigger: ['change', 'blur']}]"
            placeholder="请输入旋绕比"
          >
            <a-button slot="enterButton">mm</a-button>
          </a-input-search>
          <template v-else="childDisabled">{{ springInfoData.xrb + 'mm' }}</template>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script>
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'

export default {
  name: 'SpringAttrForm',
  mixins: [mixinBasic, mixinIsEdit],
  data() {
    return {
      productAttrForm: this.$form.createForm(this),
      options: [],
      materialOptions: [
        'SWPB钢琴线',
        'SUS301不锈钢',
        'SUS302不锈钢',
        'SUS304不锈钢',
        'SUS316不锈钢',
        'SUS631不锈钢',
        '65MN',
        '高碳钢',
        'Inconel',
        'X-750高温合金',
        'X-718高温合金',
        '55CrSi',
        '55CrVa',
        '60Si2Mna',
        '磷铜',
        '铍铜合金',
        '黄铜'
      ]
    }
  },
  props: {
    springVal: {
      type: String,
      default: undefined
    },
    springInfoData: {
      type: Object,
      default: {}
    },
    childDisabled: {
      type: Boolean,
      default: false
    }
  },
  created() {},
  methods: {}
}
</script>
<style lang="less" scoped>
</style>
