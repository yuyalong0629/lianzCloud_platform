<template>
  <div class="examination">
    <div class="examination-search" v-show="key === 4">
      <a-form layout="horizontal" style="margin-bottom:20px">
        <a-row>
          <a-col :span="22">
            <a-row>
              <a-col :span="8">
                <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="所属应用">
                  <a-select
                    class="inputWidth"
                    placeholder="请选择所属应用"
                    :allowClear="true"
                    @change="(val)=>inputChange(val,'bizType')"
                  >
                    <a-select-option v-for="item in useApp" :key="item.value">{{item.label}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="创建时间">
                  <a-range-picker
                    class="inputWidth"
                    format="YYYY/MM/DD"
                    @change="(dates, dateStrings)=>inputChange(dateStrings,'date')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="状态">
                  <a-select
                    class="inputWidth"
                    :allowClear="true"
                    placeholder="请选择审批状态"
                    @change="(val)=>inputChange(val,'processSerarchType')"
                  >
                    <a-select-option v-for="item in status" :key="item.value">{{item.label}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <Animation name="fadeIn">
              <a-row v-show="advanced">
                <a-col :span="8">
                  <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="创建人">
                    <a-select
                      mode="multiple"
                      class="inputWidth"
                      :allowClear="true"
                      placeholder="请选择创建人"
                      @change="(val)=>inputChange(val,'processStarters')"
                    >
                      <a-select-option v-for="item in founder" :key="item.id">{{item.name}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="处理时间">
                    <a-range-picker class="inputWidth" format="YYYY/MM/DD" />
                  </a-form-item>
                </a-col>
              </a-row>
            </Animation>
          </a-col>
          <a-col :span="2">
            <a-form-item style="text-align:center">
              <span style="cursor: pointer;" @click="toggleAdvanced">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'caret-up' : 'caret-down'" />
              </span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="examination-title">
      <span>标题</span>
      <span>内容</span>
      <span>时间</span>
      <span>操作</span>
      <div v-show="key === 2" @click="allRead">全部已阅</div>
    </div>
    <div class="examination-content">
      <div
        class="examination-content-list"
        v-infinite-scroll="handleInfiniteOnLoad"
        :infinite-scroll-disabled="busy"
        :infinite-scroll-distance="10"
        :infinite-scroll-immediate-check="false"
      >
        <a-list :dataSource="dataList">
          <a-list-item slot="renderItem" slot-scope="item">
            <div class="examination-content-list-item">
              <div class="list-item-title">
                <span>{{item.foRunProcess.processStarterName}}</span>
                {{item.foRunProcess.processName}}
              </div>
              <div class="list-item-content">
                <ul>
                  <li
                    v-for="(item,index) in item.foRunProcess.digest.split('/')"
                    :key="index"
                  >{{item}}</li>
                </ul>
              </div>
              <div class="list-item-time">{{item.foRunProcess.processStarttime | formatDate}}</div>
              <div class="list-item-action">
                <template v-if="key === 1">
                  <a-button type="primary" ghost @click="detialView(item,'RUN')">进入审批</a-button>
                </template>
                <template v-if="key === 2">
                  <a-button
                    type="primary"
                    v-if="item.foRunProcessDtoType === 'WAITE_READ'"
                    @click="detialView(item,'noRead')"
                  >未阅</a-button>
                  <a-button
                    type="primary"
                    @click="detialView(item)"
                    v-if="item.foRunProcessDtoType === 'READED'"
                  >已阅</a-button>
                </template>
                <template v-if="key === 3">
                  <a href="javascript:;" @click="detialView(item)">详情</a>
                </template>
                <template v-if="key === 4">
                  <a-button
                    type="primary"
                    v-if="item.foRunProcessDtoType === 'WAITE_READ'"
                    @click="detialView(item,'noRead')"
                  >未阅</a-button>
                  <a-button
                    type="primary"
                    v-if="item.foRunProcessDtoType === 'READED'"
                    @click="detialView(item)"
                  >已阅</a-button>
                  <a-button
                    type="primary"
                    ghost
                    v-if="item.foRunProcessDtoType==='RUNING'"
                    @click="detialView(item,'RUN')"
                  >进入审批</a-button>
                  <a-button
                    type="danger"
                    ghost
                    v-if="item.foRunProcessDtoType==='NO_PASS'"
                    @click="detialView(item)"
                  >审批不通过</a-button>
                  <a-button
                    type="primary"
                    ghost
                    v-if="item.foRunProcessDtoType==='PASS'"
                    @click="detialView(item)"
                  >审批通过</a-button>
                </template>
              </div>
            </div>
          </a-list-item>
        </a-list>
        <div v-if="loadingCompony && !busy" class="demo-loading-container">
          <a-spin />
        </div>
      </div>
    </div>
    <a-drawer
      destroyOnClose
      :visible="visible"
      :closable="false"
      :width="1040"
      :wrapStyle="{overflow: 'auto',paddingBottom: '108px'}"
    >
      <approvalInfo @onClose="onClose" :detial="propItem" :showAction="showAction"></approvalInfo>
    </a-drawer>
  </div>
</template>

<script>
import Animation from '@/assets/common/Animation'
import approvalInfo from '../child_lib/approvalInfo'
import infiniteScroll from 'vue-infinite-scroll'
import { status, useApp } from './menu'
import api from '@/api/index'
import { get, postJson } from '@/api/axios'
import Bus from '@/Bus.js'
export default {
  directives: { infiniteScroll },
  components: {
    Animation,
    approvalInfo
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      key: null,
      advanced: false,
      visible: false,
      dataList: [],
      dataListSize: 0,
      currentPage: 1,
      pageSize: 20,
      busy: true,
      loadingCompony: false,
      propItem: {},
      status: status,
      useApp: useApp,
      founder: [],
      showAction: false,
      dto: {
        bizType: 0,
        procesEndTime: '',
        procesStartTime: '',
        processSerarchType: -1,
        processStarters: []
      },
      timer: ''
    }
  },
  created() {
    if (this.$route.query.key) {
      this.key = Number(this.$route.query.key)
    }
    if (Number(this.$route.query.key) === 4) {
      this.getFounder()
    }
  },
  methods: {
    handleInfiniteOnLoad() {
      if (this.dataList.length >= this.dataListSize && this.dataListSize !== 0) {
        this.loadingCompony = false
        this.busy = true
      } else {
        this.getList(this.key)
        this.currentPage += 1
        this.busy = false
      }
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    getList(key) {
      switch (key) {
        case 1:
          this.getItem(api.getReviewProcess)
          break
        case 2:
          this.getItem(api.getProcessListToBeRead, 'READ')
          break
        case 3:
          this.getItem(api.foRunProcessByStarter)
          break
        case 4:
          this.getSearchResult()
          break
      }
    },
    getItem(url, processSerarch) {
      this.loadingCompony = true
      get(url, { currentPage: this.currentPage, pageSize: this.pageSize, processSerarch }).then(res => {
        if (res.data.code === 0) {
          this.dataListSize = Number(res.data.data.total)
          this.loadingCompony = false
          this.dataList = this.dataList.concat(res.data.data.records)
        }
      })
    },
    // 查看审批详情 打开抽屉
    detialView(item, type) {
      if (type === 'noRead') {
        get(api.readProcess + `?runProcessIds=${item.foRunProcess.id}`).then(res => {
          if (res.data.code === 0) {
            this.currentPage = 1
            this.dataList = []
            Bus.$emit('ToObtain', true)
            this.getList(this.key)
          }
        })
        item.foRunProcessDtoType = 'READED'
      }
      if (type === 'RUN') {
        this.showAction = false
      } else {
        this.showAction = true
      }
      this.propItem = item
      this.visible = true
    },
    // 全部已读
    allRead() {
      const data = this.dataList
      let runProcessIds = []
      data.forEach(item => {
        runProcessIds.push(`runProcessIds=${item.foRunProcess.id}`)
      })
      runProcessIds = runProcessIds.join('&')
      get(api.readProcess + `?${runProcessIds}`).then(res => {
        if (res.data.code === 0) {
          this.currentPage = 1
          this.dataList = []
          this.getList(this.key)
          Bus.$emit('ToObtain', true)
        }
      })
    },
    // 关闭审批详情抽屉
    onClose(val) {
      if (val) {
        this.dataList = []
        this.currentPage = 1
        this.getList(this.key)
      }
      this.visible = false
    },
    // 获取创建人
    getFounder() {
      get(api.getCompanyAllUsers).then(res => {
        if (res.data.code === 0) {
          this.founder = this.founder.concat(res.data.data)
        }
      })
    },
    // 按条件搜索
    inputChange(val, type) {
      this.dataList = []
      const dto = this.dto
      if (type === 'date') {
        dto.procesStartTime = val[0]
        dto.procesEndTime = val[1]
      } else {
        dto[type] = val >= 0 ? val : -1
      }
      if (this.timer !== '') {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.getSearchResult(1)
      }, 1000)
    },
    getSearchResult(currentPage) {
      const dto = this.dto
      dto.currentPage = currentPage || this.currentPage
      dto.pageSize = this.pageSize
      postJson(api.searchRunProcess, dto).then(res => {
        if (res.data.code === 0) {
          this.dataListSize = Number(res.data.data.total)
          this.loadingCompony = false
          this.dataList = this.dataList.concat(res.data.data.records)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~styles/variable.less";

.inputWidth {
  .inputWidth();
}

.examination {
  padding: 0 30px;
  &-title {
    position: relative;
    display: flex;
    flex-direction: row;
    font-size: 14px;
    color: #999999;
    border-bottom: 1px dashed #eeeeee;
    & > span {
      flex: 15%;
      padding: 10px;
      &:first-child {
        flex: 30%;
      }
      &:nth-child(2) {
        flex: 40%;
      }
    }
    & > div {
      position: absolute;
      right: 10px;
      top: 10px;
      color: #007aff;
      cursor: pointer;
    }
  }
  &-content {
    &-list-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 1px solid #eeeeee;
      font-size: 14px;
      color: #333333;
      width: 100%;
      & > div {
        flex: 15%;
        padding: 10px;
        &:first-child {
          flex: 30%;
          & > span {
            display: inline-block;
            width: 50px;
            height: 50px;
            background-color: #5077d1;
            text-align: center;
            line-height: 50px;
            border-radius: 50%;
            color: #fff;
            margin-right: 10px;
          }
        }
        &:nth-child(2) {
          flex: 40%;
          & > ul > li {
            padding: 3px 0;
            &:last-child {
              font-size: 16px;
              color: #ff9436;
            }
          }
        }
      }
      .list-item-action {
        & > button {
          border-radius: 15px;
        }
      }
    }
  }
}
/deep/.ant-list-split .ant-list-item {
  border: none !important;
  padding: 0 !important;
}
.demo-infinite-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px 8px 10px;
  height: 84vh;
}
.demo-loading-container {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}
</style>
