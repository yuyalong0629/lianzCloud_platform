<template>
  <div class="headerMenu">
    <a href="javascript:;" class="approve" @click="getApproval">
      <a-icon type="audit" style="font-size:16px;" />
    </a>
    <!-- 外链 -->
    <a href="javascript:;" @click="showModal">
      <a-icon type="home" style="font-size:16px;margin:0 10px;" />
    </a>
    <HeaderNotice class="action" />
    <a-dropdown>
      <span class="action ant-dropdown-link user-dropdown-menu">
        <a-avatar style="backgroundColor:#87D068" icon="user" />
        <span class="username">{{ this.getNick }}</span>
      </span>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper" style="marginTop: 24px;">
        <a-menu-item key="0">
          <router-link to="/">
            <a-icon type="user" style="marginRight: 4px;" />
            <span>个人中心</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="1">
          <router-link to="/">
            <a-icon type="setting" style="marginRight: 4px;" />
            <span>账户设置</span>
          </router-link>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="3">
          <a href="javascript:;" @click="handleLogout">
            <a-icon type="logout" style="marginRight: 4px;" />
            <span>退出登录</span>
          </a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <a-modal title="请输入管理员密码" :visible="visible" @cancel="handleCancel" :footer="null">
      <a-form @submit="handleOk">
        <a-form-item>
          <a-input type="password" placeholder="请输入管理员密码" v-model="password" />
        </a-form-item>
        <a-row>
          <a-col :span="24" :style="{ textAlign: 'right' }">
            <a-button @click="handleCancel" style="margin-right:10px;">取消</a-button>
            <a-button type="primary" html-type="submit">确定</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { post, get } from '@/api/axios.js'
import api from '@/api/index.js'
import HeaderNotice from './HeaderNotice'

export default {
  name: 'HeaderMenu',
  data() {
    return {
      visible: false,
      password: '',
      url: ''
    }
  },
  created() {
    this.getHref()
  },
  methods: {
    handleLogout() {
      const that = this
      this.$confirm({
        title: '提示',
        okText: '退出',
        cancelText: '取消',
        content: '真的要退出登录吗 ?',
        onOk() {
          that.$router.replace('/user/login')
          localStorage.removeItem('ACCESS_TOKEN')
        },
        onCancel() { }
      })
    },
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      e.preventDefault()
      if (!this.password) {
        this.$message.warning('请输入管理员密码')
        return
      }
      var newPage = window.open()
      const url = this.url
      post(api.companyValidate, { password: this.password }).then(res => {
        if (res.data.code === 0) {
          this.password = ''
          this.visible = false
          // const orgmanageUrl = `http://192.168.1.121:8082/#/getInfo?key=${res.data.data.key}`
          const orgmanageUrl = `${url}/#/getInfo?key=${res.data.data.key}`
          newPage.location.href = orgmanageUrl
        } else {
          this.password = ''
          this.visible = false
          const confirm = newPage.confirm(res.data.msg)
          if (confirm) {
            newPage.close()
          } else {
            newPage.location.href = location.href
          }
          // this.$message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取组织架构链接地址
    getHref() {
      get(api.getBackStageUrl).then(res => {
        if (res.data.code === 0) {
          this.url = res.data.data
        }
      })
    },
    handleCancel(e) {
      this.visible = false
      this.password = ''
    },
    // 审批
    getApproval() {
      this.$router.push({ path: '/approval/backlog', query: { key: 1 } })
    }
  },
  computed: {
    getNick() {
      return localStorage.getItem('NICK')
    }
  },
  components: {
    HeaderNotice
  }
}
</script>
<style lang="less" scoped>
.headerMenu {
  float: right;
  margin-right: 24px;
  .action {
    margin-right: 20px;
    .username {
      font-size: 14px;
      cursor: pointer;
      margin-left: 5px;
    }
  }
}
</style>
