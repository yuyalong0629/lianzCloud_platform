
import api from '@/api/index'
import { get } from '@/api/axios'
export const viewProductDetail = {
  data() {
    return {
      productVisible: false,
      goodsViewInfo: {}
    }
  },
  methods: {
    closeProductDrawer() {
      this.productVisible = false
    },
    isProductDrawer() {
      this.productVisible = false
    },
    getViewInfo(params) {
      this.$store.commit('setPromptTitle', {
        title: '产品信息',
        isEdit: true
      })
      get(api.goodsView + `?skuId=${params}`)
        .then(res => {
          if (res.data.code === 0) {
            this.goodsViewInfo = res.data.data
            this.productVisible = true
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
