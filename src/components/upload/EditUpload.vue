<template>
  <div class="upload">
    <a-upload
      action="/api/ic/user/file/uploadFile"
      listType="picture"
      :data="{'bizType': 'GOODS'}"
      :headers="headers"
      :showUploadList="false"
      @preview="handlePreview"
      @change="handleChange"
    >
      <a-button>
        <a-icon type="upload" />上传
      </a-button>
    </a-upload>
    <ul class="pic-list">
      <li v-for="item of previewInfo" :key="item.uid">
        <div class="pic-item">
          <img :src="item.response.data" @click="handlePreview(item.uid)" :alt="item.name" />
        </div>
        <div class="pic-info">
          <!-- <span>AAAA</span> -->
          <a-textarea
            placeholder="描述"
            style="height: 42px"
            @change="e => changeInfo(e.target.value, item.uid)"
            @pressEnter="e => onEnter(e.target.value, item.uid)"
          />
        </div>
        <a-icon class="pic-close" type="close" @click="onClose(item.uid)" />
      </li>
    </ul>
    <a-modal :visible="previewVisible" :footer="previewName" @cancel="handleCancel">
      <img alt="example" style="width: 100%;" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'EditUpload',
  data() {
    return {
      fileList: [],
      headers: {
        'AUTH-TOKEN': localStorage.getItem('ACCESS_TOKEN'),
        companyId: localStorage.getItem('companyId')
      },
      previewVisible: false,
      previewImage: '',
      previewName: '',
      previewInfo: [],
      count: 0
    }
  },
  methods: {
    handlePreview(uid) {
      console.log(uid)
      this.previewVisible = true
      const previewInfo = [...this.previewInfo]
      const target = previewInfo.filter(item => uid === item.uid)[0]
      if (target) {
        this.previewImage = target.response.data
        this.previewName = target.name
      }
    },
    handleChange({ file }) {
      this.count++
      if (this.count === 3) {
        this.previewInfo.push(file)
        console.log(this.previewInfo)
        this.count = 0
      }
    },
    handleCancel() {
      this.previewVisible = false
    },
    changeInfo(value, uid) {
      console.log(value)
      console.log(uid)
    },
    onEnter(value, uid) {
      console.log(value)
      console.log(uid)
    },
    onClose(uid) {
      const previewInfo = [...this.previewInfo]
      this.previewInfo = previewInfo.filter(item => uid !== item.uid)
    }
  }
}
</script>
<style lang="less" scoped>
.upload-list-inline /deep/ .ant-upload-list-item {
  float: left;
  width: 200px;
  margin-right: 8px;
}
.ant-modal-content /deep/ .ant-modal-body {
  padding: 40px;
}
.pic-list {
  li {
    float: left;
    padding: 18px 8px;
    margin: 8px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    height: 80px;
    min-width: 100px;
    position: relative;
    .pic-item {
      height: 100%;
      float: left;
      img {
        height: 100%;
      }
    }
    .pic-info {
      float: left;
      margin: 0 16px 0 8px;
      height: 48px;
    }
    .pic-close {
      position: absolute;
      right: 6px;
      top: 6px;
    }
  }
}
</style>
