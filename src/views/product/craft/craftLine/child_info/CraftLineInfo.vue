<template>
  <div class="carftLine-info">
    <prompt-title @isDisabled="isDisabled" @isDelete="isDelete"></prompt-title>
    <a-row>
      <a-col :span="24">
        <h3 class="carftLine-title">工艺路线</h3>
      </a-col>
      <a-col :span="24">
        <a-form :form="processFormInfo" layout="horizontal" hideRequiredMark>
          <a-row>
            <a-col :span="8">
              <a-form-item
                label="工艺编码"
                :class="{labelColor: isLabelColor}"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-input
                  v-if="disabled"
                  disabled="disabled"
                  v-decorator="['craftLineCode']"
                  placeholder="默认带出"
                />
                <template v-else="disabled">{{getCraftLineInfo.groupCode}}</template>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="工艺名称"
                :class="{labelColor: isLabelColor}"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-input v-if="disabled" v-decorator="['craftLineName']" placeholder="请输入工艺名称" />
                <template v-else="disabled">{{getCraftLineInfo.groupName}}</template>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="状态"
                :class="{labelColor: isLabelColor}"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-switch
                  v-if="disabled"
                  v-decorator="['craftLineStatus', { initialValue: false, valuePropName: 'checked' }]"
                />
                <template v-else="disabled">{{getCraftLineInfo.status ? '已发布' : '未发布'}}</template>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-col>
    </a-row>
    <a-row style="marginBottom: 50px;">
      <a-col :span="24">
        <h3 class="carftLine-title">工序列表</h3>
      </a-col>
      <a-col :span="24" style="margin-bottom: 15px;">
        <!-- Steps -->
        <div class="craftline-box">
          <a-steps :current="craftData.length" size="small">
            <a-step v-for="(item, index) in craftData" :key="index" :title="item.name">
              <a-icon
                v-show="disabled"
                class="step-icon"
                type="close-circle"
                slot="icon"
                @click="onStepDelete(index)"
              />
            </a-step>
          </a-steps>
          <a-button
            style="width: 100%; margin-top: 16px; margin-bottom: 8px"
            v-show="disabled"
            type="dashed"
            icon="plus"
            @click.stop="onTabAdd"
          >添加工艺流程</a-button>
        </div>
        <!-- 抽屉 -->
        <a-drawer
          :destroyOnClose="true"
          :title="false"
          width="300"
          :closable="false"
          @close="onChildrenDrawerClose"
          :visible="childrenDrawer"
        >
          <craft-drawer @acceptChildDrawer="acceptChildDrawer" @craftDrawerData="craftDrawerData" />
        </a-drawer>
      </a-col>
      <a-col :span="24">
        <a-table
          :rowKey="record => Math.random(record.key)"
          :columns="columnsInfo"
          :dataSource="data"
          :pagination="false"
        >
          <template slot="optBook" slot-scope="text, record, index">
            <a v-if="text" :href="text">文件</a>
            <a v-else="text">无</a>
          </template>
        </a-table>
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
          zIndex: 100
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
import CraftDrawer from './CraftDrawer'
import { mixinBasic, mixinIsEdit } from '@/components/tools/mixin/mixin'
import { columnsInfo } from '../basic_lib/column'
import {
  craftLineAdd,
  craftLineUpdate,
  craftLineDelete
} from '../basic_lib/index'

export default {
  name: 'CarftLineInfo',
  mixins: [mixinBasic, mixinIsEdit],
  data() {
    return {
      processFormInfo: this.$form.createForm(this),
      data: [],
      craftData: [],
      columnsInfo,
      craftProcessIds: '', // 工序流程图ID集合
      getCraftLineInfo: {},
      childrenDrawer: false
    }
  },
  props: {
    craftLineInfo: {
      type: Object,
      default: {}
    }
  },
  methods: {
    // 提交
    onSubmit(e) {
      e.preventDefault()
      this.getFormData(null, craftLineAdd)
    },
    // stpe
    onStepDelete(key) {
      this.craftData.splice(key, 1)
      this.data = [...this.craftData]
    },
    // 保存修改
    onSave(e) {
      e.preventDefault()
      this.getFormData(this.getCraftLineInfo.id, craftLineUpdate)
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
      craftLineDelete.call(this, [this.getCraftLineInfo.id])
    },
    // Form Data
    getFormData(id, postFormData) {
      this.data.forEach(e => {
        if (e.key) {
          this.craftProcessIds += `${e.key},`
        }
        if (e.id) {
          this.craftProcessIds += `${e.id},`
        }
      })
      this.processFormInfo.validateFields((err, values) => {
        if (!err) {
          const params = {
            // groupCode: values.craftLineCode, // code
            id,
            craftProcessIds: this.craftProcessIds.slice(0, -1), // 工序流程图ID
            groupName: values.craftLineName, // 工艺名称
            status: values.craftLineStatus // 状态
          }
          postFormData.call(this, params)
          // this.craftProcessIds = []
        }
      })
    },
    setFormData() {
      this.processFormInfo.setFieldsValue({
        // groupCode: values.craftLineCode, // code
        craftLineName: this.getCraftLineInfo.groupName, // 工艺名称
        craftLineStatus: this.getCraftLineInfo.status // 状态
      })
    },
    onTabAdd(key) {
      this.childrenDrawer = true
    },
    // 关闭抽屉
    onChildrenDrawerClose() {
      this.childrenDrawer = false
    },
    // 抽屉关闭回调
    acceptChildDrawer(val) {
      this.childrenDrawer = val
    },
    // drawer data
    craftDrawerData(val) {
      if (val) {
        this.craftData = [...this.craftData, val]
        this.data = [...this.craftData]
      }
    }
  },
  watch: {
    craftLineInfo: {
      handler(val) {
        this.getCraftLineInfo = val
        if (val.map && val.craftProcessIds) {
          // 通过工艺ID获取所对应的工序对象
          val.craftProcessIds.split(',').forEach((e, index) => {
            const newData = Object.values(val.map).filter(
              item => item.id === e
            )[0]
            console.log(e)
            console.log(newData)
            this.craftData[index] = newData
            this.data = [...this.craftData]
          })
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
    'prompt-title': PromptTitle,
    'craft-drawer': CraftDrawer
  }
}
</script>
<style lang="less" scoped>
@import '~styles/variable.less';

.carftLine-info {
  .carftLine-title {
    margin-bottom: 16px;
    .h3_title();
  }
  .labelColor {
    /deep/ .ant-form-item-label label {
      .labelColor();
    }
  }
  .craftline-box {
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 10px 5px 0;
    margin: 10px 0;
    min-height: 50px;
    position: relative;
    .ant-steps {
      overflow-x: scroll;
      /deep/ .ant-steps-item-icon {
        .ant-steps-icon {
          color: #f00;
          font-size: 16px;
        }
      }
      .ant-steps-item {
        flex: none;
        padding: 5px 10px 20px 10px;
        &:last-child {
          min-width: 30px;
          padding-right: 0px;
        }
        /deep/ .ant-steps-item-content {
          padding-right: 50px;
        }
      }
    }
  }
}
</style>
