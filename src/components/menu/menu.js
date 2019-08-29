import { get } from 'api/axios.js'
import api from 'api/index.js'
// import store from '@/store/store.js'

/**
 * @description: Menu侧边导航数组数据
 * @param {null}
 * @return: setMenu
 */
export function setMenu() {
  return get(api.getNav).then(res => {
    const mapObj = {
      name: 'title',
      id: 'key',
      childrens: 'children'
    }
    // 全局替换字段名
    const conversion = JSON.parse(JSON.stringify(res.data.data).replace(/name|id|childrens/gi, function (matched) {
      return mapObj[matched]
    }))
    this.menuData = Array.from(conversion)
    // console.log(this.menuData)
    // 点击菜单，收起其他展开的所有菜单，保持菜单聚焦简洁。
    this.rootSubmenuKeys = []
    this.menuData.forEach(e => {
      this.rootSubmenuKeys.push(e.key)
    })
  }).catch(err => {
    console.log(err)
  })
}

/**
 * @description: 导航权限
 * @param {String} param [导航选中key值]
 * @return: defaultPermission
 */
export function defaultPermission(params) {
  return get(api.navPermission, params).catch(err => {
    console.log(err)
  })
}
