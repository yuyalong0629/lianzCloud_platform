<template>
  <a-form :form="classAttrInfoForm" layout="horizontal" hideRequiredMark>
    <a-row>
      <component
        v-if="componentData.length"
        :is="item.component"
        v-for="(item, index) in componentData"
        :key="item.id"
        :data="{ data: item, index: index }"
        @categoryData="categoryData"
        :childDisabled="childDisabled"
      ></component>
    </a-row>
  </a-form>
</template>
<script>
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'
import SelectComponent from './extends/SelectComponent'
import InputComponent from './extends/InputComponent'
import { getClassAttr } from 'goods/basic_lib/index'
import { setTimeout } from 'timers'

export default {
  name: 'ClassAttr',
  mixins: [mixinBasic, mixinIsEdit],
  data() {
    return {
      classAttrInfoForm: this.$form.createForm(this),
      componentData: [],
      clssData: []
    }
  },
  methods: {
    // 接受子组件 $emit
    categoryData(val) {
      console.log(val)
      this.clssData.push(val)
      // 去重复
      const hash = {}
      const newData = this.clssData.reduceRight((item, next) => {
        hash[next.catAttrId]
          ? ''
          : (hash[next.catAttrId] = true && item.push(next))
        return item
      }, [])
      console.log(newData)
      this.$emit('classData', newData)
    }
  },
  props: {
    classAttrVal: {
      type: Array,
      default: []
    },
    classAttrInfoData: {
      type: Array,
      default: []
    },
    classCatId: {
      type: String,
      default: ''
    },
    childDisabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    classAttrVal: {
      handler(val) {
        if (val.length) {
          console.log(val)
          this.componentData = []
          val.forEach(item => {
            if (item.inputType === 'INPUT') {
              this.componentData.push({
                name: item.name,
                id: item.id,
                required: item.required,
                attrType: item.attrType,
                valType: item.valType,
                component: 'inputComponent'
              })
            }
            if (item.inputType === 'RADIO' || item.inputType === 'CHECKBOX') {
              this.componentData.push({
                name: item.name,
                id: item.id,
                required: item.required,
                attrType: item.attrType,
                options: item.optionList,
                component: 'selectComponent'
              })
            }
          })
          console.log(this.componentData)
        }
      },
      deep: true,
      immediate: true
    },
    classAttrInfoData: {
      handler(val) {
        if (val.length) {
          // console.log(val)
          getClassAttr(this.classCatId).then(res => {
            if (res.data.code === 0) {
              this.componentData = []
              res.data.data.forEach((item, index) => {
                const newData = val.filter((cItem, index) => {
                  return item.id === cItem.catAttrId
                })
                if (item.inputType === 'INPUT') {
                  this.componentData[index] = {
                    name: item.name,
                    id: item.id,
                    required: item.required,
                    attrType: item.attrType,
                    valType: item.valType,
                    component: 'inputComponent',
                    val: newData[0].val,
                    catAttrId: newData[0].catAttrId
                  }
                }
                if (
                  item.inputType === 'RADIO' ||
                  item.inputType === 'CHECKBOX'
                ) {
                  this.componentData[index] = {
                    name: item.name,
                    id: item.id,
                    required: item.required,
                    attrType: item.attrType,
                    options: item.optionList,
                    component: 'selectComponent',
                    val: newData[0].val,
                    catAttrId: newData[0].catAttrId
                  }
                }
              })
            }
          })
          // console.log(this.componentData)
        }
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    SelectComponent,
    InputComponent
  }
}
</script>
<style lang="less" scoped>
</style>
