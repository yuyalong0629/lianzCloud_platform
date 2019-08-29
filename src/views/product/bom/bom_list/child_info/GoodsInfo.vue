<template>
  <div class="goods-info">
    <tab-title @isDelete="isDelete">
      <template v-slot:tabGoodsInfo>
        <!-- 产品信息 -->
        <a-row>
          <a-col :span="24">
            <h3 class="categoryInfo-title">产品详情</h3>
          </a-col>
          <a-col :span="24">
            <product-info
              ref="goodsInfoForm"
              @classAttrInfo="classAttrInfo"
              @classCatObj="classCatObj"
              :skuInfoData="skuInfoData"
              :childDisabled="disabled"
            />
          </a-col>
          <a-col :span="24" v-if="getClassType || classAttrInfoData.length">
            <a-col :span="24">
              <h3 class="categoryInfo-title">分类属性</h3>
            </a-col>
            <a-col :span="24">
              <class-attr
                ref="classAttrForm"
                @classData="classData"
                :classAttrVal="classAttrVal"
                :childDisabled="disabled"
                :classAttrInfoData="classAttrInfoData"
                :classCatId="classCatId"
              />
            </a-col>
          </a-col>
          <a-col :span="24">
            <a-col :span="24">
              <h3 class="categoryInfo-title">产品图片</h3>
            </a-col>
            <a-col :span="24">
              <product-upload @propsFileList="propsFileList" :picInfoData="picInfoData" />
            </a-col>
          </a-col>
        </a-row>
      </template>
      <template v-slot:tabMallAttr>
        <tabMall-info />
      </template>
    </tab-title>
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
        v-show="getDetailPermission.includes('UPDATE')"
        :loading="loading"
        v-else="!isEdit"
      >保存</a-button>
    </div>
  </div>
</template>
<script>
import Bus from '@/Bus.js'
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'
import TabTitle from '../other/TabTitle'
import TabMallInfo from './tab_mallInfo/TabMallInfo'
// 产品信息
import ProductInfoForm from './tab_goodsInfo/ProductInfoForm'
import ClassAttrForm from './tab_goodsInfo/ClassAttrForm'
import ProductUpload from '@/components/upload/Upload'
// index
import { goodsSkuAdd, goodsSkuUpload, bomDelete } from '../basic_lib/index'

