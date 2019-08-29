<template>
  <a-row>
    <a-form-item label="交期" :label-col="{ span: 5 }" :wrapper-col="{span:16}" class="mb">
      <a-date-picker
        v-if="date"
        format="YYYY-MM-DD"
        :value="moment(date, 'YYYY-MM-DD ')"
        style="width:170px;"
        @change="updateTime"
      />
      <a-date-picker v-else format="YYYY-MM-DD" style="width:170px;" @change="updateTime" />
    </a-form-item>
    <a-form-item label="数量" :label-col="{ span: 5 }" :wrapper-col="{span:16}" class="mb">
      <a-input-number :min="1" :max="checkItem.odNumber" v-model="num" style="width:170px;" />
    </a-form-item>
    <a-form-item label="报价" :label-col="{ span: 5 }" :wrapper-col="{span:16}" class="mb">
      <a-input-number :min="0" v-model="odUnitPrice" addonAfter="元" style="width:170px;" />
    </a-form-item>
    <a-form-item label="总价" :label-col="{ span: 5 }" :wrapper-col="{span:16}" class="mb">
      <a-input-number :min="0" v-model="odTotalPrice" addonAfter="元" style="width:170px;" />
    </a-form-item>
    <a-form-item class="mb">
      <a-button @click="updataBom">选择BOM</a-button>
    </a-form-item>
    <a-form-item class="mb" v-show="deleteShow">
      <a-button type="danger" @click="removeItem">移除</a-button>
    </a-form-item>
    <a-form-item class="mb">
      <a-button type="primary" @click="addCompany">确定</a-button>
    </a-form-item>
  </a-row>
</template>

<script>
import moment from 'moment'
export default {
  props: ['checkItem', 'deleteShow'],
  data() {
    return {
      num: this.checkItem.odNumber,
      date: this.checkItem.odPromiseDueDate,
      odUnitPrice: null,
      odTotalPrice: null
    }
  },
  watch: {
    num() {
      this.odTotalPrice = Number((Number(this.num) * Number(this.odUnitPrice)).toString().match(/^\d+(?:\.\d{0,2})?/))
    },
    odUnitPrice() {
      this.odTotalPrice = Number((Number(this.num) * Number(this.odUnitPrice)).toString().match(/^\d+(?:\.\d{0,2})?/))
    }
  },
  created() {
    console.log(this.checkItem)
    console.log(this.num)
  },
  methods: {
    moment,
    removeItem() {
      const data = {}
      data.id = this.checkItem.id
      data.index = this.checkItem.index
      this.$emit('remove', data)
      this.clearInput()
    },
    addCompany() {
      const data = {}
      data.num = this.num
      data.date = this.date
      data.id = this.checkItem.id
      data.index = this.checkItem.index
      data.odUnitPrice = this.odUnitPrice
      data.odTotalPrice = this.odTotalPrice
      this.$emit('addLittle', data)
      this.clearInput()
    },
    clearInput() {
      this.odUnitPrice = null
      this.odTotalPrice = null
    },
    updateTime(dates, dateStrings) {
      this.date = dateStrings
    },
    updataBom() {
      this.$emit('updataBom')
    }
  }
}
</script>

<style lang="less">
.ant-popover-inner .mb {
  width: 210px;
  margin-bottom: 5px;
  text-align: center;

  button {
    width: 100%;
  }
}
</style>
