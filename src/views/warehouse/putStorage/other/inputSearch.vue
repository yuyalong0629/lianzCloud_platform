<template>
  <a-form layout="inline">
    <a-form-item label="规格" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-select
        class="inputWidth"
        showSearch
        allowClear
        :showArrow="false"
        :filterOption="false"
        :defaultActiveFirstOption="false"
        @search="val=>handleSelectChange(val,'spec')"
        @change="(val)=>{inputChange(val,'spec')}"
        @popupScroll="e=>currentPageChange(e,'spec')"
      >
        <a-select-option v-for="item in odSpecList" :key="item">{{item}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="材质" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-select
        class="inputWidth"
        showSearch
        allowClear
        :showArrow="false"
        :filterOption="false"
        :defaultActiveFirstOption="false"
        @search="val=>handleSelectChange(val,'cz')"
        @change="(val)=>{inputChange(val,'cz')}"
        @popupScroll="e=>currentPageChange(e,'cz')"
        :getPopupContainer="triggerNode => triggerNode.parentNode"
      >
        <a-select-option v-for="item in textures" :key="item">{{item}}</a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>

<script>
import { get } from '@/api/axios.js'
import api from '@/api/index.js'
import { mixinBasic } from '@/components/tools/mixin/mixin'
import { mixinCurrentPage } from '@/views/sale/mixin/minxinSale'
export default {
  mixins: [mixinBasic, mixinCurrentPage],
  data() {
    return {
      specCurrentPage: 1,
      czCurrentPage: 1,
      odSpecList: [],
      odSpecPages: 0,
      odSpecListValue: '',
      textures: [],
      texturesValue: '',
      texturesPages: 0,
      data: {
        cz: '',
        spec: ''
      },
      timer: ''
    }
  },
  created() {
    this.getFactoryPolicyOrderSpec()
    this.getFactoryPolicyOrderCz()
  },
  methods: {
    inputChange(val, type) {
      this.dataCompany = []
      const data = this.data
      data[type] = val
      if (this.timer !== '') {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.$emit('dataChange', data)
      }, 500)
    },
    handleSelectChange(val, type) {
      if (this.timer !== '') {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        if (type === 'cz') {
          this.textures = []
          this.texturesValue = val
          this.getFactoryPolicyOrderCz()
        } else {
          this.odSpecList = []
          this.odSpecListValue = val
          this.getFactoryPolicyOrderSpec()
        }
      }, 500)
    },
    currentPageChange(e, type) {
      const result = this.getCurrentPageChange(e)
      if (result) {
        if (type === 'cz') {
          this.getFactoryPolicyOrderCz(this.czCurrentPage)
        } else if (type === 'spec') {
          this.getFactoryPolicyOrderSpec(this.specCurrentPage)
        }
      }
    },
    // 工单分单-工厂订单商品材质
    getFactoryPolicyOrderCz(currentPage = 1, pageSize = 50) {
      if (currentPage > this.texturesPages && this.texturesPages !== 0) {
        return
      }
      get(api.getFactoryPolicyOrderCz, { currentPage, pageSize }).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data.records
          const textures = this.textures
          this.textures = textures.concat(data).filter(item => item !== null)
          this.texturesPages = Number(res.data.data.pages)
          this.czCurrentPage += 1
        }
      })
    },
    // 工单分单-工厂订单商品规格
    getFactoryPolicyOrderSpec(currentPage = 1, pageSize = 50) {
      if (currentPage > this.odSpecPages && this.odSpecPages !== 0) {
        return
      }
      get(api.getFactoryPolicyOrderSpec, { currentPage, pageSize }).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data.records
          const odSpecList = this.odSpecList
          this.odSpecList = odSpecList.concat(data).filter(item => item !== null)
          this.odSpecPages = Number(res.data.data.pages)
          this.specCurrentPage += 1
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.inputWidth {
  width: 200px;
}
</style>
