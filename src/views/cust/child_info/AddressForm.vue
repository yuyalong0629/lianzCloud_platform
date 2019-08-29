<template>
  <div class="address-form">
    <a-table :columns="columnAddress" :dataSource="data" :pagination="false" :scroll="{ x: 1240 }">
      <template
        v-for="col in ['receiver', 'phone', 'address', 'detailAddr', 'defaultGoodsAddr', 'postCode']"
        :slot="col"
        slot-scope="text, record, index"
      >
        <div :key="col">
          <a-input
            v-if="record.editable && col !== 'address' && col !== 'defaultGoodsAddr'"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <a-cascader
            v-if="record.editable && col === 'address'"
            :defaultValue="staging[record.key]"
            changeOnSelect
            placeholder="请选择地址"
            @change="(value, selectedOptions) => handleChangeArea(value, selectedOptions, record, col)"
            style="width: 200px;"
            :fieldNames="{ label: 'name', value: 'id', children: 'childrens' }"
            :options="options"
          ></a-cascader>
          <a-switch
            v-if="record.editable && col === 'defaultGoodsAddr'"
            checkedChildren="是"
            unCheckedChildren="否"
            :checked="record.defaultGoodsAddr"
            @change="(value) => handleChangeSwitch(value, record, col)"
          />
          <template>
            <span
              v-if="!record.editable && col !== 'address' && col !== 'defaultGoodsAddr'"
            >{{ text }}</span>
            <span v-if="!record.editable && col === 'address'">{{ text ? text.join('/') : '' }}</span>
            <span
              v-if="!record.editable && col === 'defaultGoodsAddr'"
            >{{ text === true ? '是' : '否' }}</span>
          </template>
        </div>
      </template>
      <template v-if="childDisabled" slot="operation" slot-scope="text, record, index">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.key)">保存</a>
            <!-- <a @click="() => cancel(record.key)">取消</a> -->
          </span>
          <span v-else>
            <a @click="() => edit(record.key)">编辑</a>
            <a-popconfirm title="确定删除吗?" @confirm="() => onDelete(record.key)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </div>
      </template>
    </a-table>
    <a-button
      style="width: 100%; margin-top: 16px; margin-bottom: 8px"
      v-if="childDisabled"
      type="dashed"
      icon="plus"
      @click.stop="handleAdd"
    >添加联系人</a-button>
  </div>
</template>
<script>
import { columnAddress } from '../basic_lib/column'
import { areas } from 'utils/area.js'
import { findParentId } from '@/assets/utils/utils.js'

export default {
  name: 'AddressForm',
  data() {
    return {
      data: [],
      columnAddress,
      count: 0,
      cacheData: [],
      options: areas,
      addressId: [],
      // 暂存
      staging: []
    }
  },
  props: {
    addressInfo: {
      type: Array,
      default: []
    },
    childDisabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  methods: {
    handleChangeArea(value, selectedOptions, record, column) {
      const newData = [...this.data]
      const addressName = selectedOptions
        ? selectedOptions.map(item => item.name)
        : []
      console.log(addressName)
      const target = newData.filter(item => record.key === item.key)[0]
      if (target) {
        target[column] = addressName
        this.data = newData
        console.log(this.data)
        this.staging[record.key] = selectedOptions
          ? selectedOptions.map(item => item.id)
          : []
        console.log(this.staging)
        console.log(record.key)
      }
    },
    handleChangeSwitch(value, record, column) {
      const newData = [...this.data]
      const target = newData.map(item => {
        return {
          ...item,
          defaultGoodsAddr: item.key === record.key ? value : false
        }
      })
      this.data = [...target]
      // console.log(this.data)
    },
    handleChange(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    handleAdd() {
      const { count, data } = this
      // this.staging[count] = []
      console.log(this.staging)
      const newData = {
        key: count,
        receiver: '',
        phone: '',
        address: [],
        detailAddr: '',
        deleted: false,
        defaultGoodsAddr: false,
        postCode: '',
        editable: true
      }
      this.data = [...data, newData]
      this.count = count + 1
      // 保存初始化Obj
      // this.cacheData = this.data.map(item => ({ ...item }))
      console.log(this.data)
    },
    onDelete(key) {
      const newData = [...this.data]
      this.data = newData.filter(item => item.key !== key)
      const customerAddrList = []
      this.data.slice(0).forEach((item, index) => {
        customerAddrList[index] = {
          ...item,
          province: this.staging[index][0],
          city: this.staging[index][1],
          area: this.staging[index][2]
        }
      })
      console.log(customerAddrList)
      this.$emit('custAddrList', customerAddrList)
    },
    edit(key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target.editable = true
        this.addressId = this.staging[key]
        this.data = newData
        console.log(this.data)
        console.log(this.staging)
      }
    },
    save(key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      // if (target && target.address.length && target.receiver && target.phone) {
      if (target) {
        target.editable = false
        this.data = newData
        this.cacheData = newData.map(item => ({ ...item }))
        console.log(this.data)
        // 阻止引用类型指向同一个堆内存
        const customerAddrList = []
        console.log(this.staging)
        this.data.concat([]).forEach((item, index) => {
          // if (item.staging[index].length) {
          customerAddrList[index] = {
            ...item,
            province: this.staging[index] ? this.staging[index][0] : '',
            city: this.staging[index] ? this.staging[index][1] : '',
            area: this.staging[index] ? this.staging[index][2] : ''
          }
          // }
        })
        console.log(customerAddrList)
        this.$emit('custAddrList', customerAddrList)
      } else {
        this.$message.error('请先完善信息')
      }
    },
    cancel(key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      const targetData = this.cacheData.filter(item => key === item.key)[0]
      console.log(targetData)
      if (
        target &&
        target.address.length &&
        target.receiver &&
        target.phone &&
        targetData
      ) {
        Object.assign(
          target,
          this.cacheData.filter(item => key === item.key)[0]
        )
        target.editable = false
        this.data = newData
      } else {
        this.data = newData.filter(item => item.key !== key)
      }
    }
  },
  watch: {
    addressInfo: {
      handler(val) {
        if (val.length) {
          console.log(val)
          val.forEach((item, index) => {
            this.staging[index] =
              findParentId(
                item.area ? item.area : item.city ? item.city : item.province,
                this.options,
                'id'
              ) || []
            console.log(this.staging)
            this.data[index] = {
              key: index,
              receiver: item.receiver || '无',
              phone: item.phone || '无',
              address:
                findParentId(
                  item.area ? item.area : item.city ? item.city : item.province,
                  this.options,
                  'name'
                ) || undefined,
              detailAddr: item.detailAddr || '无',
              defaultGoodsAddr: item.defaultGoodsAddr,
              postCode: item.postCode || '无',
              id: item.id,
              custId: item.custId,
              deleted: false,
              editable: false
            }
            this.count = index + 1
          })
          console.log(this.data)
          // 保存初始化Obj
          this.cacheData = this.data.map(item => ({ ...item }))
          console.log(this.cacheData)
          // 阻止引用类型指向同一个堆内存
          const customerAddrList = []
          this.data.concat([]).forEach((item, index) => {
            if (item.address) {
              customerAddrList[index] = {
                ...item
              }
            }
          })
          // console.log(customerAddrList)
          this.$emit('custAddrList', customerAddrList)
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    getAddress() {
      return findParentId(this.custFormInfo.custArea, this.options, 'name')
    }
  }
}
</script>
<style lang="less" scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
