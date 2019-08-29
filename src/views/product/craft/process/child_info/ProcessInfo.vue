<template>
  <div class="process-info">
    <prompt-title @isDisabled="isDisabled" @isDelete="isDelete"></prompt-title>
    <a-row>
      <a-col :span="24">
        <h3 class="process-title">基础信息</h3>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form :form="processFormInfo" layout="horizontal" hideRequiredMark>
          <a-row>
            <a-col :span="8">
              <a-form-item
                label="工序编码"
                :class="{labelColor: isLabelColor}"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-input
                  v-if="disabled"
                  disabled="disabled"
                  v-decorator="['processCode']"
                  placeholder="默认带出"
                />
                <template v-else="disabled">{{getProcessInfo.code}}</template>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="工序名称"
                :class="{labelColor: isLabelColor}"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-input
                  v-if="disabled"
                  v-decorator="['processName', {rules: [{ required: true, message: '请输入工序名称' }]}]"
                  placeholder="请输入工序名称"
                />
                <template v-else="disabled">{{getProcessInfo.name}}</template>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="标准工时"
                :class="{labelColor: isLabelColor}"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-input v-if="disabled" v-decorator="['processWorkHours']" placeholder="请输入标准工时" />
                <template v-else="disabled">{{getProcessInfo.standardHours}}</template>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="工时计费"
                :class="{labelColor: isLabelColor}"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-input v-if="disabled" v-decorator="['processBilling']" placeholder="请输入工时计费" />
                <template v-else="disabled">{{getProcessInfo.timeBilling}}</template>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="备注"
                :class="{labelColor: isLabelColor}"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-input v-if="disabled" v-decorator="['processRemark']" placeholder="请输入备注" />
                <template v-else="disabled">{{getProcessInfo.remark}}</template>
              </a-form-item>
            </a-col>
            <!-- <a-col :span="8">
              <a-form-item
                label="是否质检"
                :class="{labelColor: isLabelColor}"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-switch
                  v-if="disabled"
                  v-decorator="['processInspection', { initialValue: false, valuePropName: 'checked' }]"
                />
                <template v-else="disabled">{{getProcessInfo.qc ? '屎' : '否'}}</template>
              </a-form-item>
            </a-col>-->
          </a-row>
        </a-form>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <h3 class="process-title">文件</h3>
      </a-col>
      <a-col :span="24">
        <div class="clearfix" style="marginLeft: 16px;">
          <a-upload
            action="/api/ic/user/file/uploadFile"
            listType="picture-card"
            :data="{'bizType': 'GOODS'}"
            :headers="headers"
            :fileList="fileList"
            @preview="handlePreview"
            @change="handleChange"
          >
            <div v-if="fileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </div>
      </a-col>
    </a-row>
    <div
      :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #E9E9E9',
          padding: '10px 16px',
          background: '#FFF',
          textAlign: 'right',
        }"
    >
      <a-button :style="{marginRight: '8px'}" @click="onClose">取消</a-button>
      <a-button @click="onSubmit" type="primary" :loading="loading" v-if="isEdit">提交</a-button>
      <a-button
        @click="onSave"
        type="primary"
        :disabled="!disabled"
        :loading="loading"
        v-show="getDetailPermission.includes('UPDATE')"
        v-else="!isEdit"
      >保存</a-button>
    </div>
  </div>
</template>
<script>
import PromptTitle from '@/components/tools/prompt/PromptTitle'
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'
import {
  postProcessAdd,
  processUpdate,
  deProcessDelete
} from '../basic_lib/index'
import { setTimeout } from 'timers'

export default {
  name: 'ProcessInfo',
  mixins: [mixinBasic, mixinIsEdit],
  data() {
    return {
      processFormInfo: this.$form.createForm(this),
      previewVisible: false,
      previewImage: '',
      // url
      fileList: [],
      headers: {
        'AUTH-TOKEN': localStorage.getItem('ACCESS_TOKEN'),
        companyId: localStorage.getItem('companyId')
      },
      // Info接收
      getProcessInfo: {}
    }
  },
  props: {
    processInfo: {
      type: Object,
      default: {}
    }
  },
  methods: {
    // 提交
    onSubmit(e) {
      e.preventDefault()
      this.getFormData(
        null,
        this.fileList.length ? this.fileList[0].response.data : '',
        postProcessAdd
      )
    },
    // 保存修改
    onSave(e) {
      e.preventDefault()
      this.getFormData(
        this.getProcessInfo.id,
        this.fileList.length ? this.fileList[0].url : '',
        processUpdate
      )
    },
    // 编辑 || 取消
    isDisabled(val) {
      const edit = new Promise(resolved => {
        // Input选中
        this.disabled = !val
        // label color
        this.isLabelColor = !this.isLabelColor
        resolved()
      })
      edit.then(() => {
        if (this.disabled) {
          this.setFormData()
        }
      })
    },
    // 删除
    isDelete(val) {
      deProcessDelete.call(this, [this.processInfo.id])
    },
    // upload
    handleCancel() {
      this.previewVisible = false
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange({ file, fileList }) {
      this.fileList = fileList
    },
    // Form
    getFormData(id, fileList, postFormData) {
      this.processFormInfo.validateFields((err, values) => {
        if (!err) {
          console.log(this.fileList)
          this.loading = true
          const params = {
            // code: '', // 工序编码
            id,
            name: values.processName, // 工序名称
            optBook: this.fileList.length > 0 ? fileList : '',
            // qc: values.processInspection, // 是否质检
            remark: values.processRemark, // 备注
            standardHours: values.processWorkHours, // 标准工时
            timeBilling: values.processBilling // 工时计费
          }
          console.log(params)
          postFormData.call(this, params)
        }
      })
    },
    // Info
    setFormData() {
      this.processFormInfo.setFieldsValue({
        processName: this.getProcessInfo.name, // 工序名称
        processInspection: this.getProcessInfo.qc, // 是否质检
        processRemark: this.getProcessInfo.remark, // 备注
        processWorkHours: this.getProcessInfo.standardHours, // 标准工时
        processBilling: this.getProcessInfo.timeBilling // 工时计费
      })
    }
  },
  computed: {
    getDetailPermission() {
      return this.$store.state.detailPermission
    }
  },
  watch: {
    processInfo: {
      handler(val) {
        console.log(val)
        this.getProcessInfo = val
        // 判断是否有图片
        if (val && val.optBook) {
          this.fileList = [
            {
              url: val.optBook,
              uid: '-1',
              name: 'xxx.png'
            }
          ]
        }
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    'prompt-title': PromptTitle
  }
}
</script>
<style lang="less" scoped>
@import '~styles/variable.less';

.process-info {
  .process-title {
    margin-bottom: 16px;
    .h3_title();
  }
  .labelColor {
    /deep/ .ant-form-item-label label {
      .labelColor();
    }
  }
}
</style>
