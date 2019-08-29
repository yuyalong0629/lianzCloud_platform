<template>
  <a-form layout="inline">
    <a-row class="search">
      <a-form-item label="规格" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-select
          style="width:200px"
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
      <a-form-item label="交期" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-range-picker
          style="width:200px"
          format="YYYY-MM-DD"
          @change="(dates, dateStrings)=>{inputChange(dateStrings,'date')}"
        />
      </a-form-item>
      <a-form-item label="材质" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-select
          style="width:200px"
          showSearch
          allowClear
          :showArrow="false"
          :filterOption="false"
          :defaultActiveFirstOption="false"
          @search="val=>handleSelectChange(val,'cz')"
          @change="(val)=>{inputChange(val,'cz')}"
          @popupScroll="e=>currentPageChange(e,'cz')"
        >
          <a-select-option v-for="item in textures" :key="item">{{item}}</a-select-option>
        </a-select>
      </a-form-item>
    </a-row>
  </a-form>
</template>

<script>
import moment from 'moment'
import api from '@/api/index.js'
import { get } from '@/api/axios.js'
import { mixinBasic } from '@/components/tools/mixin/mixin'
import { mixinCurrentPage } from '@/views/sale/mixin/minxinSale'
export default {
  mixins: [mixinBasic, mixinCurrentPage],
  props: ['companyType'],
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
      timer: '',
      data: {
        cz: '',
        spec: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  created() {
    this.getListCompanySpringCz()
    this.getListCompanySpringSpecs()
  },
  methods: {
    moment,
    // 按条件搜索渠道商订单列表
    inputChange(val, type) {
      this.dataCompany = []
      const data = this.data
      if (type === 'date') {
        data.startTime = val[0]
        data.endTime = val[1]
      } else {
        data[type] = val
      }
      if (this.timer !== '') {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.$emit('changeInput', this.data)
      }, 500)
    },
    // 选择框的下拉加载
    currentPageChange(e, type) {
      const result = this.getCurrentPageChange(e)
      if (result) {
        if (type === 'cz') {
          this.getListCompanySpringCz(this.czCurrentPage)
        } else if (type === 'spec') {
          this.getListCompanySpringSpecs(this.specCurrentPage)
        }
      }
    },
    // 模糊搜索
    handleSelectChange(val, type) {
      if (this.timer !== '') {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        if (type === 'cz') {
          this.czCurrentPage = 1
          this.textures = []
          this.texturesValue = val
          this.getListCompanySpringCz()
        } else {
          this.specCurrentPage = 1
          this.odSpecList = []
          this.odSpecListValue = val
          this.getListCompanySpringSpecs()
        }
      }, 500)
    },
    // 列表商家所有弹簧的规格
    getListCompanySpringSpecs(currentPage = 1, pageSize = 50) {
      if (currentPage > this.odSpecPages && this.odSpecPages !== 0) {
        return
      }
      get(api.getListCompanySpringSpecs, { spec: this.odSpecListValue, currentPage, pageSize }).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data.records
          const odSpecList = this.odSpecList
          this.odSpecList = odSpecList.concat(data).filter(item => item !== null)
          this.odSpecPages = Number(res.data.data.pages)
          this.specCurrentPage += 1
        }
      })
    },
    // 列表商家所有弹簧的材质
    getListCompanySpringCz(currentPage = 1, pageSize = 50) {
      if (currentPage > this.texturesPages && this.texturesPages !== 0) {
        return
      }
      get(api.getListCompanySpringCz, { cz: this.texturesValue, currentPage, pageSize }).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data.records
          const textures = this.textures
          this.textures = textures.concat(data).filter(item => item !== null)
          this.texturesPages = Number(res.data.data.pages)
          this.czCurrentPage += 1
        }
      })
    }
  }
}
</script>
