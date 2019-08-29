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
    this.getFactoryMaterialRequireSpec()
    this.getFactoryMaterialRequireCz()
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
          this.getFactoryMaterialRequireCz()
        } else {
          this.odSpecList = []
          this.odSpecListValue = val
          this.getFactoryMaterialRequireSpec()
        }
      }, 500)
    },
    currentPageChange(e, type) {
      const result = this.getCurrentPageChange(e)
      if (result) {
        if (type === 'cz') {
          this.getFactoryMaterialRequireCz(this.czCurrentPage)
        } else if (type === 'spec') {
          this.getFactoryMaterialRequireSpec(this.specCurrentPage)
        }
      }
    },
    // 列表所有待采购材质
    getFactoryMaterialRequireCz(currentPage = 1, pageSize = 50) {
      if (currentPage > this.texturesPages && this.texturesPages !== 0) {
        return
      }
      get(api.getFactoryMaterialRequireCz, { cz: this.texturesValue, currentPage, pageSize }).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data.records
          const target = data.filter(item => item !== null)
          const textures = target.filter(item => item.cz !== null)
          const czList = []
          textures.forEach(item => {
            czList.push(item.cz)
          })
          this.textures = new Set(this.textures.concat(czList))
          this.texturesPages = Number(res.data.data.pages)
          this.czCurrentPage += 1
        }
      })
    },
    // 列表所有待采购规格
    getFactoryMaterialRequireSpec(currentPage = 1, pageSize = 50) {
      if (currentPage > this.odSpecPages && this.odSpecPages !== 0) {
        return
      }
      get(api.getFactoryMaterialRequireSpec, { spec: this.odSpecListValue, currentPage, pageSize }).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data.records
          const target = data.filter(item => item !== null)
          const odSpecList = target.filter(item => item.spec !== null)
          const specList = []
          odSpecList.forEach(item => {
            specList.push(item.spec)
          })
          this.odSpecList = new Set(this.odSpecList.concat(specList))
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
