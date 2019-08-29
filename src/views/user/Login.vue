<template>
  <div class="login">
    <div class="bg-color"></div>
    <div
      class="login-wrapper"
      style="border: 1px solid #F5F5F5; box-shadow: #666 0px 0px 10px; background: #FFF; padding: 20px; border-radius: 4px;"
      v-if="!key"
    >
      <!-- <h3>扫码登录</h3> -->
      <!-- 密码登录 -->
      <div class="pwdLogin">
        <a-divider>密码登录</a-divider>
        <a-form
          id="components-form-demo-normal-login"
          :form="loginInfo"
          class="login-form"
          @submit="handleSubmit"
        >
          <a-form-item>
            <a-input
              v-decorator="[
          'userName',
          { rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号！' }], validateTrigger: 'blur' }
        ]"
              placeholder="请输入手机号"
            >
              <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              v-decorator="[
          'password',
          { rules: [{ required: true, pattern: /^[\w]{6,18}$/, message: '请输入6~18位密码！' }], validateTrigger: 'blur' }
        ]"
              type="password"
              placeholder="请输入密码"
            >
              <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-checkbox :checked="remenberMe" @change="onRemenberMe">记住密码</a-checkbox>
            <router-link to="/user/retrieve" class="login-form-forgot">忘记密码</router-link>
            <a-button
              type="primary"
              html-type="submit"
              class="login-form-button"
              :loading="loginBtn"
            >登录</a-button>
            <router-link to="/user/register">跳转注册</router-link>
          </a-form-item>
        </a-form>
      </div>
      <!-- 扫码登录 -->
      <!-- <div class="codeLogin"></div> -->
    </div>
    <!-- 弹出层 -->
    <a-modal title="选择公司" :visible="visible" :footer="null" @cancel="handleCancel">
      <a-card>
        <a-card-grid
          style="width:25%;textAlign:'center'"
          class="selectCompany"
          @click="selectCompanyOk(index, item)"
          v-for="(item, index) of this.selectCompanyData"
          :key="index"
        >
          <h3>{{ item.companyName }}</h3>
          <img :src="item.companyLogo" :alt="item.companyName" />
        </a-card-grid>
      </a-card>
    </a-modal>
  </div>
</template>
<script>
import { post } from '@/api/axios.js'
import api from '@/api/index.js'
import { setTimeout } from 'timers'

export default {
  name: 'Login',
  data() {
    return {
      remenberMe: false,
      visible: false,
      selectCompanyData: '',
      loginBtn: false,
      key: ''
    }
  },
  beforeCreate() {
    this.loginInfo = this.$form.createForm(this)
  },
  created() {
    const key = this.$route.query.key
    this.key = key
    if (key) {
      this.loginByAuthKey(key)
    }
  },
  mounted() {
    // this.setRemenberLoginInfo()
  },
  methods: {
    // 记住密码
    onRemenberMe(e) {
      this.remenberMe = e.target.checked
      const remenberLoginInfo = this.loginInfo.getFieldsValue([
        'userName',
        'password'
      ])
      if (this.remenberMe) {
        console.log(remenberLoginInfo)
        localStorage.setItem(
          'remenberLoginInfo',
          JSON.stringify(remenberLoginInfo)
        )
      }
    },
    setRemenberLoginInfo() {
      const getRemenberLoginInfo = localStorage.getItem('remenberLoginInfo')
      console.log(getRemenberLoginInfo)
      this.loginInfo.setFieldsValue({
        userName: getRemenberLoginInfo.userName,
        password: getRemenberLoginInfo.password
      })
    },
    // 登录提交
    handleSubmit(e) {
      e.preventDefault()
      this.loginInfo.validateFields((err, values) => {
        this.loginBtn = true
        if (!err) {
          const loginObj = {
            phone: values.userName,
            pwd: values.password
          }
          post(api.login, loginObj)
            .then(res => {
              if (res.data.code === 0 && res.data.data.companys.length !== 0) {
                localStorage.setItem('NICK', res.data.data.user.name)
                // token
                localStorage.setItem(
                  'ACCESS_TOKEN',
                  res.data.data['AUTH-TOKEN']
                )
                if (res.data.data.companys.length > 1) {
                  this.success()
                  // 获取公司信息
                  this.selectCompanyData = res.data.data.companys
                  return false
                }
                localStorage.setItem('userId', res.data.data.user.id)
                // companyName
                localStorage.setItem(
                  'companyName',
                  res.data.data.companys[0].companyName
                )
                localStorage.setItem(
                  'companyType',
                  res.data.data.companys[0].companyType
                )
                localStorage.setItem(
                  'companyId',
                  res.data.data.companys[0].companyId + ''
                )
                setTimeout(() => {
                  this.$message.success('登录成功', 1)
                  this.$router.push('/permission')
                }, 600)
                return false
              }
              if (res.data.code !== 0) {
                this.$message.error(res.data.msg, 1.5)
                this.loginBtn = false
                return
              }
              if (res.data.data.companys.length === 0) {
                this.$message.error('请认证之后登陆管理控制台', 1)
                this.loginBtn = false
                return
              }
              this.$message.error(res.data.msg, 1.5)
              this.loginBtn = false
            })
            .catch(err => {
              console.log(err)
              this.loginBtn = false
            })
            .finally(() => {
              // this.loginBtn = false
            })
        } else {
          this.loginBtn = false
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    success() {
      this.$message.success('登录成功', 1).then(() => {
        // 显示弹出层
        this.visible = true
      })
    },
    selectCompanyOk(index, item) {
      // companyId
      localStorage.setItem(
        'companyId',
        this.selectCompanyData[index].companyId + ''
      )
      localStorage.setItem(
        'companyType',
        this.selectCompanyData[index].companyType
      )
      // companyName
      localStorage.setItem(
        'companyName',
        this.selectCompanyData[index].companyName
      )
      this.visible = false
      this.$message.loading('欢迎回来', 1.5)
      this.$router.push('/permission')
    },
    loginByAuthKey(key) {
      post(api.loginByAuthKey, { key }).then(res => {
        if (res.data.code === 0) {
          if (res.data.data.companys.length !== 0) {
            localStorage.setItem('NICK', res.data.data.user.name)
            // token
            localStorage.setItem('ACCESS_TOKEN', res.data.data['AUTH-TOKEN'])
            if (res.data.data.companys.length > 1) {
              this.success()
              // 获取公司信息
              this.selectCompanyData = res.data.data.companys
              return false
            }
            localStorage.setItem('userId', res.data.data.user.id)
            // companyName
            localStorage.setItem(
              'companyName',
              res.data.data.companys[0].companyName
            )
            console.log(res.data.data.companys[0].companyId)
            localStorage.setItem(
              'companyId',
              res.data.data.companys[0].companyId + ''
            )
            this.$message.success('登录成功', 1)
            this.$router.push('/permission')
          } else if (res.data.data.companys.length === 0) {
            this.$message.error('归属公司认证中', 1.5)
          }
        } else {
          this.$message.error(res.data.msg, 1.5)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  position: fixed;
  width: 400px;
  min-height: 300px;
  left: 50%;
  top: 50%;
  margin-left: 100px;
  margin-top: -240px;
  .bg-color {
    position: fixed;
    z-index: -100;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: url("../../assets/loginBg.png") no-repeat center;
    background-size: cover;
  }
  .login-wrapper {
    margin-top: 20px;
  }
}
.selectCompany {
  text-align: center;
  height: 146px;
  cursor: pointer;
  h3 {
    text-align: center;
  }
  img {
    max-width: 100%;
    max-height: 100%;
  }
}
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>
