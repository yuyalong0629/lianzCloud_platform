<template>
  <div class="bom-info">
    <div
      class="bom-table"
      :class="item.defaultMaterials === true ? 'activeOk' : 'activeNo'"
      v-for="item of data"
      :key="item.key"
      @click="onChangeCheckbox(item)"
    >
      <!-- checked -->
      <div class="bom-icon-checked" v-if="item.defaultMaterials">
        <a-icon class="icon-right" type="check" />
      </div>
      <!-- default -->
      <div class="bom-icon-default">
        <a-button
          v-show="!(childDisabled === false && buttonShow === false) &&type!==1"
          size="small"
          type="danger"
          @click.stop="onDelete(item.key)"
        >删除</a-button>
      </div>
      <!-- Input -->
      <div class="bom-input">
        <h3 v-if="item.inputShow" class="bom-title">{{ item.inputVal }}</h3>
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
      <!-- Table -->
      <a-table :columns="bomColumns" :dataSource="item.dataSource" :pagination="false">
        <template v-for="col in ['dosage']" :slot="col" slot-scope="text, record, index">
          <div :key="col">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="e => onTabChange(e.target.value, record, col, item.key)"
            />
            <template v-else>{{ text }}</template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <div
            class="editable-row-operations"
            v-show="!(childDisabled === false && buttonShow === false)&&type!==1"
          >
            <span v-if="!record.editable">
              <a @click.stop="() => onTabEdit(record, item.key)">编辑</a>
              <a-popconfirm title="确定要删除吗?" @confirm="() => onTabDelete(record, item.key)">
                <a>删除</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click.stop="() => onTabSave(record, item.key)">保存</a>
            </span>
          </div>
        </template>
      </a-table>
      <a-button
        style="width: 100%; margin-top: 16px; margin-bottom: 8px"
        v-show="!(childDisabled === false && buttonShow === false)&&type!==1"
        type="dashed"
        icon="plus"
        @click.stop="onTabAdd(item.key)"
      >添加原材料</a-button>
    </div>
    <!-- Moadl -->
    <a-modal title="选择BOM" :visible="visible" @ok="onModalOk" @cancel="onModalNo">
      <ul class="bom-modal-list">
        <li :class="{modalActive: isModalActive === 0 ? true : false}" @click="onModalInfo(0)">工艺BOM</li>
        <li :class="{modalActive: isModalActive === 1 ? true : false}" @click="onModalInfo(1)">制造BOM</li>
      </ul>
    </a-modal>
    <!-- 抽屉 -->
    <a-drawer
      :destroyOnClose="true"
      :title="false"
      width="300"
      :closable="false"
      @close="onChildrenDrawerClose"
      :visible="childrenDrawer"
    >
      <BomDrawer @acceptChildDrawer="acceptChildDrawer" @bomDrawerData="bomDrawerData" />
    </a-drawer>
    <a-button
      style="width: 100%; margin-top: 16px; margin-bottom: 8px"
      v-show="!(childDisabled === false && buttonShow === false)&&type!==1"
      type="dashed"
      icon="plus"
      @click="handleAdd"
    >添加方案</a-button>
  </div>
</template>
<script>
import { bomColumns } from 'goods/basic_lib/column'
import BomDrawer from './BomDrawer'
import Bus from '@/Bus.js'

