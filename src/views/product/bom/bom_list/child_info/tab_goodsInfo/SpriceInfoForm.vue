<template>
  <div class="sprice-info">
    <a-row :gutter="24">
      <a-col :span="18">
        <a-table bordered :dataSource="dataSource" :columns="columns" :pagination="false">
          <template v-for="(value, col) in dataObj" :slot="col" slot-scope="text, record, index">
            <div :key="col">
              <a-input
                style="margin: -5px 5px; width: 80%;"
                :value="text"
                @change="e => handleChange(e.target.value, record.key, col)"
              />
            </div>
          </template>
        </a-table>
      </a-col>
      <a-col :span="6">
        <a-form-item label="基础报价">
          <a-input :value="spriceInfoBasic" @change="e => handleChangeBasic(e.target.value)" placeholder="基础报价"/>
        </a-form-item>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { setTimeout, clearTimeout } from 'timers'
export default {
  name: 'SpriceInfo',
  data() {
    return {
      timer: null,
      columns: [
        {
          title: '',
          dataIndex: 'name',
          align: 'center'
        }
      ],
      dataSource: [],
      dataObj: {},
      spriceData: []
    }
  },
  props: {
    infoData: {
      type: Object,
      default: {}
    },
    spriceInfoData: {
      type: Array,
      default: []
    },
    craftsInfoData: {
      type: Array,
      default: []
    },
    materialsGroupInfoData: {
      type: Array,
      default: []
    },
    spriceInfoBasic: {
      type: String,
      default: ''
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  methods: {
    handleChange(value, key, column) {
      const reg = /^[0-9]*$/
      if (reg.test(value)) {
        const newData = [...this.dataSource]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          target[column] = value
          this.dataSource = newData
          // console.log(this.dataSource)
          // console.log(this.columns.slice(1, this.columns.length))
          this.spriceData = []
          this.dataSource.forEach(item => {
            this.columns.slice(1, this.columns.length).forEach(cItem => {
              // console.log(cItem)
              this.spriceData.push({
                bomIndex: cItem.id - 1,
                craftIndex: item.key - 1,
                price: item[`plan${cItem.id}`]
              })
            })
          })
          // console.log(this.spriceData)
          this.$emit('spriceData', this.spriceData)
        }
      } else {
        this.$message.error('请输入数字')
      }
    },
    handleChangeBasic(value) {
      // console.log(value)
      const reg = /^[0-9]*$/
      if (reg.test(value)) {
        this.$emit('basicSprice', value)
      } else {
        this.$message.error('请输入数字')
      }
    }
  },
  watch: {
    infoData: {
      handler(val) {
        if (val.craftInfoData.length || val.bomInfoData.length) {
          console.log(val)
          // 初始化
          this.dataSource = []
          this.columns = [
            {
              title: '',
              dataIndex: 'name',
              align: 'center'
            }
          ]
          // 遍历columns
          val.bomInfoData.forEach(item => {
            this.columns.push({
              title: item.inputVal,
              dataIndex: `plan${item.id}`,
              id: item.id,
              align: 'center',
              scopedSlots: { customRender: `plan${item.id}` }
            })
          })
          // console.log(this.columns)
          // 遍历dataIndex
          this.columns.slice(1, this.columns.length).forEach((item, index) => {
            this.dataObj[item.dataIndex] = ''
            this.dataObj['id'] = item.id
          })
          // console.log(this.dataObj)
          // 遍历data
          val.craftInfoData.forEach(item => {
            this.dataSource.push({
              key: item.id,
              name: item.inputVal,
              ...this.dataObj
            })
          })
          // console.log(this.dataSource)
          this.spriceData = []
          this.dataSource.forEach(item => {
            this.columns.slice(1, this.columns.length).forEach(cItem => {
              // console.log(cItem)
              this.spriceData.push({
                bomIndex: cItem.id - 1,
                craftIndex: item.key - 1,
                price: item[`plan${cItem.id}`]
              })
            })
          })
          // console.log(this.spriceData)
          this.$emit('spriceData', this.spriceData)
        }
      },
      deep: true,
      immediate: true
    },
    // column
    craftsInfoData: {
      handler(val) {
        if (val.length) {
          this.$nextTick(() => {
            this.dataSource = []
            val.forEach((item, index) => {
              this.$nextTick(() => {
                this.dataSource.push({
                  key: item.id,
                  name: item.productCraftName,
                  ...this.dataObj
                })
              })
            })
            // console.log(this.dataObj)
            console.log(this.dataSource)
          })
        }
      },
      deep: true,
      immediate: true
    },
    // datasource
    materialsGroupInfoData: {
      handler(val) {
        if (val.length) {
          this.$nextTick(() => {
            this.columns = [
              {
                title: '',
                dataIndex: 'name',
                align: 'center'
              }
            ]
            val.forEach(item => {
              this.columns.push({
                title: item.groupName,
                dataIndex: `plan${item.id}`,
                id: item.id,
                align: 'center',
                scopedSlots: { customRender: `plan${item.id}` }
              })
            })
            this.columns
              .slice(1, this.columns.length)
              .forEach((item, index) => {
                this.dataObj[item.dataIndex] = ''
                this.dataObj['id'] = item.id
              })
          })
        }
      },
      deep: true,
      immediate: true
    },
    spriceInfoData: {
      handler(val) {
        if (val.length) {
          this.timer = setTimeout(() => {
            // console.log(this.dataSource)
            // console.log(this.columns)
            const dataSourceIndex = []
            this.dataSource.forEach((item, index) => {
              // console.log(item)
              const trData = val.filter(cItem => {
                return cItem.craftGroupId === item.key
              })
              dataSourceIndex[index] = [...trData]
              dataSourceIndex[index].forEach((cItem, cIndex) => {
                // console.log(cItem)
                this.columns.forEach(ccItem => {
                  if (cItem.bomGroupId !== ccItem.id) {
                    // this.dataSource[index][`plan${ccItem.id}`] = '0'
                  }
                  if (cItem.bomGroupId === ccItem.id) {
                    this.dataSource[index][`plan${ccItem.id}`] = cItem.price
                  }
                })
                // console.log(indexColumn)
              })
            })
            // console.log(dataSourceIndex)
          }, 100)
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
.sprice-info {
  margin-bottom: 30px;
}
</style>
