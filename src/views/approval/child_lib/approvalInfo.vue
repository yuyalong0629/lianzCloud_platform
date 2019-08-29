<template>
  <div class="purchase-info">
    <div class="prompt-title">
      <a-row>
        <a-col :span="18">
          <h3 class="prompt-h3">流水详情</h3>
        </a-col>
        <a-col :span="6" class="prompt-wrapper">
          <span class="prompt-edit" @click="auditApproval('PASS')" v-if="!showAction">
            <a-icon type="check-circle" style="color:#F0BB2E;margin-right:2px" />
            <span>通过</span>
          </span>
          <span class="prompt-delete" @click="auditApproval('NOPASS')" v-if="!showAction">
            <a-icon type="close-circle" style="color:#D50304;margin-right:2px" />
            <span>不通过</span>
          </span>
          <span class="prompt-close" @click="onClose">
            <a-icon type="close" />
          </span>
        </a-col>
      </a-row>
    </div>
    <orderInfo
      v-if="detial.foRunProcess.bizType === 'CHANNEL_SALE_ORDER'"
      :approval="true"
      :editInfo="true"
      :detialList="detial.foRunProcess.bizId"
    ></orderInfo>
    <!-- 审批意见 -->
    <a-row v-if="!showAction">
      <a-col :span="24">
        <h3 class="purchase-info-title">审批意见</h3>
      </a-col>
      <a-col :span="24">
        <a-textarea placeholder="审批意见" v-model="auditComment" :rows="4" />
      </a-col>
    </a-row>
    <!-- 审批结果 -->
    <a-row>
      <a-col :span="24">
        <h3 class="purchase-info-title">审批流程</h3>
      </a-col>
      <a-col :span="24">
        <a-steps :current="approvalStep">
          <a-step
            v-for="(item,index) in approvalData"
            :key="index"
            :status="item.approveResultStatus==='PASS'?'finish':item.approveResultStatus==='NOPASS'?'error':'wait'"
          >
            <span
              slot="title"
              class="approval-sure"
            >{{item.approveResultStatus==='PASS'?'通过':item.approveResultStatus==='NOPASS'?'不通过':'待审'}}</span>
            <a-icon type="user" slot="icon" style="display:none" />
            <template slot="description">
              <div class="approval-description">
                <p>{{item.names.join('/')}}</p>
                <template v-if="item.taskAuditRecords">
                  <template v-if="item.names.length == 1">
                    <p>{{item.taskAuditRecords[0].auditComment}}</p>
                    <p>{{item.taskAuditRecords[0].auditorTime | formatDate}}</p>
                  </template>
                  <template v-else>
                    <p
                      v-for="(item,index) in item.taskAuditRecords"
                      :key="index"
                    >{{item.auditorName}} {{item.auditComment}} {{item.auditorTime | formatDate}}</p>
                  </template>
                </template>
              </div>
            </template>
          </a-step>
        </a-steps>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import orderInfo from '@/views/sale/orderList/child_lib/orderInfo'
import api from '@/api/index'
import { get } from '@/api/axios'
import Bus from '@/Bus.js'
export default {
  props: ['detial', 'showAction'],
  components: {
    orderInfo
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      detialList: '',
      approvalData: [],
      auditComment: '',
      approvalStep: 0
    }
  },
  created() {
    this.getRunProcessDetial()
  },
  methods: {
    onClose() {
      this.$emit('onClose')
    },
    // 获取流程
    getRunProcessDetial() {
      const detial = this.detial
      const data = {}
      data.defProcessId = detial.foRunProcess.processId
      data.procesState = detial.foRunProcess.processState
      data.runProcessId = detial.foRunProcess.id
      data.version = detial.foRunProcess.version
      get(api.getRunProcessDetial, data).then(res => {
        if (res.data.code === 0) {
          const data = res.data.data
          this.approvalData = data
          data.forEach((item, index) => {
            if (item.approveResultStatus === 'PASS' || item.approveResultStatus === 'NOPASS') {
              this.approvalStep = index
            }
          })
        }
      })
    },
    // 审核通过/不通过
    auditApproval(auditResult) {
      const data = {}
      data.auditComment = this.auditComment ? this.auditComment : (auditResult === 'PASS' ? '通过' : '不通过')
      data.auditResult = auditResult
      data.runProcessId = this.detial.foRunProcess.id
      data.userId = localStorage.getItem('userId')
      if (auditResult === 'PASS') {
        get(api.successAudit, data).then(res => {
          if (res.data.code === 0) {
            this.$message.success('操作成功')
            this.$emit('onClose', true)
            Bus.$emit('ToObtain', true)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      } else {
        get(api.refusedAudit, data).then(res => {
          if (res.data.code === 0) {
            this.$message.success('操作成功')
            this.$emit('onClose', true)
            Bus.$emit('ToObtain', true)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~styles/variable.less";
.prompt-title {
  border-bottom: 1px solid #ebedf0;
  min-height: 40px;
  margin-bottom: 10px;
  .prompt-wrapper {
    display: flex;
    justify-content: flex-end;
    .prompt-edit {
      margin: 0 10px;
      cursor: pointer;
    }
    .prompt-delete {
      cursor: pointer;
      margin-right: 10px;
    }
    .prompt-close {
      cursor: pointer;
      padding: 0 10px;
      border-left: 1px solid #d8d8d8;
    }
  }
}

.purchase-info {
  .purchase-info-title {
    .h3_title();
    margin: 20px 0;
  }
  .labelColor {
    /deep/ .ant-form-item-label label {
      .labelColor();
    }
  }
}
/deep/.ant-steps-item-title:after {
  top: 25px;
}
.approval-sure {
  display: block;
  background: #5077d1;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 14px;
  text-align: center;
  line-height: 50px;
  color: #fff;
}
.approval-description {
  font-size: 12px;
  margin-top: 5px;
  p {
    line-height: 1.2;
    margin-bottom: 5px;
    &:first-child {
      font-size: 14px;
      font-weight: 600;
    }
  }
}
/deep/.ant-steps-item-finish {
  .approval-description {
    p {
      &:first-child {
        color: #333;
      }
    }
  }
}
</style>
