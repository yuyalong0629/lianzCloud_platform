<template>
  <a-form :form="goodsInfoForm" layout="horizontal" hideRequiredMark>
    <a-row>
      <a-col :span="8">
        <a-form-item
          label="产品编码"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            v-if="childDisabled"
            disabled="disabled"
            v-decorator="['code']"
            placeholder="默认带出"
          />
          <template v-else="childDisabled">{{ skuInfoData.code }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="产品分类"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-cascader
            v-if="childDisabled"
            v-decorator="['catId']"
            :options="options"
            :fieldNames="{ label: 'name', value: 'id', children: 'childrens' }"
            @change="onChangeGoodsClass"
            placeholder="请输入分类名称"
            changeOnSelect
          />
          <template v-else="childDisabled">{{ classCatObj.val ? classCatObj.val.slice(-1).join('') : '' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="产品名称"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            v-if="childDisabled"
            v-decorator="['name', {rules: [{ required: true, message: '请输入产品名称!'}] }]"
            placeholder="请输入产品名称"
          />
          <template v-else="childDisabled">{{ skuInfoData.name }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="产品图号"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="childDisabled" v-decorator="['drawNum']" placeholder="请输入产品图号"/>
          <template v-else="childDisabled">{{ skuInfoData.drawNum }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="图号版本号"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="childDisabled" v-decorator="['drawVersion']" placeholder="请输入产品图号版本号"/>
          <template v-else="childDisabled">{{ skuInfoData.drawVersion }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="规格"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="childDisabled" v-decorator="['spec']" placeholder="请输入规格"/>
          <template v-else="childDisabled">{{ skuInfoData.spec }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="基础报价"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="childDisabled" v-decorator="['price']" placeholder="请输入基础报价"/>
          <template v-else="childDisabled">{{ skuInfoData.price + '' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="计量单位"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-select v-if="childDisabled" allowClear placeholder="请输入单位" v-decorator="['unit',{rules: [],initialValue:'公斤'}]">
            <a-select-option value="套">套</a-select-option>
            <a-select-option value="毫米">毫米</a-select-option>
            <a-select-option value="只">只</a-select-option>
            <a-select-option value="公斤">公斤</a-select-option>
          </a-select>
          <template v-else="childDisabled">{{ skuInfoData.unit }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="获取途径"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-select
            allowClear
            v-if="childDisabled"
            placeholder="请输入获取途径"
            v-decorator="['gateway']"
          >
            <a-select-option value="SELF">自制</a-select-option>
            <a-select-option value="BUY">外购</a-select-option>
          </a-select>
          <template v-else="childDisabled">{{ skuInfoData.gateway === 'SELF' ? '自制' : '外购' }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="执行标准"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="childDisabled" v-decorator="['standard']" placeholder="请输入执行标准"/>
          <template v-else="childDisabled">{{ skuInfoData.standard }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="单个重量"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            v-if="childDisabled"
            v-decorator="['weight', {rules: [{pattern: '^-?(0|[1-9][0-9]*)(\.[0-9]*)?$', message: '请输入数字'}], validateTrigger: ['change', 'blur']}]"
            placeholder="请输入单个重量"
          />
          <template v-else="childDisabled">{{ skuInfoData.weight }}</template>
        </a-form-item>
      </a-col>
      <!-- <a-col :span="8">
        <a-form-item
          label="表面处理"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-select v-if="childDisabled" allowClear placeholder="请输入表面处理" v-decorator="['bmcl']">
            <a-select-option value="喷塑">喷塑</a-select-option>
            <a-select-option value="电镀-镀锌">电镀-镀锌</a-select-option>
            <a-select-option value="电镀-镀镍">电镀-镀镍</a-select-option>
            <a-select-option value="上油">上油</a-select-option>
            <a-select-option value="喷砂">喷砂</a-select-option>
          </a-select>
          <template v-else="childDisabled">{{ skuInfoData.bmcl }}</template>
        </a-form-item>
      </a-col> -->
      <a-col :span="8">
        <a-form-item
          label="材质"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-select v-if="childDisabled" allowClear placeholder="请选择材质" v-decorator="['cz']">
            <a-select-option
              v-for="item of czData"
              :key="item.id"
              :value="item.realValue"
            >{{item.realValue}}</a-select-option>
          </a-select>
          <template v-else="childDisabled">{{ skuInfoData.cz }}</template>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="备注"
          :class="{labelColor: isLabelColor}"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-if="childDisabled" v-decorator="['remark']" placeholder="请输入备注"/>
          <template v-else="childDisabled">{{ skuInfoData.remark }}</template>
        </a-form-item>
      </a-col>
      </a-col>
    </a-row>
  </a-form>
</template>
<script>
import { getGoodsClass, getClassAttr, custIndustry } from '../../basic_lib/index'
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'
import { findParentId } from 'utils/utils.js'

export default {
  name: 'ProductInfoForm',
  mixins: [mixinBasic, mixinIsEdit],
  data() {
    return {
      goodsInfoForm: this.$form.createForm(this),
      options: [],
      czData: [],
      classCatObj: {
        val: [],
        id: []
      }
    }
  },
  props: {
    skuInfoData: {
      type: Object,
      default: {}
    },
    springInfoType: {
      type: String,
      default: ''
    },
    childDisabled: {
      type: Boolean,
      default: false
    }
  },
  created() {
    // 产品分类
    getGoodsClass.call(this).then(() => {
      console.log(this.options)
      console.log(this.skuInfoData)
      this.classCatObj.val = findParentId(
        this.skuInfoData.catId,
        this.options,
        'name'
      )
      this.classCatObj.id = findParentId(
        this.skuInfoData.catId,
        this.options,
        'id'
      )
      this.$emit('classCatObj', this.classCatObj)
    })
    custIndustry().then(res => {
      if (res.data.code === 0) {
        const obj = {}
        this.czData = res.data.data.reduce((item, next) => {
          obj[next.realValue]
            ? ''
            : (obj[next.realValue] = true && item.push(next))
          return item
        }, [])
      }
    })
  },
  methods: {
    // 产品分类
    onChangeGoodsClass(value) {
      console.log(value)
      // 产品分类属性
      getClassAttr(...value).then(res => {
        if (res.data.code === 0) {
          console.log(res.data.data)
          this.$emit('classAttrInfo', res.data.data)
        } else {
          this.$emit('classAttrInfo', [])
        }
      })
    }
    // 弹簧种类
    // handleChangeSpringType(value) {
    //   console.log(value)
    //   this.$emit('springType', value)
    // }
  },
  watch: {},
  computed: {
    getSpringType() {
      const configObj = {
        YA: '压簧',
        LA: '拉簧',
        NIU: '扭簧',
        DIE: '碟簧',
        BO: '波簧',
        BAN: '板簧'
      }
      return configObj[this.springInfoType]
    }
  }
}
</script>
<style lang="less" scoped>
@import '~styles/variable.less';

.labelColor {
  /deep/ .ant-form-item-label label {
    .labelColor();
  }
}
</style>
