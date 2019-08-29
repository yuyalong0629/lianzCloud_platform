<template>
  <a-col :span="8">
    <a-form-item
      :label="getData.data.name"
      :class="{labelColor: isLabelColor}"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :title="getData.data.name"
    >
      <a-input
        v-if="childDisabled"
        :defaultValue="getData.data.val"
        @change="e => onChangeInput(e.target.value, data)"
        :placeholder="`请输入${getData.data.name}`"
      />
      <template v-else="childDisabled">{{ getData.data.val }}</template>
    </a-form-item>
  </a-col>
</template>
<script>
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'

export default {
  name: 'InputComponent',
  mixins: [mixinBasic, mixinIsEdit],
  data() {
    return {
      inputData: {}
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
    onChangeInput(value, data) {
      console.log(value)
      console.log(data)
      Object.assign(this.inputData, {
        catAttrId: data.data.id,
        catAttrName: data.data.name,
        val: value
      })
      this.$emit('categoryData', this.inputData)
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
