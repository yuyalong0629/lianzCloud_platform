<template>
  <div>
    <div class="add-order-list">
      <a-row>
        <a-col :span="24">
          <h3 class="addCustomer-title">订单详情</h3>
        </a-col>
        <a-col :span="24">
          <Detail
            ref="detail"
            :mallOrderIntactDto="mallOrderIntactDto"
            :editInfo="editInfo"
            :editDetial="editDetial"
            :selectAddress="selectAddress"
            @setCustId="setCustId"
          ></Detail>
        </a-col>
      </a-row>
      <!-- <a-row>
        <a-col :span="24" class="mt">
          <h3 class="addCustomer-title">订单分配</h3>
        </a-col>
        <a-col :span="24">
          <Dispatch></Dispatch>
        </a-col>
      </a-row>-->
      <a-row>
        <a-col :span="24" class="mt">
          <h3 class="addCustomer-title">产品详情</h3>
        </a-col>
        <a-col :span="24" v-if="custId">
          <Product
            ref="product"
            :custId="custId"
            :dataSource="dataSource"
            :editInfo="editInfo"
            :editDetial="editDetial"
            :approval="approval"
            :selectAddress="selectAddress"
          ></Product>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" class="mt">
          <h3 class="addCustomer-title">收货地址</h3>
        </a-col>
        <a-col :span="24" v-if="custId">
          <Address
            :ocustName="ocustName"
            :custId="custId"
            :addrId="addrId"
            :editInfo="editInfo"
            :editDetial="editDetial"
            @setAddressId="setAddressId"
          ></Address>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" class="mt">
          <h3 class="addCustomer-title">附件</h3>
        </a-col>
        <a-col :span="24" v-if="custId">
          <Upload
            ref="upload"
            :editInfo="editInfo"
            :editDetial="editDetial"
            :file="fileList"
            :selectAddress="selectAddress"
          ></Upload>
        </a-col>
      </a-row>
      <!-- <a-row v-if="editInfo && !approval">
        <a-col :span="24" class="mt">
          <h3 class="addCustomer-title">审批流程</h3>
        </a-col>
        <a-col :span="24">
          <a-steps progressDot :current="1">
            <a-step title="Finished" description="This is a description."/>
            <a-step title="In Progress" description="This is a description."/>
            <a-step title="Waiting" description="This is a description."/>
          </a-steps>
        </a-col>
      </a-row>-->
    </div>
  </div>
</template>