export default {
  name: 'BomInfo',
  data() {
    return {
      count: 0,
      bomColumns,
      visible: false,
      isModalActive: 0,
      data: [],
      childrenDrawer: false,
      bomButton: false,
      buttonShow: false,
      type: undefined
    }
  },
  props: {
    materialsGroupInfoData: {
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
    Bus.$off('basicInfo')
    Bus.$off('setBomButton')
  },
  methods: {
    // Modal
    handleAdd() {
      this.visible = true
    },
    // Modal Add
    async onModalOk(e) {
      this.visible = await false
      const { count, data, isModalActive } = this
      const newData = {
        key: count,
        inputVal: this.isModalActive === 0 ? `工艺BOM` : `制造BOM`,
        inputShow: true,
        bomType: isModalActive === 0 ? 'MAKE' : 'CRAFT',
        defaultMaterials: count === 0,
        dataSource: []
      }
      this.data = [...data, newData]
      this.count = count + 1
      // console.log(this.data)
      this.$emit('bomData', this.data)
    },
    // Modal Cancel
    onModalNo(e) {
      this.visible = false
    },
    // Modal Tabs
    onModalInfo(key) {
      this.isModalActive = key
    },
    // 选择BOM
    onChangeCheckbox(records) {
      if (this.type === undefined && !this.childDisabled) {
        return
      }
      const newData = [...this.data]
      newData.forEach(item => {
        if (records.key === item.key) {
          item.defaultMaterials = !item.defaultMaterials
        } else {
          item.defaultMaterials = false
        }
      })
      this.data = [...newData]
      console.log(this.data)
      this.$emit('bomData', this.data)
    },
    // 删除
    onDelete(key) {
      const newData = [...this.data]
      this.data = newData.filter(item => item.key !== key)
      if (!this.data.length) {
        this.count = 0
      }
      // console.log(this.data)
      this.$emit('bomData', this.data)
    },
    // Input
    onInput(key) {
      const newData = [...this.data]
      const target = newData.filter(item => item.key === key)[0]
      // console.log(target)
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
        this.$emit('bomData', this.data)
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
        this.$emit('bomData', this.data)
      }
    },
    // Table
    async onTabAdd(key) {
      this.$router.push({
        query: {
          ...this.$route.query,
          bomIndex: key
        }
      })
      this.childrenDrawer = await true
    },
    onTabChange(value, record, column, key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      const targetData = target.dataSource.filter(
        item => record.key === item.key
      )[0]
      if (targetData) {
        targetData[column] = value
        this.data = [...newData]
        // console.log(this.data)
      }
    },
    onTabSave(record, key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      const targetData = target.dataSource.filter(
        item => record.key === item.key
      )[0]
      if (targetData) {
        targetData.editable = false
        this.data = [...newData]
        // console.log(this.data)
        this.$emit('bomData', this.data)
      }
    },
    onTabDelete(record, key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      target.dataSource = target.dataSource.filter(
        item => record.key !== item.key
      )
      this.data = [...newData]
      // console.log(this.data)
      this.$emit('bomData', this.data)
    },
    onTabEdit(record, key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      const targetData = target.dataSource.filter(
        item => record.key === item.key
      )[0]
      if (targetData) {
        targetData.editable = true
        this.data = [...newData]
        // console.log(this.data)
      }
    },
    // 关闭抽屉
    onChildrenDrawerClose() {
      this.childrenDrawer = false
    },
    // BOM DATA
    bomDrawerData(val) {
      // console.log(val)
      const BomIndex = this.$route.query.bomIndex
      const newData = [...this.data]
      const target = newData.filter(item => item.key === BomIndex)[0]
      if (target) {
        const newVal = {
          // ...val,
          code: val.code,
          name: val.name,
          spec: val.spec,
          unit: val.unit,
          key: val.id,
          gateway: val.gateway === 'BUY' ? '外购' : '自制',
          dosage: 1,
          editable: true
        }
        const dataSource = target.dataSource.filter(
          item => item.key !== newVal.key
        )
        target.dataSource = [...dataSource, newVal]
        this.data = [...newData]
        // console.log(this.data)
        this.$emit('bomData', this.data)
      }
    },
    // 抽屉关闭回调
    acceptChildDrawer(val) {
      this.childrenDrawer = val
    }
  },
  watch: {
    materialsGroupInfoData: {
      handler(val) {
        if (val.length) {
          // console.log(val)
          val.forEach(item => {
            const { count, data, isModalActive } = this
            const newData = {
              ...item,
              key: count,
              inputVal: item.groupName,
              inputShow: true,
              bomType: item.bomType,
              defaultMaterials: item.defaultMaterials,
              id: item.id,
              dataSource: item.skuMaterials.map(cItem => {
                return {
                  id: cItem.id,
                  key: cItem.materialId,
                  code: cItem.materialInfo.code,
                  name: cItem.materialInfo.name,
                  spec: cItem.materialInfo.spec,
                  unit: cItem.materialInfo.unit,
                  dosage: cItem.cost,
                  editable: false,
                  gateway:
                    cItem.materialInfo && cItem.materialInfo.gateway === 'SELF'
                      ? '自制'
                      : '外购'
                }
              })
            }
            this.data = [...data, newData]
            this.count = count + 1
            console.log(this.data)
          })
          this.$emit('bomData', this.data)
        }
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    BomDrawer
  }
}
</script>
<style lang="less" scoped>
.bom-info {
  .activeNo {
    border: 1px solid #d9d9d9;
  }
  .activeOk {
    border: 1px solid #69b412;
  }
  .bom-table {
    // border: 1px solid #69b412;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 5px;
    margin: 10px 0;
    min-height: 50px;
    position: relative;
    .bom-icon-checked {
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
    .bom-icon-default {
      position: absolute;
      top: 8px;
      right: 40px;
      button {
        font-size: 12px;
      }
    }
    .bom-input {
      margin-bottom: 10px;
      .bom-title {
        display: inline-block;
        margin: 0 5px;
      }
    }
    .editable-row-operations a {
      margin-right: 8px;
    }
  }
}
.bom-modal-list {
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
  .modalActive {
    border: 1px solid #1890ff;
  }
}
</style>
