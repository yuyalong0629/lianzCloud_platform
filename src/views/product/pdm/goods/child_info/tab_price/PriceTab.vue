<template>
  <div>
    <a-row :gutter="24">
      <a-col :span="24">
        <h3 class="categoryInfo-title">价目表</h3>
      </a-col>
      <a-col :span="24">
        <!-- {{test}} -->
        <a-table bordered :dataSource="dataSource" :columns="columns" :pagination="false">
          <template v-for="(value, col) in dataObj" :slot="col" slot-scope="text, record, index">
            <div :key="col">
              <a-input
                style="margin: -5px 5px; width: 80%;"
                :value="text"
                placeholder="请输入价格"
                @change="e => handleChangeInput(e.target.value, record.key, col)"
              />
            </div>
          </template>
        </a-table>
      </a-col>
      <a-col :span="24">
        <h3 class="categoryInfo-title">基础报价</h3>
      </a-col>
      <a-col :span="24">
        <a-form-item>
          <a-input
            :value="basicSprice"
            @change="e => handleChangeBasic(e.target.value)"
            placeholder="基础报价"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import Bus from '@/Bus.js'
import { getBomAndCraftPrices } from '../../basic_lib/index'
import { setTimeout } from 'timers'

export default {
  name: 'PriceTab',
  data() {
    return {
      dataSource: [],
      columns: [
        {
          title: '',
          dataIndex: 'bom'
        }
      ],
      dataObj: {},
      spriceData: [],
      basicSprice: undefined
    }
  },
  props: {
    skuId: {
      type: String,
      default: '',
      required: false
    }
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
          if (this.spriceData) {
            console.log(this.spriceData)
            console.log(this.dataSource)
            this.spriceData.forEach(item => {
              const targetData = this.dataSource.filter(
                cItem => item.craftGroupId === cItem.craftGroupId
              )[0]
              // console.log(targetData)
              if (targetData) {
                item.price = targetData[`bom_${item.bomGroupId}`]
              }
            })
          } else {
            this.setSpriceData().then(() => {
              this.$emit('spriceData', this.spriceData)
            })
          }
          console.log(this.spriceData)
        }
      } else {
        this.$message.error('请输入数字')
      }
    },
    handleChangeBasic(value) {
      const reg = /^[0-9]*$/
      if (reg.test(value)) {
        this.basicSprice = value
        this.$emit('basicSprice', this.basicSprice)
      } else {
        this.$message.error('请输入数字')
      }
    },
    async setSpriceData() {
      this.spriceData = []
      this.dataSource.forEach(item => {
        this.columns.slice(1, this.columns.length).forEach(cItem => {
          this.spriceData.push({
            bomGroupId: cItem.bomGroupId,
            bomGroupName: cItem.title,
            craftGroupId: item.craftGroupId,
            craftName: item['bom'],
            price: item[`bom_${cItem.bomGroupId}`]
          })
        })
      })
    }
  },
  watch: {
    skuId: {
      handler(val) {
        if (val) {
          console.log(val)
          getBomAndCraftPrices(this.skuId).then(res => {
            if (res.data.code === 0) {
              if (res.data.data.boms) {
                const firstColumns = [
                  {
                    title: '',
                    dataIndex: 'bom'
                  }
                ]
                const otherColumns = res.data.data.boms.map(item => {
                  return {
                    title: item.groupName,
                    dataIndex: `bom_${item.id}`,
                    id: item.sort,
                    bomGroupId: item.id,
                    align: 'center',
                    scopedSlots: { customRender: `bom_${item.id}` }
                  }
                })
                this.columns = [...firstColumns, ...otherColumns]
              }

              if (res.data.data.crafts) {
                const newColumns = [...this.columns]
                const newDataSource = [...this.dataSource]
                res.data.data.crafts.forEach((item, index) => {
                  newColumns.forEach((cItem, cIndex) => {
                    if (cIndex === 0) {
                      this.dataObj = {
                        bom: item.productCraftName
                      }
                    } else {
                      this.$set(this.dataObj, cItem.dataIndex, '0')
                    }
                  })
                  this.dataSource[index] = {
                    key: item.id,
                    craftGroupId: item.id,
                    ...this.dataObj
                  }
                })
                this.columns = [...newColumns]

                this.setSpriceData().then(() => {
                  this.$emit('spriceData', this.spriceData)
                })

                console.log(this.columns)
                console.log(this.dataObj)
                console.log(this.dataSource)
              }

              if (res.data.data.prices) {
                const newSpriceData = [...this.spriceData]
                const newDataSource = [...this.dataSource]
                res.data.data.prices.forEach((item, index) => {
                  const targetPrice = newSpriceData.filter(
                    cItem =>
                      item.craftGroupId === cItem.craftGroupId &&
                      item.bomGroupId === cItem.bomGroupId
                  )[0]
                  if (targetPrice) {
                    targetPrice[`price`] = item.price + ''
                    targetPrice[`id`] = item.id
                    targetPrice[`storeCount`] = item.storeCount
                  }

                  const targetDataSource = newDataSource.filter(
                    cItem => item.craftGroupId === cItem.craftGroupId
                  )[0]
                  if (targetDataSource) {
                    targetDataSource[`bom_${item.bomGroupId}`] = item.price + ''
                  }
                })
                this.spriceData = [...newSpriceData]
                this.dataSource = [...newDataSource]
                // console.log(this.spriceData)
                console.log(this.dataSource)

                this.$emit('spriceData', this.spriceData)
                console.log(this.spriceData)
              }

              if (res.data.data.basePrice) {
                this.basicSprice = res.data.data.basePrice
                this.$emit('basicSprice', this.basicSprice)
              }
            }
          })
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
@import '~styles/variable.less';

.categoryInfo-title {
  margin: 15px 0;
  .h3_title();
}
</style>
