<template>
  <a-form layout="inline">
    <a-row style="margin-bottom:16px">
      <a-form-item :label-col="{span: 8}" :wrapper-col="{span: 16}" label="订单编号">
        <a-input
          class="inputWidth"
          v-model="data.odOrderNumber"
          @change="(e)=>{inputChange(e.target.value,'odOrderNumber')}"
        ></a-input>
      </a-form-item>
      <a-form-item :label-col="{span: 8}" :wrapper-col="{span: 16}" label="产品规格">
        <a-select
          class="inputWidth"
          showSearch
          allowClear
          v-model="data.spec"
          :showArrow="false"
          :filterOption="false"
          :defaultActiveFirstOption="false"
          @search="handleSelectChange"
          @change="val=>inputChange(val,'spec')"
          @popupScroll="e=>currentPageChange(e)"
        >
          <a-select-option v-for="item in odSpecList" :key="item">{{item}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label-col="{span: 8}" :wrapper-col="{span: 16}" label="交期">
        <a-range-picker
          class="inputWidth"
          v-model="dateArr"
          @change="(data,dateing)=>inputChange(dateing,'date')"
          format="YYYY-MM-DD"
        />
      </a-form-item>
    </a-row>
  </a-form>
</template>

<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import api from '@/api/index.js'
import { get } from '@/api/axios.js'
import { mixinCurrentPage } from '@/views/sale/mixin/minxinSale'
moment.locale('zh-cn')
export default {
  mixins: [mixinCurrentPage],
  data() {
    return {
      dateArr: [],
      timer: '',
      data: {},
      specCurrentPage: 1,
      odSpecList: [],
      odSpecPages: 0,
      odSpecListValue: ''
    }
  },
  created() {
    this.getListCompanySpringSpecs()
  },
  methods: {
    // 按条件搜索
    inputChange(val, type) {
      if (type === 'date') {
        this.data.startTime = val[0]
        this.data.endTime = val[1]
      } else {
        this.data[type] = val
      }
      // 输入框防抖
      if (this.timer !== '') {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.$emit('dataChange', this.data)
      }, 500)
    },
    // 重置搜索条件
    searchReset() {
      this.data.odOrderNumber = ''
      this.data.spec = ''
      this.dateArr = []
      this.data.endTime = ''
      this.data.startTime = ''
      this.$emit('dataChange', this.data)
    },
    currentPageChange(e) {
      const result = this.getCurrentPageChange(e)
      if (result) {
        this.getListCompanySpringSpecs(this.specCurrentPage)
      }
    },
    handleSelectChange(val) {
      if (this.timer !== '') {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.searchConditions(val)
      }, 500)
    },
    searchConditions(val) {
      this.odSpecList = []
      this.odSpecListValue = val
      this.getListCompanySpringSpecs()
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
    }
  }
}
</script>

<style lang="less" scoped>
@import "~styles/variable.less";
.inputWidth {
  width: 200px;
}
</style>
