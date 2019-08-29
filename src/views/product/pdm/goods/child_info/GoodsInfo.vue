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
              @springType="springType"
              @changeSpringType="changeSpringType"
              @classAttrInfo="classAttrInfo"
              @classCatObj="classCatObj"
              :skuInfoData="skuInfoData"
              :childDisabled="disabled"
              :springInfoType="springInfoData.springType"
            />
          </a-col>
          <a-col :span="24">
            <a-col :span="24">
              <h3 class="categoryInfo-title" style="display: inline-block; margin-right: 10px;">客户详情</h3>
              <a-switch
                checkedChildren="可选"
                unCheckedChildren="隐藏"
                :disabled="!disabled"
                size="small"
                :checked="checkedSwitch"
                @change="onChangeCustInfo"
              />
            </a-col>
            <a-col :span="24">
              <cust-info
                v-if="checkedSwitch"
                ref="custInfoForm"
                :custInfoData="custInfoData"
                :childDisabled="disabled"
                :custName="custName"
              />
            </a-col>
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
          <a-col :span="24" v-if="getSpringType || springVal !== undefined">
            <a-col :span="24">
              <h3 class="categoryInfo-title">弹簧属性</h3>
            </a-col>
            <a-col :span="24">
              <spring-attr
                ref="productAttrForm"
                :springVal="springVal"
                :childDisabled="disabled"
                :springInfoData="springInfoData"
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
          <a-col :span="24">
            <a-col :span="24">
              <h3 class="categoryInfo-title">工艺详情</h3>
            </a-col>
            <a-col :span="24">
              <craft-info
                @craftData="craftData"
                :childDisabled="disabled"
                :craftsInfoData="craftsInfoData"
              />
            </a-col>
          </a-col>
          <a-col :span="24">
            <a-col :span="24">
              <h3 class="categoryInfo-title">BOM详情</h3>
            </a-col>
            <a-col :span="24">
              <bom-info
                @bomData="bomData"
                :childDisabled="disabled"
                :materialsGroupInfoData="materialsGroupInfoData"
              />
            </a-col>
          </a-col>
        </a-row>
      </template>
      <template v-slot:tabMallAttr>
        <tabMall-info />
      </template>
      <template v-slot:PriceTab>
        <price-info :skuId="setSkuId" @basicSprice="basicSprice" @spriceData="spriceData" />
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
          zIndex: 100
        }"
    >
      <a-button :style="{marginRight: '8px'}" @click="onClose">取消</a-button>
      <a-button
        @click="onSubmit"
        type="primary"
        :loading="loading"
        v-if="isEdit&&!bomButton"
      >{{ subTitle }}</a-button>
      <a-button
        @click="onSave"
        type="primary"
        :disabled="!disabled"
        :loading="loading"
        v-else-if="getDetailPermission.includes('UPDATE')&&!bomButton"
      >保存</a-button>
      <a-button @click="onSave" type="primary" :loading="loading" v-else-if="bomButton">保存</a-button>
    </div>
  </div>
</template>
<script>
import Bus from '@/Bus.js'
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'
import { postBomAndCraftPrices } from '../basic_lib/index'
import TabTitle from '../other/TabTitle'
import TabMallInfo from './tab_mallInfo/TabMallInfo'
// 产品信息
import ProductInfoForm from './tab_goodsInfo/ProductInfoForm'
import CustInfoForm from './tab_goodsInfo/CustInfoForm'
import ClassAttrForm from './tab_goodsInfo/ClassAttrForm'
import SpringAttrForm from './tab_goodsInfo/SpringAttrForm'
import ProductUpload from '@/components/upload/Upload'
import CraftInfo from './tab_goodsInfo/craft_info/CraftInfo'
import BomInfo from './tab_goodsInfo/bom_info/BomInfo'

// 报价
import PriceTab from './tab_price/PriceTab'

// index
import {
  goodsSkuAdd,
  goodsSkuUpload,
  bomDelete,
  setBomAndCraft
} from '../basic_lib/index'

