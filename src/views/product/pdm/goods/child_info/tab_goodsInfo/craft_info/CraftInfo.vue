<template>
  <div class="craft-info">
    <div
      class="craft-table"
      :class="item.defaultCraft === true ? 'activeOk' : 'activeNo'"
      v-for="item of data"
      :key="item.key"
      @click="onChangeCheckbox(item)"
    >
      <!-- checked -->
      <div class="craft-icon-checked" v-if="item.defaultCraft">
        <a-icon class="icon-right" type="check" />
      </div>
      <!-- default -->
      <div class="craft-icon-default">
        <a-button
          v-show="!(childDisabled === false && buttonShow === false)&&type!==1"
          size="small"
          type="danger"
          @click.stop="onDelete(item.key)"
        >删除</a-button>
      </div>
      <!-- Input -->
      <div class="craft-input">
        <h3 v-if="item.inputShow" class="craft-title">{{ item.inputVal }}</h3>
        <a-icon
          v-if="item.inputShow"
          v-show="!(childDisabled === false && buttonShow === false)&&type!==1"
          type="form"
          @click.stop="onInput(item.key)"
        />
        <a-input
          v-if="!item.inputShow"
          :value="item.inputVal"
          size="small"
          :placeholder="`请输入${item.inputVal}`"
          style="width: 160px; margin-right: 5px;"
          @change="e => onChange(e.target.value, item.key)"
        />
        <a-icon v-if="!item.inputShow" type="file-add" @click.stop="onSave(item.key)" />
      </div>
      <!-- Steps -->
      <a-steps :current="item.dataSource.length" size="small">
        <a-step v-for="(cItem,index) in item.dataSource" :key="index" :title="cItem.name">
          <a-icon
            class="step-icon"
            type="close-circle"
            slot="icon"
            v-show="childDisabled"
            @click="onStepDelete(item.key, cItem.id)"
          />
        </a-step>
      </a-steps>
      <a-button
        style="width: 100%; margin-top: 16px; margin-bottom: 8px"
        v-show="!(childDisabled === false && buttonShow === false)&&type!==1"
        type="dashed"
        icon="plus"
        @click.stop="onTabAdd(item.key)"
      >选择工艺流程</a-button>
    </div>
    <!-- 抽屉 -->
    <a-drawer
      :destroyOnClose="true"
      :title="false"
      width="300"
      :closable="false"
      @close="onChildrenDrawerClose"
      :visible="childrenDrawer"
    >
      <craft-drawer @acceptChildDrawer="acceptChildDrawer" @craftDrawerData="craftDrawerData" />
    </a-drawer>
    <a-button
      style="width: 100%; margin-top: 16px; margin-bottom: 8px"
      v-show="!(childDisabled === false && buttonShow === false)&&type!==1"
      type="dashed"
      icon="plus"
      @click="handleAdd"
    >添加工艺</a-button>
  </div>
</template>
<script>
import Bus from '@/Bus.js'
import { bomColumns } from 'goods/basic_lib/column'
import CraftDrawer from './CraftDrawer'
import { craftLineInfo } from './index'

