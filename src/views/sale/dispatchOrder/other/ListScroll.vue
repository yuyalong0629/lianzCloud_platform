<template>
  <a-row
    class="order-list order-list-item demo-infinite-container"
    v-infinite-scroll="handleInfiniteOnLoad"
    :infinite-scroll-disabled="busy"
    :infinite-scroll-distance="10"
  >
    <a-list :dataSource="value">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <div class="list-item" @click="addCompany(index)">
          <div class="item-left">
            <div class="item-left-top">
              <a
                href="javascript:;"
                @click="e=>infoView(e,item.skuId,index)"
              >{{item.name}} {{item.bom}} {{item.craft}}</a>
              <span>{{item.orderNumber}}</span>
            </div>
            <slot name="List" :item="item"></slot>
          </div>
          <div class="item-right">
            <slot name="ListRight" :item="item" :index="index"></slot>
          </div>
        </div>
      </a-list-item>
      <div v-if="loading && !busy" class="demo-loading-container">
        <a-spin />
      </div>
    </a-list>
  </a-row>
</template>

<script>
import infiniteScroll from 'vue-infinite-scroll'
export default {
  directives: { infiniteScroll },
  props: ['value', 'busy', 'loading'],
  methods: {
    handleInfiniteOnLoad() {
      this.$emit('handleInfiniteOnLoad')
    },
    addCompany(index) {
      this.$emit('addCompany', index)
    },
    infoView(e, id, index) {
      window.event ? window.event.cancelBubble = true : e.stopPropagation()
      this.$emit('infoView', { id, index })
    }
  }
}
</script>

<style lang='less' scoped>
@import "~styles/dispach.less";
</style>