export default {
  name: 'GoodsInfo',
  mixins: [mixinBasic, mixinIsEdit],
  data() {
    return {
      isLabelColor: false,
      getClassType: false,
      classAttrVal: [],
      // 产品详情data
      skuData: {},
      // Pic
      pics: [],
      // 客户详情
      custInfo: {},
      springInfo: {},
      // 分类属性
      attrVals: [],
      // 产品详情回显
      skuInfoData: {},
      classCatObjId: [],
      // 产品图片回显
      picInfoData: [],
      // 分类属性回显
      classAttrInfoData: [],
      classCatId: ''
    }
  },
  props: {
    goodsViewInfo: {
      type: Object,
      default: {}
    }
  },
  created() {
    // 编辑 || 取消
    Bus.$on('isDisabled', val => {
      // Input选中
      console.log(val)
      const edit = new Promise(resolved => {
        this.disabled = !val
        this.isLabelColor = !this.isLabelColor
        resolved()
      })
      edit.then(() => {
        if (this.disabled) {
          this.setFormData()
        }
      })
    })
  },
  destroyed() {
    Bus.$off('isDisabled')
  },
  methods: {
    // 公司上级分类
    onChangeCategoryName(value) {
      // console.log(value)
    },
    // 提交
    onSubmit(e) {
      e.preventDefault()
      this.getFormData().then(() => {
        const params = {
          sku: {
            ...this.skuData,
            catId: this.skuData.catId
              ? this.skuData.catId.slice(-1).join('')
              : '',
            ...this.price,
            skuType: 'MATERIAL'
          },
          pics: [...this.pics],
          custInfo: {
            ...this.custInfo
          },
          attrVals: [...this.attrVals]
        }
        // console.log(params)
        // 添加商品列表
        goodsSkuAdd.call(this, params, '添加成功')
      })
    },
    // 保存修改
    onSave(e) {
      e.preventDefault()
      this.getFormData().then(() => {
        const params = {
          sku: {
            ...this.skuInfoData,
            ...this.skuData,
            catId: this.skuData.catId
              ? this.skuData.catId.slice(-1).join('')
              : '',
            ...this.price,
            skuType: 'MATERIAL'
          },
          pics: [...this.pics],
          custInfo: {
            ...this.custInfo
          },
          attrVals: [...this.attrVals]
        }
        // 添加商品列表
        goodsSkuUpload.call(this, params, '更新成功')
      })
    },
    // 删除
    isDelete(val) {
      bomDelete.call(this, this.goodsViewInfo.sku.id)
    },
    // 子组件分类属性 $emit
    classAttrInfo(val) {
      if (val.length) {
        this.getClassType = true
        this.classAttrVal = val
        return
      }
      this.getClassType = false
    },
    // 子组件分类属性 接受data $emit
    classData(val) {
      // console.log(val)
      this.attrVals = val
    },
    // Upload
    propsFileList(val) {
      this.pics = val
    },
    // 产品详情子组件接受分类属性ID数组
    classCatObj(val) {
      console.log(val)
      this.classCatObjId = val.id
    },
    // FormData
    async getFormData() {
      // 产品详情FormData
      this.$refs.goodsInfoForm.goodsInfoForm.validateFields((err, values) => {
        if (!err) {
          this.skuData = values
        }
      })
      // 分类属性FormData
      if (this.$refs.classAttrForm) {
        this.$refs.classAttrForm.classAttrInfoForm.validateFields(
          (err, values) => {
            if (!err) {
              // console.log(values)
            }
          }
        )
      }
      // 弹簧属性FormData
      if (this.$refs.productAttrForm) {
        this.$refs.productAttrForm.productAttrForm.validateFields(
          (err, values) => {
            if (!err) {
              // console.log(values)
              this.springInfo = values
            }
          }
        )
      }
    },
    // Form详情
    async setFormData() {
      // 产品详情FormData
      this.$refs.goodsInfoForm.goodsInfoForm.setFieldsValue({
        catId: this.classCatObjId,
        name: this.skuInfoData.name,
        drawNum: this.skuInfoData.drawNum,
        drawVersion: this.skuInfoData.drawVersion,
        spec: this.skuInfoData.spec,
        unit: this.skuInfoData.unit || '公斤',
        gateway: this.skuInfoData.gateway,
        standard: this.skuInfoData.standard,
        weight: this.skuInfoData.weight + '',
        cz: this.skuInfoData.cz,
        remark: this.skuInfoData.remark,
        price: this.skuInfoData.price
      })
    }
  },
  watch: {
    goodsViewInfo: {
      handler(val) {
        console.log(val)
        if (Object.keys(val).length) {
          // sku
          this.skuInfoData = val.sku
          // PIC
          this.picInfoData = val.pics
          // 分类属性
          this.classAttrInfoData = val.attrVals
          this.classCatId = val.sku.catId
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    getDetailPermission() {
      return this.$store.state.detailPermission
    }
  },
  components: {
    'tab-title': TabTitle,
    'tabMall-info': TabMallInfo,
    'product-info': ProductInfoForm,
    'class-attr': ClassAttrForm,
    'product-upload': ProductUpload
  }
}
</script>
<style lang="less" scoped>
@import "~styles/variable.less";

.goods-info {
  .categoryInfo-title {
    margin: 15px 0;
    .h3_title();
  }
  .labelColor {
    /deep/ .ant-form-item-label label {
      .labelColor();
    }
  }
}
</style>
