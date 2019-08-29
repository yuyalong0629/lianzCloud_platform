<template>
  <div style="width: 200px">
    <a-menu
      mode="inline"
      :theme="theme"
      :openKeys="openKeys"
      :inlineCollapsed="collapsed"
      @openChange="onOpenChange"
      @select="onSelectKey"
    >
      <template v-for="item in menuData">
        <a-menu-item
          v-if="!item.children"
          :key="item.key"
          @click="() =>parent.$router.push({ path: item.url, query: parent.$route.query })"
        >
          <icon-font v-if="item.icon" :type="item.icon" />
          <span>{{item.title}}</span>
        </a-menu-item>
        <sub-menu v-else :menu-info="item" :key="item.key" />
      </template>
    </a-menu>
  </div>
</template>

<script>
import SubMenu from './SubMenu'
import { setMenu, defaultPermission } from './menu.js'
import { Icon } from 'ant-design-vue'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: require('@/assets/font/iconfont.js')
})

export default {
  name: 'SiderMenu',
  data() {
    return {
      collapsed: false,
      rootSubmenuKeys: [],
      menuData: [],
      openKeys: []
    }
  },
  props: {
    theme: {
      type: String,
      default: 'dark'
    },
    isCollapsed: {
      type: Boolean,
      default: false
    }
  },
  created() {
    setMenu.call(this)
  },
  methods: {
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(
        key => this.openKeys.indexOf(key) === -1
      )
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    onSelectKey(e) {
      defaultPermission
        .call(this, {
          funcId: e.key,
          pageType: 'LIST'
        })
        .then(res => {
          // console.log(res)
          if (res.data.code === 0) {
            const permissionArr = []
            res.data.data.buttons.forEach(e => {
              permissionArr.push(e.btnOptType)
            })
            // console.log(permissionArr)
            this.$store.commit('setMenuPermission', permissionArr)
          }
        })
      defaultPermission
        .call(this, {
          funcId: e.key,
          pageType: 'FORM'
        })
        .then(res => {
          // console.log(res)
          if (res.data.code === 0) {
            const permissionArr = []
            res.data.data.buttons.forEach(e => {
              permissionArr.push(e.btnOptType)
            })
            // console.log(permissionArr)
            this.$store.commit('setDetailPermission', permissionArr)
          }
        })
    }
  },
  watch: {
    '$route.path': function(val) {
      // console.log(val)
    },
    isCollapsed(val) {
      this.openKeys = !val ? this.openKeys : []
    }
  },
  components: {
    'sub-menu': SubMenu,
    'icon-font': IconFont
  }
}
</script>