<script>
import Detail from './detail'
import Product from './product'
import Address from './address'
import Upload from './upload'
import Dispatch from './dispatch'
import api from '@/api/index.js'
import Bus from '@/Bus'
import { postJson, get, put, deleted } from '@/api/axios.js'
export default {
  props: {
    editInfo: {
      type: Boolean
    },
    detialList: {
      type: String
    },
    selectAddress: {
      type: Boolean,
      default: false
    },
    approval: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  components: {
    Address,
    Dispatch,
    Detail,
    Product,
    Upload
  },
  data() {
    return {
      mallOrderIntactDto: {
        oorderNumber: '自动生成',
        ocustName: '',
        otype: 'FORMAL',
        addrId: '', // 地址ID
        opurchaseOrderno: '', // 客户单号
        custId: '', // 商城客户id
        ocustShortName: '', // 客户简称
        ototalSum: '', // 总金额，订单总计（销售总计）
        oattachment: '', // 上传附件 1
        oprePayment: '', // 预收款
        oremarks: '', // 备注
        ostatus: ''
      },
      dataSource: [],
      editDetial: false,
      custId: '',
      ocustName: '',
      addrId: '',
      fileList: [],
      timer: ''
    }
  },
  methods: {
    setCustId(val) {
      this.custId = val.custId
      this.ocustName = val.ocustName
    },
    setAddressId(val) {
      this.addrId = val
    },
    // 订单提交
    orderSubmit(val) {
      const _this = this
      if (this.custId === '') {
        this.$message.warning('请先选择客户名称', 1)
        return
      }
      const skuList = this.$refs.product.data
      if (skuList.length === 0) {
        this.$message.warning('请添加购买商品', 1)
        return
      }
      if (!this.addrId) {
        this.$confirm({
          title: '地址确认',
          content: '没有设置收件地址，确认提交订单吗？',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            _this.submit(val)
          }
        })
      } else {
        _this.submit(val)
      }
    },
    submit(val) {
      const _this = this
      const oattachment = this.$refs.upload.uploadFile.join(',')
      const mallOrderIntactDto = this.$refs.detail.mallOrderIntactDto
      const skuList = this.$refs.product.data
      mallOrderIntactDto.addrId = this.addrId
      mallOrderIntactDto.ocustAddrId = this.addrId
      mallOrderIntactDto.oattachment = oattachment
      _this.$emit('subLoading', true)
      if (!val) {
        // 订单添加
        mallOrderIntactDto.skuList = skuList
        delete mallOrderIntactDto.ostatus
        delete mallOrderIntactDto.oorderNumber
        postJson(api.orderSave, mallOrderIntactDto).then(res => {
          if (res.data.code === 0) {
            _this.$message.success('订单添加成功', 1).then(() => {
              _this.$emit('isVisible', true)
            })
          } else {
            _this.$message.error(res.data.msg, 1)
            _this.$emit('subLoading', false)
          }
        }).catch(() => {
          _this.$message.error('服务出错', 1)
          _this.$emit('subLoading', false)
        })
      } else {
        // 订单修改
        skuList.forEach(item => {
          delete item.sku
        })
        mallOrderIntactDto.orderDetails = skuList
        delete mallOrderIntactDto.skuList
        put(api.updateOrder, mallOrderIntactDto).then(res => {
          if (res.data.code === 0) {
            _this.$message.success('订单修改成功', 1).then(() => {
              _this.$emit('isVisible', true)
            })
          } else {
            _this.$message.error(res.data.msg, 1)
            _this.$emit('subLoading', false)
          }
        }).catch(() => {
          _this.$message.error('服务出错', 1)
          _this.$emit('subLoading', false)
        })
      }
    },
    // 获取订单详情
    getOrderDetail(id) {
      get(api.getOrderDetail + `${id}`).then(res => {
        this.mallOrderIntactDto = res.data.data
        this.custId = res.data.data.custId
        this.addrId = res.data.data.addrId
        this.ocustName = res.data.data.ocustName
        const skuList = res.data.data.skuList
        const oattachment = res.data.data.oattachment
        for (const i in skuList) {
          skuList[i].key = i
        }
        this.dataSource = skuList
        if (oattachment) {
          const oattachmentObj = []
          const oattachmentList = oattachment.split(',')
          for (const i in oattachmentList) {
            var name = oattachmentList[i].split('/')
            name = name[name.length - 1].split('.')
            var type = name[1]
            if (type === 'jpeg' || type === 'png' || type === 'svg' || type === 'gif' || type === 'jpg') {
              type = 'img'
            }
            oattachmentObj.push({
              uid: i,
              name: name[0],
              type: type,
              status: 'done',
              url: oattachmentList[i]
            })
          }
          this.fileList = oattachmentObj
        }
      }).catch(() => {
        this.$message.error('系统错误')
      })
    }
  },
  created() {
    if (this.editInfo) {
      this.getOrderDetail(this.detialList)
    }
    Bus.$on('isDisabled', val => {
      this.editDetial = !val
      if (val) {
        const newData = [...this.dataSource]
        newData.forEach(item => {
          delete item.editable
        })
      }
    })
    Bus.$on('isDelete', val => {
      if (!val) {
        const idStr = this.mallOrderIntactDto.id
        deleted(api.deletedBatch + `?idStr=${idStr}`).then(res => {
          if (res.data.code === 0) {
            this.$message.success('删除成功')
            this.$emit('isVisible', true)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }
    })
    Bus.$on('submitOrder', val => {
      this.orderSubmit(val)
    })
  },
  beforeDestroy() {
    Bus.$off('isDisabled')
    Bus.$off('isDelete')
    Bus.$off('submitOrder')
  }
}
</script>

<style lang='less' scoped>
@import "~styles/variable.less";
.inputWidth {
  .inputWidth();
}
.mt {
  margin: 10px 0;
}
.addCustomer-title {
  border-left: 4px solid #1890ff;
  padding-left: 6px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
