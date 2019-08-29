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
        :defaultValue="getData.data.val || undefined"
        :placeholder="`请输入${getData.data.name}`"
        @change="e => onChangeSelect(e, getData.data)"
      >
        <a-select-option v-for="item in getData.data.options" :key="item.id">{{item.val}}</a-select-option>
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
      console.log(data)
      if (value) {
        const catAttrName = data.options.filter(item => value === item.id)[0]
        console.log(catAttrName.val)
        Object.assign(this.selectData, {
          catAttrId: data.id,
          catAttrName: data.name,
          attrValId: value,
          val: catAttrName.val
        })
        this.$emit('categoryData', this.selectData)
      }
    }
  },
  watch: {
    data: {
      handler(val) {
        this.getData = val
        console.log(this.getData)
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
</style>