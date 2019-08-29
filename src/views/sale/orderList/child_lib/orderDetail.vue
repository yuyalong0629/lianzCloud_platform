<template>
  <div class="order-detail">
    <TabTitle>
      <template v-slot:orderInfo>
        <order-info
          :editInfo="editInfo"
          :detialList="detialList"
          :selectAddress="selectAddress"
          @isVisible="isVisible"
          @subLoading="subLoading"
        ></order-info>
      </template>
    </TabTitle>
    <div
      :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex:'999'
        }"
    >
      <a-button :style="{marginRight: '8px'}" @click="cancelHandle">取消</a-button>
      <a-button type="primary" @click="orderSubmit" v-if="!editInfo" :loading="loading">提交</a-button>
      <!-- v-show="getDetailPermission.includes('UPDATE')" -->
      <a-button
        type="primary"
        @click="orderSubmit"
        :disabled="editInfo && !editDetial"
        :loading="loading"
        v-else
      >保存</a-button>
    </div>
  </div>
</template>

<script>
import TabTitle from '../other/TabTitle'
import orderInfo from './orderInfo'
import Bus from '@/Bus'
export default {
  components: {
    TabTitle,
    'order-info': orderInfo
  },
  props: ['editInfo', 'detialList', 'selectAddress'],
  data() {
    return {
      editDetial: false,
      loading: false
    }
  },
  computed: {
    getDetailPermission() {
      return this.$store.state.detailPermission
    }
  },
  created() {
    Bus.$on('isDisabled', val => {
      this.editDetial = !val
    })
  },
  methods: {
    orderSubmit() {
      Bus.$emit('submitOrder', this.editInfo)
    },
    subLoading(val) {
      this.loading = val
    },
    // 关闭当前抽屉
    cancelHandle() {
      this.$emit('isVisible', false)
    },
    isVisible(val) {
      this.$emit('isVisible', val)
      this.loading = false
    }
  }
}
</script>

<style>
</style>
