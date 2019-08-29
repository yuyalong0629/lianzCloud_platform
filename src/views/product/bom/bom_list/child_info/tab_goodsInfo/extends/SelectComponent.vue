<template>
  <a-col :span="8">
    <a-form-item
      :label="getData.data.name"
      :class="{labelColor: isLabelColor}"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-select
        v-if="childDisabled"
        allowClear
        labelInValue
        :defaultValue="{ key: getData.data.val || '' }"
        :placeholder="`请输入${getData.data.name}`"
        @change="e => onChangeSelect(e, data)"
      >
        <a-select-option key="0" v-for="item in getData.data.options" :key="item.id">{{item.val}}</a-select-option>
      </a-select>
      <template v-else="childDisabled">{{ getData.data.val }}</template>
    </a-form-item>
  </a-col>
</template>
<script>
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'

export default {
  name: 'SelectComponent',
  mixins: [mixinBasic, mixinIsEdit],
  data() {
    return {
      selectData: {},
      getData: {}
    }
  },
  props: {
    data: {
      type: Object,
      default: {}
    },
    childDisabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onChangeSelect(value, data) {
      console.log(value)
      this.dataValue = value
      console.log(data)
      Object.assign(this.selectData, {
        catAttrId: data.data.id,
        catAttrName: data.data.name,
        attrValId: value.key,
        val: value.label
      })
      this.$emit('categoryData', this.selectData)
    }
  },
  watch: {
    data: {
      handler(val) {
        this.getData = val
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
</style>