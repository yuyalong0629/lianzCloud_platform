<template>
  <div class="setting-drawer">
    <a-drawer placement="right" :closable="false" @close="onClose" :visible="visible" width="300px">
      <div class="setting-drawer-index-handle" @click="toggle" :style="backgroundColor">
        <a-icon type="setting" v-if="!visible"/>
        <a-icon type="close" v-else/>
      </div>

      <div class="setting-drawer-index-content">
        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">整体风格设置</h3>

          <div class="setting-drawer-index-blockChecbox">
            <a-tooltip>
              <template slot="title">暗色菜单风格</template>
              <div class="setting-drawer-index-item" @click="handleSettingChange('dark')">
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/LCkqqYNmvBEbokSDscrm.svg"
                  alt="dark"
                >
                <div
                  class="setting-drawer-index-selectIcon"
                  v-if="$route.query.navTheme !== 'light'"
                >
                  <a-icon type="check"/>
                </div>
              </div>
            </a-tooltip>

            <a-tooltip>
              <template slot="title">亮色菜单风格</template>
              <div class="setting-drawer-index-item" @click="handleSettingChange('light')">
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/jpRkZQMyYRryryPNtyIC.svg"
                  alt="light"
                >
                <div
                  class="setting-drawer-index-selectIcon"
                  v-if="$route.query.navTheme === 'light'"
                >
                  <a-icon type="check"/>
                </div>
              </div>
            </a-tooltip>
          </div>
        </div>

        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">主题色</h3>

          <div style="height: 20px">
            <a-tooltip
              class="setting-drawer-theme-color-colorBlock"
              v-for="(item, index) in colorList"
              :key="index"
            >
              <template slot="title">{{ item.key }}</template>
              <a-tag :color="item.color" @click="changeColor(item.color)">
                <a-icon type="check" v-if="item.color === baseConfig.primaryColor"></a-icon>
              </a-tag>
            </a-tooltip>
          </div>
        </div>
        <a-divider/>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import { colorList, config, updateTheme } from './setting.js'
import { Promise } from 'q'

export default {
  data() {
    return {
      visible: true,
      colorList,
      baseConfig: Object.assign({}, config),
      backgroundColor: {}
    }
  },
  mounted() {
    setTimeout(() => {
      this.visible = false
    }, 16)
  },
  methods: {
    onClose() {
      this.visible = false
    },
    toggle() {
      this.visible = !this.visible
    },
    handleSettingChange(value) {
      console.log(value)
      this.$router.push({ query: { ...this.$route.query, navTheme: value } })
    },
    changeColor(color) {
      this.baseConfig.primaryColor = color
      updateTheme(color)
      this.backgroundColor.background = color
    }
  }
}
</script>
<style lang="less" scoped>
@import '~ant-design-vue/lib/style/themes/default.less';

.setting-drawer-index-blockChecbox {
  display: flex;
  .setting-drawer-index-item {
    margin-right: 16px;
    position: relative;
    border-radius: 4px;
    cursor: pointer;
    img {
      width: 48px;
    }
    .setting-drawer-index-selectIcon {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      padding-top: 15px;
      padding-left: 24px;
      height: 100%;
      color: #1890ff;
      font-size: 14px;
      font-weight: 700;
    }
  }
}
.setting-drawer-theme-color-colorBlock {
  width: 20px;
  height: 20px;
  border-radius: 2px;
  float: left;
  cursor: pointer;
  margin-right: 8px;
  padding-left: 0px;
  padding-right: 0px;
  text-align: center;
  color: #fff;
  font-weight: 700;
  i {
    font-size: 14px;
  }
}
.setting-drawer-index-handle {
  position: absolute;
  top: 240px;
  // background: @primary-color;
  background: #1890ff;
  width: 48px;
  height: 48px;
  right: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
  z-index: 1001;
  text-align: center;
  font-size: 16px;
  border-radius: 4px 0 0 4px;
  i {
    color: rgb(255, 255, 255);
    font-size: 20px;
  }
}
</style>
