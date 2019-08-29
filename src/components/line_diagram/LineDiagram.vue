<template>
  <div class="line-diagram">
    <ul class="line-wrapper">
      <li
        class="line-list"
        :class="{listFloat: (key + 1) % 10 > 5 ? true : false}"
        v-for="(value, key) of setName"
        :key="key"
      >
        <a-icon
          v-if="isArrow = (key + 1) % 10 > 5 ? true : false"
          class="line-left"
          type="arrow-left"
        />
        <div class="line-item">
          <span>{{ value.name }}</span>
          <a-icon type="close" @click.stop="remove(key)"/>
        </div>
        <a-icon
          v-if="isArrow = ((key + 1) % 10 < 5) && ((key + 1) % 10 > 0) ? true : false"
          class="line-right"
          type="arrow-right"
        />
        <a-icon
          v-if="isArrow = ((key + 1) % 10 === 0) || ((key + 1) % 10 === 5) ? true : false"
          class="line-down"
          type="arrow-down"
        />
      </li>
      <li class="line-add" :class="{listFloat: lsFloat}">
        <a-icon type="plus-circle" @click.stop="showChildrenDrawer"/>
      </li>
    </ul>
    <a-drawer
      :title="false"
      width="300"
      :closable="false"
      @close="onChildrenDrawerClose"
      :visible="childrenDrawer"
    >
      <craft-diagram @setCraftList="setCraftList"/>
      <div
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #E9E9E9',
          padding: '10px 16px',
          background: '#FFF',
          textAlign: 'right',
        }"
      >
        <a-button :style="{marginRight: '8px'}" @click="onChildrenDrawerClose">取消</a-button>
        <a-button type="primary" :style="{marginRight: '8px'}" @click="onChildrenDrawerClose">确定</a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import CraftDiagram from './child_info/CraftDiagram'

export default {
  name: 'LineDiagram',
  data() {
    return {
      childrenDrawer: false,
      setName: [],
      isArrow: false,
      lsFloat: false
    }
  },
  props: {
    childCraftList: {
      type: Array,
      default: []
    }
  },
  methods: {
    // 显示AddTab列表
    showChildrenDrawer() {
      this.childrenDrawer = true
      // 改变icon位置
      if (this.setName.length % 10 > 5) {
        this.listFloat = true
      }
    },
    // 关闭列表抽屉
    onChildrenDrawerClose() {
      this.childrenDrawer = false
    },
    // 移除对应项
    remove(key) {
      this.setName.splice(key, 1)
      if (this.setName) {
        this.$emit('deleteTabList', key)
      }
    },
    setCraftList(val) {
      this.setName.push(val)
      this.$emit('setCraftList', val)
    }
  },
  watch: {
    childCraftList: {
      handler(val) {
        if (val) {
          console.log(val)
          this.setName.push(...val)
        }
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    'craft-diagram': CraftDiagram
  }
}
</script>
<style lang="less" scoped>
.line-diagram {
  .line-wrapper {
    .line-list {
      float: left;
      height: 80px;
      width: 194px;
      position: relative;
      text-align: center;
      .line-item {
        display: inline-block;
        width: 160px;
        height: 32px;
        background: #f8faff;
        border: 1px solid #9d98b6;
        border-radius: 10px;
        font-size: 12px;
        position: relative;
        span {
          width: 120px;
          height: 32px;
          text-align: center;
          display: inline-block;
          line-height: 30px;
          overflow: hidden;
        }
        i {
          font-size: 12px;
          line-height: 34px;
          height: 32px;
          margin-left: 10px;
          position: absolute;
          right: 5px;
        }
      }
      .anticon {
        position: absolute;
      }
      .line-right {
        right: 0;
        top: 10px;
      }
      .line-left {
        left: 0;
        top: 10px;
      }
      .line-down {
        top: 50px;
        right: 50%;
        margin-right: -7px;
      }
    }
    .listFloat {
      float: right;
    }
    .line-add {
      float: left;
      height: 32px;
      width: 196px;
      text-align: center;
      line-height: 30px;
      i {
        font-size: 20px;
        color: #9d98b6;
      }
    }
  }
}
</style>