export default {
  name: 'GoodsInfo',
  mixins: [mixinBasic, mixinIsEdit],
  data() {
    return {
      isLabelColor: false,
      getSpringType: false,
      getClassType: false,
      springVal: undefined,
      classAttrVal: [],
      bomButton: false,
      skuId: '',
      type: undefined,
      // 产品详情data
      skuData: {},
      // Pic详情
      pics: [],
      // 客户详情
      custInfo: {},
      // 弹簧详情
      springInfo: {},
      // 分类属性
      attrVals: [],
      // 工艺详情
      crafts: [],
      // BOM详情
      materialsGroup: [],
      // 产品详情回显
      skuInfoData: {},
      classCatObjId: [],
      // 客户详情回显
      custInfoData: {},
      custName: '',
      // 弹簧属性回显
      springInfoData: {},
      // 产品图片回显
      picInfoData: [],
      // 分类属性回显
      classAttrInfoData: [],
      classCatId: '',
      // 工艺详情回显
      craftsInfoData: [],
      // 原材料详情回西显
      materialsGroupInfoData: [],
      checkedSwitch: false,
      setSkuId: '',
      activeTab: '1',
      subTitle: '保存',
      getPrice: '',
      getSpriceData: []
    }
  },
  props: {
    goodsViewInfo: {
      type: Object,
      default: {},
      required: false
    }
  },
  created() {
    // 编辑 || 取消
    Bus.$on('isDisabled', val => {
      // Input选中
      const edit = new Promise(resolved => {
        this.disabled = !val
        this.isLabelColor = !this.isLabelColor
        this.custInfoData
          ? (this.checkedSwitch = true)
          : (this.checkedSwitch = false)
        resolved()
      })
      edit.then(() => {
        if (this.disabled) {
          this.setFormData()
        }
      })
    })
    Bus.$on('activeTab', val => {
      this.activeTab = val
      if (this.activeTab === '1') {
        this.subTitle = '保存'
      }
      if (this.activeTab === '3') {
        this.subTitle = '提交'
      }
    })
  },
  mounted() {
    Bus.$on('setBomButton', val => {
      this.bomButton = val
    })
    Bus.$on('basicInfo', val => {
      this.skuId = val.skuId
      this.type = val.type
    })
  },
  destroyed() {
    Bus.$off('isDisabled')
    Bus.$off('basicInfo')
    Bus.$off('activeTab')
    Bus.$off('setBomButton')
  },
  methods: {
    // 公司上级分类
    onChangeCategoryName(value) {
      // console.log(value)
    },
    // 基础报价
    basicSprice(val) {
      this.getPrice = val
    },
    // 价目表
    spriceData(val) {
      this.getSpriceData = val
    },
    // 提交
    onSubmit(e) {
      e.preventDefault()
      if (this.activeTab === '1') {
        // 工艺详情
        const materialsGroup = []
        this.materialsGroup.forEach((item, index) => {
          materialsGroup[index] = {
            bomType: item.bomType,
            defaultMaterials: item.defaultMaterials,
            groupName: item.inputVal,
            materials: item.dataSource.map(item => {
              return {
                cost: item.dosage,
                materialId: item.key,
                materialUnit: item.unit
              }
            })
          }
        })
        this.getFormData().then(() => {
          const params = {
            sku: {
              ...this.skuData,
              catId: this.skuData.catId
                ? this.skuData.catId.slice(-1).join('')
                : '',
              skuType: 'SPRING'
            },
            pics: [...this.pics],
            custInfo: {
              ...this.custInfo
            },
            springInfo: {
              springType: this.springVal,
              ...this.springInfo
            },
            attrVals: [...this.attrVals],
            crafts: this.crafts.map(item => {
              return {
                productCraftCode: item.productCraftCode,
                productCraftId: item.productCraftId,
                defaultCraft: item.defaultCraft,
                productCraftName: item.inputVal
              }
            }),
            materialsGroup: [...materialsGroup]
          }
          // console.log(params)
          // 添加商品列表
          goodsSkuAdd.call(this, params)
        })
        return
      }
      if (this.activeTab === '3') {
        postBomAndCraftPrices(
          this.setSkuId,
          this.getPrice,
          this.getSpriceData
        ).then(res => {
          if (res.data.code === 0) {
            this.loading = false
            this.$message.success('修改成功')
            this.$emit('isDrawer', false)
            return false
          }
          this.$message.error(res.data.msg)
          this.$emit('isDrawer', true)
          this.loading = false
        })
      }
    },
    // 保存修改
    onSave(e) {
      e.preventDefault()
      if (this.activeTab === '1') {
        // 工艺详情
        const materialsGroup = []
        // console.log(this.materialsGroup)
        this.materialsGroup.forEach((item, index) => {
          materialsGroup[index] = {
            ...item,
            bomType: item.bomType,
            defaultMaterials: item.defaultMaterials,
            groupName: item.inputVal,
            materials: item.dataSource.map(item => {
              return {
                id: item.id,
                cost: item.dosage,
                materialId: item.key,
                materialUnit: item.unit
              }
            })
          }
          delete materialsGroup[index].dataSource
          delete materialsGroup[index].skuMaterials
        })
        // console.log(this.materialsGroup)
        // 保存
        if (this.type === undefined) {
          this.getFormData().then(() => {
            const params = {
              sku: Object.assign(this.skuInfoData, {
                ...this.skuData,
                catId: this.skuData.catId
                  ? this.skuData.catId.slice(-1).join('')
                  : '',
                skuType: 'SPRING'
              }),
              pics: [...this.pics],
              custInfo: Object.assign(this.custInfoData || {}, {
                ...this.custInfo,
                custId: this.custInfo.custId ? this.custInfo.custId : ''
              }),
              springInfo: Object.assign(this.springInfoData || {}, {
                springType: this.springVal,
                ...this.springInfo
              }),
              attrVals: [...this.attrVals],
              crafts: this.crafts.map(item => {
                return {
                  ...item,
                  productCraftCode: item.productCraftCode,
                  productCraftId: item.productCraftId,
                  defaultCraft: item.defaultCraft,
                  productCraftName: item.inputVal
                }
              }),
              materialsGroup: [...materialsGroup]
            }
            // console.log(params)
            // 添加商品列表
            goodsSkuUpload.call(this, params)
          })
          return
        }
        // 设置工艺和BOM
        if (this.type === 0) {
          // 保存
          const params = {
            crafts: this.crafts.map(item => {
              return {
                productCraftCode: item.productCraftCode,
                productCraftId: item.productCraftId,
                defaultCraft: item.defaultCraft,
                productCraftName: item.inputVal
              }
            }),
            materialsGroup: [...materialsGroup],
            basePrice: this.price,
            skuId: this.skuId
          }
          // console.log(params)
          // 添加商品列表
          setBomAndCraft.call(this, params)
          return
        }
        // 选择工艺和BOM
        if (this.type === 1) {
          const data = []
          const materialsGroup = this.materialsGroup.filter(
            item => item.defaultMaterials === true
          )[0]
          const crafts = this.crafts.filter(
            item => item.defaultCraft === true
          )[0]
          if (materialsGroup) {
            data.push({
              defaultMaterials: true,
              groupName: materialsGroup.groupName,
              id: materialsGroup.id
            })
          }
          if (crafts) {
            data.push({
              defaultCraft: true,
              inputVal: crafts.inputVal,
              id: crafts.id
            })
          }
          this.loading = false
          this.$message.success('设置成功')
          this.$emit('isDrawer', false)
          this.$emit('setDispatchInfo', data)
        }
      }
      if (this.activeTab === '3') {
        postBomAndCraftPrices(
          this.setSkuId,
          this.getPrice,
          this.getSpriceData
        ).then(res => {
          if (res.data.code === 0) {
            this.loading = false
            this.$message.success('修改成功')
            this.$emit('isDrawer', false)
            return false
          }
          this.$message.error(res.data.msg)
          this.$emit('isDrawer', true)
          this.loading = false
        })
      }
    },
    // 客户详情switch
    onChangeCustInfo(value) {
      this.checkedSwitch = value
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
    // 弹簧种类 $emit
    springType(val) {
      // console.log(val)
      if (val === undefined) {
        this.getSpringType = false
        this.springVal = undefined
        return
      }
      this.springVal = val
      this.getSpringType = true
    },
    // Upload
    propsFileList(val) {
      this.pics = val
    },
    // 产品类别非0选中
    changeSpringType(val) {
      this.getSpringType = false
      // console.log(val)
    },
    // 工艺详情Data
    craftData(val) {
      this.crafts = [...val]
    },
    // BOM详情
    bomData(val) {
      this.materialsGroup = [...val]
    },
    // 产品详情子组件接受分类属性ID数组
    classCatObj(val) {
      this.classCatObjId = val.id
    },
    // FormData
    async getFormData() {
      // 产品详情FormData
      this.$refs.goodsInfoForm.goodsInfoForm.validateFields((err, values) => {
        if (!err) {
          // console.log(values)
          this.skuData = values
        }
      })
      // 客户详情FormData
      if (this.$refs.custInfoForm) {
        this.$refs.custInfoForm.custInfoForm.validateFields((err, values) => {
          if (!err) {
            // console.log(values)
            this.custInfo = values
          }
        })
      }
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
        cz: this.skuInfoData.cz,
        drawNum: this.skuInfoData.drawNum,
        drawVersion: this.skuInfoData.drawVersion,
        spec: this.skuInfoData.spec,
        unit: this.skuInfoData.unit || '只',
        gateway: this.skuInfoData.gateway,
        standard: this.skuInfoData.standard,
        weight: this.skuInfoData.weight + '' || undefined,
        remark: this.skuInfoData.remark,
        bmcl: this.skuInfoData.bmcl,
        productSpringType: this.springInfoData.springType
      })
      // 客户详情FormData
      this.$refs.custInfoForm &&
        this.$refs.custInfoForm.custInfoForm.setFieldsValue({
          custId: this.custInfoData ? this.custInfoData.custId : undefined,
          custDrawNum: this.custInfoData ? this.custInfoData.custDrawNum : '',
          custDrawVersion: this.custInfoData
            ? this.custInfoData.custDrawVersion
            : '',
          custSkuCode: this.custInfoData ? this.custInfoData.custSkuCode : '',
          custMaterialNum: this.custInfoData
            ? this.custInfoData.custMaterialNum
            : '',
          custMaterialName: this.custInfoData
            ? this.custInfoData.custMaterialName
            : '',
          custCz: this.custInfoData ? this.custInfoData.custCz : '',
          custBmcl: this.custInfoData ? this.custInfoData.custBmcl : '',
          custSkuSpec: this.custInfoData ? this.custInfoData.custSkuSpec : '',
          custRemark: this.custInfoData ? this.custInfoData.custRemark : ''
        })
      // 弹簧属性FormData
      this.$refs.productAttrForm &&
        this.$refs.productAttrForm.productAttrForm.setFieldsValue({
          gcdj: this.springInfoData.gcdj,
          xj: this.springInfoData.xj + '',
          wj: this.springInfoData.wj + '',
          zygd: this.springInfoData.zygd + '',
          zqs: this.springInfoData.zqs + '',
          cz: this.springInfoData.cz,
          ybgd: this.springInfoData.ybgd + '',
          gzgd: this.springInfoData.gzgd + '',
          yxqs: this.springInfoData.yxqs + '',
          lz: this.springInfoData.lz + '',
          xx: this.springInfoData.xx,
          lxj: this.springInfoData.lxj + '',
          zkcd: this.springInfoData.zkcd + '',
          nj: this.springInfoData.nj + '',
          hd: this.springInfoData.hd + '',
          bs: this.springInfoData.bs + '',
          cs: this.springInfoData.cs + '',
          yl: this.springInfoData.yl + '',
          gd: this.springInfoData.gd + '',
          zdbxl: this.springInfoData.zdbxl + '',
          xrb: this.springInfoData.xrb + ''
        })
    }
  },
  watch: {
    goodsViewInfo: {
      handler(val) {
        // console.log(val)
        if (Object.keys(val).length) {
          // sku
          this.skuInfoData = val.sku
          this.setSkuId = this.skuInfoData.id
          // cust
          this.custInfoData = val.custInfo || null
          val.custInfo
            ? (this.checkedSwitch = true)
            : (this.checkedSwitch = false)
          // custName
          this.custName = val.cust ? val.cust.custShortName : undefined
          // spring
          this.springInfoData = val.springInfo || {}
          // springType
          this.springVal = val.springInfo
            ? val.springInfo.springType
            : undefined
          // PIC
          this.picInfoData = val.pics
          // 分类属性
          this.classAttrInfoData = val.attrVals
          this.classCatId = val.sku.catId
          // 工艺详情
          this.craftsInfoData = val.crafts
          // 原材料
          this.materialsGroupInfoData = val.materialsGroup || []
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
    'cust-info': CustInfoForm,
    'class-attr': ClassAttrForm,
    'spring-attr': SpringAttrForm,
    'product-upload': ProductUpload,
    'craft-info': CraftInfo,
    'bom-info': BomInfo,
    'price-info': PriceTab
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
