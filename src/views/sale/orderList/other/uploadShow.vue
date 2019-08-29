<template>
  <a-row>
    <a-col :span="24">
      <a-row>
        <a-col :span="16">
          <a-form-item label="文件描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
            <template v-if="editInfo && !editDetial">
              <a-tooltip placement="top" :title="current.name">{{current.name}}</a-tooltip>
            </template>
            <a-input v-model="current.name" v-else />
          </a-form-item>
        </a-col>
        <a-col :sapn="1"></a-col>
        <a-col :span="7" style="line-height:39px;">
          <a-button @click="downloadIamge(current)">下载</a-button>
        </a-col>
      </a-row>
    </a-col>
    <a-col :span="24">
      <a-carousel dotsClass="slick-dots slick-thumb">
        <a slot="customPaging" slot-scope="props">
          <a-tooltip placement="bottom" :title="fileList[props.i].name">
            <img
              :src="fileList[props.i].url"
              @click="handleImg(props.i)"
              v-if="fileList[props.i].type==='img'"
            />
            <template v-else>
              <span
                v-if="fileList[props.i].type==='pdf'"
                class="fileType"
                @click="handleImg(props.i)"
              >
                <a-icon type="file-pdf" />
              </span>
              <span
                v-else-if="fileList[props.i].type==='word'"
                class="fileType"
                @click="handleImg(props.i)"
              >
                <a-icon type="file-word" />
              </span>
              <span
                v-else-if="fileList[props.i].type==='xlsx'"
                class="fileType"
                @click="handleImg(props.i)"
              >
                <a-icon type="file-excel" />
              </span>
              <span
                v-else-if="fileList[props.i].type==='ppt'"
                class="fileType"
                @click="handleImg(props.i)"
              >
                <a-icon type="file-ppt" />
              </span>
              <span v-else class="fileType" @click="handleImg(props.i)">
                <a-icon type="file" />
              </span>
            </template>
          </a-tooltip>
        </a>
        <div v-for="item in fileList" :key="item.url">
          <img :src="item.url" v-if="item.type==='img'" />
          <template v-else>
            <span v-if="item.type==='pdf'" class="fileType list-type">
              <a-icon type="file-pdf" />
            </span>
            <span v-else-if="item.type==='word'" class="fileType list-type">
              <a-icon type="file-word" />
            </span>
            <span v-else-if="item.type==='xlsx'" class="fileType list-type">
              <a-icon type="file-excel" />
            </span>
            <span v-else-if="item.type==='ppt'" class="fileType list-type">
              <a-icon type="file-ppt" />
            </span>
            <span v-else class="fileType list-type">
              <a-icon type="file" />
            </span>
          </template>
        </div>
      </a-carousel>
    </a-col>
  </a-row>
</template>

<script>
export default {
  props: {
    fileList: {
      type: Array
    },
    // 是否是新建
    editInfo: {
      type: Boolean,
      required: true,
      default: false
    },
    // 是否是编辑
    editDetial: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      current: this.fileList[0]
    }
  },
  methods: {
    handleImg(i) {
      this.current = this.fileList[i]
    },
    /**
     * @description 请求文件 将文件转换成Blob 然后创建一个a标签 用a标签的download进行下载
     */
    downloadIamge(item) {
      var xhr = new XMLHttpRequest()
      xhr.open('get', item.url, true)
      xhr.responseType = 'blob'
      xhr.onload = function () {
        if (this.status === 200) {
          var blob = this.response
          const it = document.createElement('a')
          it.download = item.name
          it.href = window.URL.createObjectURL(blob)
          it.style.display = 'none'
          it.click()
        }
      }
      xhr.send()
    }
  }
}
</script>

<style scoped>
.fileType {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
}
.list-type {
  width: 472px;
  height: 472px;
}
.fileType i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 26px;
  color: #666;
}
.list-type i {
  color: #1890ff;
  font-size: 80px;
}

/deep/ .ant-form-item-control,
/deep/.ant-form-item-children {
  width: 100% !important;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

/* For demo */
.ant-carousel >>> .slick-dots {
  height: auto;
  position: static;
}
.ant-carousel >>> .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  width: 100%;
  height: 100%;
}
.ant-carousel >>> .slick-thumb {
  bottom: -45px;
}
.ant-carousel >>> .slick-thumb li {
  width: 60px;
  height: 45px;
}
.ant-carousel >>> .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
.ant-carousel >>> .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
</style>
