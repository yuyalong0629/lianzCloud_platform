/**
 * @description: 引入一些公共的资源
 */
import { get } from '@/api/axios.js'
import api from '@/api/index.js'

/**
 * @description: 选择器的下拉触底加载
 * @return: mixinCurrentPageChange
 */
export const mixinCurrentPage = {
  methods: {
    getCurrentPageChange(e) {
      const boxHeigth = e.target.scrollHeight - 1
      let height = getComputedStyle(document.querySelector('.ant-select-dropdown-menu')).maxHeight
      height = height.substring(0, height.length - 2)
      const box = {
        scrollTop: e.target.scrollTop
      }
      const dropDownHeight = (parseFloat(height) + box.scrollTop)
      const result = (dropDownHeight > boxHeigth)
      return result
    }
  }
}

/**
 * @description: 获取产品编码 产品规格 产品材质
 * @param {Number} codeCurrentPage 产品编码分页
 * @param {Number} specCurrentPage 产品规格分页
 * @param {Number} czCurrentPage 产品材质分页
 * @param {Array} odSkuCodeList 产品编码
 * @param {Array} odSpecList 产品规格
 * @param {Array} textures 产品材质
 */
export const mixinGetProductAbout = {
  data() {
    return {
      locustAmalgamListPage: 1,
      codeCurrentPage: 1,
      specCurrentPage: 1,
      czCurrentPage: 1,
      locustAmalgamList: [],
      locustAmalgamPages: 0,
      locustAmalgamListValue: '',
      odSkuCodeList: [],
      odSkuCodePages: 0,
      odSkuCodeListValue: '',
      odSpecList: [],
      odSpecPages: 0,
      odSpecListValue: '',
      textures: [],
      texturesValue: '',
      texturesPages: 0
    }
  },
  methods: {
    // 列表公司所有人员
    getCompanyAllUsers(currentPage = 1, pageSize = 50) {
      if (currentPage > this.locustAmalgamPages && this.locustAmalgamPages !== 0) {
        return
      }
      get(api.getUsersLike, { username: this.locustAmalgamListValue, currentPage, pageSize }).then(res => {
        if (res.data.code === 0) {
          const companyAllUsers = res.data.data
          this.locustAmalgamList = this.locustAmalgamList.concat(companyAllUsers.records)
          this.locustAmalgamPages = Number(companyAllUsers.pages)
          this.locustAmalgamListPage += 1
        }
      })
    },
    // 列表商家所有商品的商品编码
    getListCompanyGoodsCode(currentPage = 1, pageSize = 50) {
      if (currentPage > this.odSkuCodePages && this.odSkuCodePages !== 0) {
        return
      }
      get(api.listCompanyGoodsCode, { code: this.odSkuCodeListValue, currentPage, pageSize }).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data.records
          const odSkuCodeList = this.odSkuCodeList
          this.odSkuCodeList = odSkuCodeList.concat(data).filter(item => item !== null)
          this.odSkuCodePages = Number(res.data.data.pages)
          this.codeCurrentPage += 1
        }
      })
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

/**
 * @description: 根据名称，简称，编码模糊搜素公司客户信息
 */
export const getListCompanyCusts = {
  data() {
    return {
      customerPage: 1,
      condition: '',
      listCompanyCustosPages: 0,
      listCompanyCusts: []
    }
  },
  methods: {
    getListCompanyCusts(currentPage = 1, pageSize = 50) {
      if (currentPage > this.listCompanyCustosPages && this.listCompanyCustosPages !== 0) {
        return
      }
      get(api.getListCompanyList, { condition: this.condition, currentPage, pageSize }).then(res => {
        const data = res.data.data
        this.listCompanyCusts = this.listCompanyCusts.concat(data.records)
        this.listCompanyCustosPages = Number(data.pages)
        this.customerPage += 1
      })
    }
  }
}
