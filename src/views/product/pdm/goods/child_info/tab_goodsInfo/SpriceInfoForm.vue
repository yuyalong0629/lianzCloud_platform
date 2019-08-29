<template>
  <div class="sprice-info">
    <a-row :gutter="24">
      <a-col :span="18">
        <a-table bordered :dataSource="dataSource" :columns="columns" :pagination="false">
          <template v-for="(value, col) in dataObj" :slot="col" slot-scope="text, record, index">
            <div :key="col">
              <a-input
                style="margin: -5px 5px; width: 80%;"
                :disabled="(childDisabled === false && bomButton === false) ? true : false"
                :value="text"
                placeholder="请输入价格"
                @change="e => handleChangeInput(e.target.value, record.key, col)"
              />
            </div>
          </template>
        </a-table>
      </a-col>
      <a-col :span="6">
        <a-form-item label="基础报价">
          <a-input
            :value="basicSprice"
            :disabled="(childDisabled === false && bomButton === false) ? true : false"
            @change="e => handleChangeBasic(e.target.value)"
            placeholder="基础报价"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { setTimeout, clearTimeout } from 'timers'
import Bus from '@/Bus.js'

export default {
  name: 'SpriceInfo',
  data() {
    return {
      timer: null,
      columns: [],
      dataSource: [],
      dataObj: {},
      spriceData: [],
      basicSprice: undefined,
      bomButton: false
    }
  },
  props: {
    crafts: {
      type: Array,
      default: [],
      required: false
    },
    materialsGroup: {
      type: Array,
      default: [],
      required: false
    },
    spriceInfoBasic: {
      type: String,
      default: '',
      required: false
    },
    spriceInfoData: {
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
    Bus.$on('bomSub', val => {
      this.bomButton = val
      console.log(this.bomButton)
    })
  },
  beforeDestroy() {
    Bus.$off('bomSub')
    clearTimeout(this.timer)
  },
  methods: {
    handleChangeInput(value, key, column) {
      const reg = /^[0-9]*$/
      if (reg.test(value)) {
        const newData = [...this.dataSource]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          target[column] = value
          this.dataSource = [...newData]
          this.setSpriceData()
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
        this.basicSprice = value
        this.$emit('basicSprice', this.basicSprice)
      } else {
        this.$message.error('请输入数字')
      }
    },
    // 工艺Tab
    async craft(val) {
      this.dataSource = []
      const newColumns = [...this.columns]
      val.forEach((item, index) => {
        newColumns.forEach((cItem, cIndex) => {
          if (cIndex === 0) {
            this.dataObj['craft'] = item.inputVal
          } else {
            this.dataObj[cItem.dataIndex] = '0'
          }
        })
        this.dataSource[index] = {
          key: item.key,
          ...this.dataObj
        }
      })
      this.columns = [...newColumns]
      // console.log(this.columns)
      // console.log(this.dataSource)
    },
    // Bom Tab
    async bomColumn(val) {
      const newDataSource = [...this.dataSource]
      // console.log(this.dataSource)
      const firstColumns = [
        {
          title: '',
          dataIndex: 'craft'
        }
      ]
      const otherColumns = val.map((item, index) => {
        return {
          title: item.inputVal,
          dataIndex: `plan${item.key}`,
          id: item.key,
          scopedSlots: { customRender: `plan${item.key}` }
        }
      })
      this.columns = [...firstColumns, ...otherColumns]
      this.dataSource = [...newDataSource]
      // console.log(this.columns)
      // console.log(this.dataSource)
    },
    // TabInfo
    async setSpriceData() {
      this.spriceData = []
      this.dataSource.forEach(item => {
        this.columns.slice(1, this.columns.length).forEach(cItem => {
          this.spriceData.push({
            craftIndex: item.key,
            bomIndex: cItem.id,
            price: item[`plan${cItem.id}`]
          })
        })
      })
    }
  },
  watch: {
    crafts: {
      handler(val) {
        console.log(val)
        this.craftDataSource = val
        this.craft(this.craftDataSource).then(() => {
          this.setSpriceData().then(() => {
            this.$emit('spriceData', this.spriceData)
          })
        })
      },
      deep: true,
      immediate: true
    },
    materialsGroup: {
      handler(val) {
        // console.log(val)
        this.bomColumn(val).then(() => {
          this.craft(this.craftDataSource)
          this.setSpriceData().then(() => {
            this.$emit('spriceData', this.spriceData)
          })
        })
      },
      deep: true,
      immediate: true
    },
    spriceInfoData: {
      handler(val) {
        if (val.length) {
          console.log(val)
          setTimeout(() => {
            const newData = [...this.dataSource]
            console.log(newData)
            val.forEach((item, index) => {
              const target = newData.filter(
                cItem => item.craftIndex === cItem.key
              )[0]
              target[`plan${item.bomIndex}`] = item.price + ''
              this.dataSource = [...newData]
            })
            console.log(
              val.map(item => {
                return {
                  craftIndex: item.craftIndex,
                  bomIndex: item.bomIndex,
                  price: item.price
                }
              })
            )
            this.$emit(
              'spriceData',
              val.map(item => {
                return {
                  craftIndex: item.craftIndex,
                  bomIndex: item.bomIndex,
                  price: item.price
                }
              })
            )
          }, 1500)
        }
      },
      deep: true,
      immediate: true
    },
    spriceInfoBasic: {
      handler(val) {
        this.basicSprice = val
        this.$emit('basicSprice', this.basicSprice)
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
