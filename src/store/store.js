import Vue from 'vue'
import Vuex from 'vuex'
import category from './modules/category'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menuPermission: [],
    detailPermission: [],
    promptTitle: {
      title: '新建产品分类',
      isEdit: false
    }
  },
  mutations: {
    // menu权限管理
    setMenuPermission(state, permissionArr) {
      state.menuPermission = [...permissionArr]
    },
    // detail权限管理
    setDetailPermission(state, permissionArr) {
      state.detailPermission = [...permissionArr]
    },
    // 详情Title
    setPromptTitle(state, promptTitle) {
      state.promptTitle = promptTitle
    }
  },
  modules: {
    category
  }
})
