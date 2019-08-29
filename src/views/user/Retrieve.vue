<template>
  <div class="retrieve">
    <div class="bg-color"></div>
    <div class="retrieve-wrapper" style="border: 1px solid #F5F5F5; background: #FFF; box-shadow: #666 0px 0px 10px; padding: 20px; border-radius: 4px;">
      <a-divider>找回密码</a-divider>
      <a-form :form="registerInfo" @submit="handleRegister">
        <a-form-item>
          <a-row :gutter="14">
            <a-col :span="16">
              <a-input
                placeholder="请输入手机号"
                v-decorator="[
              'username',
              {rules: [{ validator: validateUsername }], validateTrigger: ['change', 'blur']}
            ]"
              >
                <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)"/>
              </a-input>
            </a-col>
            <a-col :span="8">
              <a-button
                :type="btnType"
                :disabled="disabled"
                @click="sendCode"
                class="register-sendcode"
              >{{ btnText }}</a-button>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item>
          <a-row>
            <a-col :span="24">
              <a-input
                placeholder="请输入验证码"
                v-decorator="[
              'verificationCode',
              {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: ['change', 'blur']}
            ]"
              >
                <a-icon slot="prefix" type="safety-certificate" style="color:rgba(0,0,0,.25)"/>
              </a-input>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item>
          <a-row>
            <a-col :span="24">
              <a-input
                placeholder="请输入重置密码"
                type="password"
                v-decorator="[
              'password',
              {rules: [{ validator: validatePassword }], validateTrigger: ['blur']}
            ]"
              >
                <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"/>
              </a-input>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item>
          <a-row>
            <a-col :span="24">
              <a-input
                placeholder="请确认密码"
                type="password"
                v-decorator="[
              'rePassword',
              {rules: [{ required: true, message: '请再次输入密码' }, { validator: validateRePassword }], validateTrigger: ['blur']}
            ]"
              >
                <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"/>
              </a-input>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 24 }">
          <a-row :gutter="16">
            <a-col class="gutter-row" :span="24">
              <router-link to="/user/register" class="login-form-register">去注册</router-link>
              <router-link to="/user/login" class="login-form-forgot">返回登录</router-link>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit">重置密码</a-button>
          <a-button :style="{ marginLeft: '8px' }" @click="handleReset">清除</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script>
import { post } from '@/api/axios.js'
import api from '@/api/index.js'
import { factorySendCode } from 'utils/utils.js'

export default {
  name: 'Retrieve',
  data() {
    return {
      btnType: 'primary',
      btnText: '发送验证码',
      remaining: 5,
      disabled: false,
      registerInfo: this.$form.createForm(this),
      checkAgree: false
    }
  },
  methods: {
    // 自定义用户名验证
    validateUsername(rule, value, callback) {
      const regex = /^1[34578]\d{9}$/
      if (!value) {
        callback(new Error('用户名不能为空'))
        return false
      }
      if (!regex.test(value)) {
        callback(new Error('请输入正确的手机号'))
        return false
      }
      callback()
    },
    validatePassword(rule, value, callback) {
      const regex = /[^0-9a-zA-Z_]/
      if (!value) {
        callback(new Error('密码不能为空'))
        return false
      }
      if (value.length < 6 || value.length > 18) {
        callback(new Error('密码请在6～18位数之间'))
        return false
      }
      if (regex.test(value)) {
        callback(new Error('密码不能有特殊字符'))
        return false
      }
      callback()
    },
    validateRePassword(rule, value, callback) {
      const password = this.registerInfo.getFieldValue('password')
      if (value === undefined) {
        callback(new Error('请输入密码'))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },
    // senCode
    sendCode() {
      this.registerInfo.validateFields(['username'], (err, value, callback) => {
        if (!err) {
          post(api.reSendCode, { phone: value.username }).then(res => {
            factorySendCode.call(this, 5)
          })
        } else {
          callback(new Error('手机号验证不正确'))
        }
      })
    },
    // 重置提交
    handleRegister(e) {
      e.preventDefault()
      this.registerInfo.validateFields((err, values) => {
        if (!err) {
          const registerObj = {
            phone: values.username,
            pwd: values.password,
            yzm: values.verificationCode
          }
          post(api.retrieve, registerObj)
            .then(res => {
              if (res.data.code === 1) {
                this.$message.error(res.data.msg)
                return false
              }
              if (res.data.code === 0) {
                this.success()
                return false
              }
            })
            .catch(err => {
              console.log(err)
            })
          return false
        }
        this.$message.error('重置失败')
      })
    },
    handleReset() {
      this.registerInfo.resetFields()
    },
    // 注册成功回调
    success() {
      this.$message
        .success('重置成功', 1)
        .then(() => {
          this.$message.loading('跳转登录页面', 1.5)
        })
        .then(() => {
          this.$router.push('/login')
        })
    }
  }
}
</script>
<style lang="less" scoped>
.retrieve {
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
    background: url('../../assets/loginBg.png') no-repeat center;
    background-size: cover;
  }
  .register-sendcode {
    width: 100%;
  }
  .register-to-login {
    float: right;
    color: #8f939a;
    font-size: 12px;
  }
  .register-to-haslogin {
    color: #8f939a;
    font-size: 12px;
  }
}
#components-form-demo-normal-re g .login-form {
  max-width: 300px;
}
.login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>
