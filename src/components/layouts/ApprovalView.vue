<template>
  <div class="approval">
    <a-layout id="components-layout-demo-fixed" style="min-height: 100vh">
      <a-layout-header class="approval-header">
        <a-row>
          <a-col :span="21" :offset="3">
            <a-row>
              <a-col :span="1" :offset="1">
                <a href="#/permission">返回</a>
              </a-col>
              <a-col :span="10" :offset="5">
                <a-menu
                  mode="horizontal"
                  :style="{ lineHeight: '64px' }"
                  :defaultSelectedKeys="[key]"
                >
                  <a-menu-item key="1" @click="detialView('1')" class="pd">
                    <a-badge
                      :showZero="false"
                      :count="ApproveCount"
                      :overflowCount="99"
                      :offset="[15,0]"
                    >待办</a-badge>
                  </a-menu-item>
                  <a-menu-item key="2" @click="detialView('2')" class="pd">
                    <a-badge
                      :showZero="false"
                      :count="ReadCount"
                      :overflowCount="99"
                      :offset="[15,0]"
                    >阅览</a-badge>
                  </a-menu-item>
                  <a-menu-item key="3" @click="detialView('3')" class="pd">我发起的</a-menu-item>
                  <a-menu-item key="4" @click="detialView('4')" class="pd">全部</a-menu-item>
                </a-menu>
              </a-col>
              <a-col :span="3">
                <!-- <span class="message-member">张三</span> -->
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content :style="{marginTop: '64px' }">
        <a-row>
          <a-col :span="18" :offset="3">
            <div class="approval-content">
              <router-view/>
            </div>
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
  </div>
</template>
<script>
import api from '@/api/index'
import { get } from '@/api/axios'
import Bus from '@/Bus.js'
export default {
  name: 'ApprovalView',
  data() {
    return {
      ApproveCount: '',
      ReadCount: '',
      key: 1
    }
  },
  created() {
    if (this.$route.query.key) {
      this.key = this.$route.query.key
    }
    this.getSelectProcessCout()
    Bus.$on('ToObtain', val => {
      this.getSelectProcessCout()
    })
  },
  destroyed() {
    Bus.$off('ToObtain')
  },
  methods: {
    detialView(key) {
      switch (key) {
        case '1':
          this.$router.push({ path: '/approval/backlog', query: { key: 1 } })
          break
        case '2':
          this.$router.push({ path: '/approval/read', query: { key: 2 } })
          break
        case '3':
          this.$router.push({ path: '/approval/initiator', query: { key: 3 } })
          break
        case '4':
          this.$router.push({ path: '/approval/allApproval', query: { key: 4 } })
          break
      }
    },
    getSelectProcessCout() {
      get(api.getSelectProcessCout).then(res => {
        if (res.data.code === 0) {
          this.ApproveCount = res.data.data.ApproveCount
          this.ReadCount = res.data.data.ReadCount
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.approval {
  &-header {
    position: fixed;
    z-index: 1;
    width: 100%;
    padding: 0;
    background: #fff;
    box-shadow: 0 1px 7px 1px rgba(202, 202, 202, 0.5);
    & .pd {
      padding: 0 30px;
    }
  }
  &-content {
    background: #fff;
    padding: 24px;
    min-height: 92vh;
    box-shadow: 0 1px 5px 1px rgba(175, 175, 175, 0.35);
    border-radius: 0px 0px 4px 4px;
  }
  .message-member {
    display: block;
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #5077d1;
    font-size: 14px;
    color: #fff;
    text-align: center;
    line-height: 50px;
    top: 50%;
  }
}
</style>
