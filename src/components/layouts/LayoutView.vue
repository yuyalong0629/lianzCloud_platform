<template>
  <div :class="[`nav-theme-${navTheme}`, `nav-layout-${navLayout}`]">
    <a-layout style="min-height: 100vh">
      <a-layout-sider
        v-if="navLayout === 'left'"
        :theme="navTheme"
        :trigger="null"
        collapsible
        v-model="collapsed"
        style="overflow-y: hidden;"
        width="200px"
      >
        <div class="logo">{{ companyName }}</div>
        <SiderMenu :theme="navTheme" :isCollapsed="collapsed" />
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #FFF; padding: 0">
          <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="trigger" />
          <HeaderMenu />
        </a-layout-header>
        <a-layout-content
          :style="{ margin: '0', padding: '0 24px', background: '#FFF', minHeight: '0' }"
        >
          <router-view />
        </a-layout-content>
      </a-layout>
      <SettingDrawer />
    </a-layout>
  </div>
</template>

<script>
// @ is an alias to /src
import HeaderMenu from '@/components/headerMenu/HeaderMenu'
import SiderMenu from '@/components/menu/SiderMenu.vue'
import SettingDrawer from '@/components/settingDrawer/SettingDrawer.vue'

export default {
  name: 'home',
  data() {
    return {
      collapsed: false,
      companyName: ''
    }
  },
  created() {
    this.companyName = localStorage.getItem('companyName')
  },
  computed: {
    navTheme() {
      return this.$route.query.navTheme || 'dark'
    },
    navLayout() {
      return this.$route.query.navLayout || 'left'
    }
  },
  mounted() {
    this.$router.replace('/permission')
  },
  methods: {
    trigger() {
      this.collapsed = !this.collapsed
    }
  },
  watch: {},
  components: {
    HeaderMenu,
    SiderMenu,
    SettingDrawer
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .ant-layout {
    height: 100%;
  }
  .breadcrumb-list {
    margin: 12px 24px;
  }
}
.trigger {
  font-size: 20px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}
.trigger:hover {
  color: #1890ff;
}
.logo {
  height: 32px;
  // background: rgba(255, 255, 255, 0.2);
  margin: 16px;
  overflow: hidden;
  line-height: 32px;
  text-align: center;
  h1 {
    color: rgba(255, 255, 255, 0.65);
  }
}
.nav-theme-dark /deep/ .logo {
  color: #fff;
}
</style>
