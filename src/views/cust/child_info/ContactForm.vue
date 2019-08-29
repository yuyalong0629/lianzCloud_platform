<template>
  <div class="concat-form">
    <a-table :columns="columns" :dataSource="data" :pagination="false">
      <template
        v-for="col in ['name', 'sex', 'phone', 'companyPosition', 'email', 'contact']"
        :slot="col"
        slot-scope="text, record, index"
      >
        <div :key="col">
          <a-input
            v-if="record.editable && col !== 'sex'"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <a-select
            v-if="record.editable && col === 'sex'"
            :value="record.sex"
            style="width: 80px"
            @change="(value) => handleChangeSelect(value, record.key, col)"
          >
            <a-select-option value="0">男</a-select-option>
            <a-select-option value="1">女</a-select-option>
          </a-select>
          <template>
            <span v-if="!record.editable && col !== 'sex'">{{ text }}</span>
            <span v-if="!record.editable && col === 'sex'">{{ text === '0' ? '男' : '女' }}</span>
          </template>
        </div>
      </template>
      <template v-if="childDisabled" slot="operation" slot-scope="text, record, index">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.key)">保存</a>
            <a @click="() => cancel(record.key)">取消</a>
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
import { columns } from '../basic_lib/column'

export default {
  name: 'ConcatForm',
  data() {
    return {
      data: [],
      columns,
      count: 0,
      cacheData: []
    }
  },
  props: {
    mallUsersInfo: {
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
    handleAdd() {
      const { count, data } = this
      const newData = {
        key: count,
        name: '',
        sex: '0',
        phone: '',
        companyPosition: '',
        email: '',
        contact: '',
        deleted: false,
        editable: true
      }
      this.data = [...data, newData]
      this.count = count + 1
      // // 保存初始化Obj
      // this.cacheData = this.data.map(item => ({ ...item }))
    },
    handleChangeSelect(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
        this.$emit('userNatureDtos', this.data)
      }
      this.data = [...newData]
      console.log(this.data)
    },
    onDelete(key) {
      const dataSource = [...this.data]
      this.data = dataSource.filter(item => item.key !== key)
      this.$emit('userNatureDtos', this.data)
    },
    handleChange(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    edit(key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    save(key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target && target.name && target.phone) {
        target.editable = false
        this.data = newData
        this.cacheData = newData.map(item => ({ ...item }))
        this.$emit('userNatureDtos', this.data)
      } else {
        this.$message.error('请先完善信息')
      }
    },
    cancel(key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      const targetData = this.cacheData.filter(item => key === item.key)[0]
      if (target && target.name && target.phone && targetData) {
        Object.assign(
          target,
          this.cacheData.filter(item => key === item.key)[0]
        )
        target.editable = false
        this.data = newData
        console.log(this.data)
      } else {
        this.data = newData.filter(item => item.key !== key)
        console.log(this.data)
      }
    }
  },
  watch: {
    mallUsersInfo: {
      handler(val) {
        if (val.length) {
          const { count, data } = this
          val.forEach((item, index) => {
            this.data[index] = {
              key: index,
              name: item.name,
              sex: item.sex === 'MALE' ? '0' : '1',
              phone: item.phone,
              companyPosition: item.companyPosition || '无',
              email: item.email || '无',
              contact: item.contact || '无',
              custId: item.custId,
              id: item.id,
              deleted: false,
              editable: false
            }
            this.count = index + 1
          })
          // 保存初始化Obj
          this.cacheData = this.data.map(item => ({
            ...item
          }))
          console.log(this.cacheData)
          this.$emit('userNatureDtos', this.data)
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