export default {
  name: 'CraftInfo',
  data() {
    return {
      count: 0,
      bomColumns,
      data: [],
      childrenDrawer: false,
      bomButton: false,
      getList: [],
      newData: [],
      buttonShow: false,
      type: undefined
    }
  },
  props: {
    craftsInfoData: {
      type: Array,
      default: [],
      required: false
    },
    childDisabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  mounted() {
    Bus.$on('setBomButton', val => {
      this.buttonShow = val
    })
    Bus.$on('basicInfo', val => {
      this.type = val.type
    })
  },
  destroyed() {
    Bus.$off('setBomButton')
    Bus.$off('basicInfo')
  },
  methods: {
    // Modal
    handleAdd() {
      const { count, data } = this
      const newData = {
        key: count,
        inputVal: `工艺${count + 1}`,
        inputShow: true,
        productCraftCode: '',
        productCraftId: '',
        defaultCraft: count === 0,
        dataSource: []
      }
      this.data = [...data, newData]
      this.count = count + 1
      // console.log(this.data)
      this.$emit('craftData', this.data)
    },
    // 选择BOM
    onChangeCheckbox(records) {
      if (this.type === undefined && !this.childDisabled) {
        return
      }
      const newData = [...this.data]
      newData.forEach(item => {
        if (records.key === item.key) {
          item.defaultCraft = !item.defaultCraft
        } else {
          item.defaultCraft = false
        }
      })
      this.data = [...newData]
      this.$emit('craftData', this.data)
    },
    // 删除
    onDelete(key) {
      const newData = [...this.data]
      this.data = newData.filter(item => item.key !== key)
      // console.log(this.data)
      this.$emit('craftData', this.data)
      if (!this.data.length) {
        this.count = 0
      }
      // console.log(this.data)
    },
    // Input
    onInput(key) {
      const newData = [...this.data]
      const target = newData.filter(item => item.key === key)[0]
      if (target) {
        target.inputShow = false
        this.data = [...newData]
        // console.log(this.data)
      }
    },
    onChange(value, key) {
      const newData = [...this.data]
      const target = newData.filter(item => item.key === key)[0]
      if (target) {
        target.inputVal = value
        this.data = [...newData]
        this.$emit('craftData', this.data)
      }
    },
    // Save
    onSave(key) {
      const newData = [...this.data]
      const target = newData.filter(item => item.key === key)[0]
      // console.log(target)
      if (target) {
        target.inputShow = true
        this.data = [...newData]
        // console.log(this.data)
        this.$emit('craftData', this.data)
      }
    },
    // Table
    async onTabAdd(key) {
      this.$router.push({
        query: {
          ...this.$route.query,
          craftIndex: key
        }
      })
      this.childrenDrawer = await true
    },
    // 关闭抽屉
    onChildrenDrawerClose() {
      this.childrenDrawer = false
    },
    // 抽屉关闭回调
    acceptChildDrawer(val) {
      this.childrenDrawer = val
    },
    // Step 删除
    onStepDelete(key, id) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target.dataSource = target.dataSource.filter(item => item.id !== id)
        this.data = [...newData]
        // console.log(this.data)
      }
    },
    // drawer data
    craftDrawerData(val) {
      if (val.list.length) {
        // console.log(val.name)
        const newData = [...this.data]
        const craftIndex = this.$route.query.craftIndex
        const target = newData.filter(item => item.key === craftIndex)[0]
        if (target) {
          target.dataSource = [...val.list]
          target.inputVal = val.record.name
          target.productCraftCode = val.record.code
          target.productCraftId = val.record.key
          this.data = [...newData]
          // console.log(this.data)
          this.$emit('craftData', this.data)
        }
      }
    }
  },
  watch: {
    craftsInfoData: {
      handler(val) {
        if (val.length) {
          // console.log(val)
          for (let i = 0; i < val.length; i++) {
            craftLineInfo
              .call(this, val[i].productCraftId)
              .then(() => {
                const { count, data } = this
                const newData = {
                  ...val[i],
                  key: val[i].sort,
                  inputVal: val[i].productCraftName,
                  inputShow: true,
                  id: val[i].id,
                  productCraftCode: val[i].productCraftCode,
                  productCraftId: val[i].productCraftId,
                  defaultCraft: val[i].defaultCraft,
                  dataSource: [...this.getList]
                }
                this.data = [...data, newData]
                // console.log(this.data)
                this.count = val[i].sort + 1
              })
              .then(() => {
                this.$emit('craftData', this.data)
              })
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    'craft-drawer': CraftDrawer
  }
}
</script>
<style lang="less" scoped>
.craft-info {
  .activeNo {
    border: 1px solid #d9d9d9;
  }
  .activeOk {
    border: 1px solid #69b412;
  }
  .craft-table {
    // border: 1px solid #69b412;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 5px;
    margin: 10px 0;
    min-height: 50px;
    position: relative;
    .ant-steps {
      overflow-x: scroll;
      /deep/ .ant-steps-item-icon {
        .ant-steps-icon {
          color: #f00;
          font-size: 16px;
        }
      }
      .ant-steps-item {
        flex: none;
        padding: 5px 10px 20px 10px;
        &:last-child {
          min-width: 30px;
          padding-right: 0px;
        }
        /deep/ .ant-steps-item-content {
          padding-right: 50px;
        }
      }
    }
    .craft-icon-checked {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 0;
      height: 30px;
      width: 30px;
      border-left: 30px solid transparent;
      border-top: 30px solid #69b412;
      .icon-right {
        color: #fff;
        position: absolute;
        right: 2px;
        top: -28px;
        z-index: 10;
      }
    }
    .craft-icon-default {
      position: absolute;
      top: 8px;
      right: 40px;
      button {
        font-size: 12px;
      }
    }
    .craft-input {
      margin-bottom: 10px;
      .craft-title {
        display: inline-block;
        margin: 0 5px;
      }
    }
    .editable-row-operations a {
      margin-right: 8px;
    }
  }
}
.craft-modal-list {
  text-align: center;
  li {
    display: inline-block;
    width: 100px;
    height: 60px;
    margin: 0 10px;
    border: 1px solid #d9d9d9;
    line-height: 60px;
    text-align: center;
    border-radius: 4px;
    box-sizing: border-box;
    cursor: pointer;
  }
}
</style>
