<template>
  <a-row>
    <a-upload
      :action="url"
      :data="{'bizType': 'ORDER'}"
      :headers="headers"
      listType="picture-card"
      :fileList="fileList"
      @preview="handlePreview"
      @change="handleChange"
      :disabled="editInfo && !editDetial || selectAddress"
    >
      <div>
        <a-icon type="plus" />
        <div class="ant-upload-text">Upload</div>
      </div>
      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
        <!-- <uploadShow :fileList="fileList" :editInfo="editInfo" :editDetial="editDetial"></uploadShow> -->
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
    </a-upload>
  </a-row>
</template>

<script>
import uploadShow from '../other/uploadShow'
const url = '/api/ic/user/file/uploadFile'
export default {
  props: {
    file: {
      type: Array
    },
    editInfo: {
      type: Boolean,
      required: true,
      default: false
    },
    editDetial: {
      type: Boolean,
      required: true,
      default: false
    },
    selectAddress: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  components: {
    uploadShow
  },
  data() {
    return {
      fileList: this.file,
      url,
      headers: {
        'AUTH-TOKEN': localStorage.getItem('ACCESS_TOKEN'),
        companyId: localStorage.getItem('companyId')
      },
      uploadFile: [],
      previewVisible: false,
      previewImage: ''
    }
  },
  methods: {
    // 图片上传相关
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    // 图片上传/修改时的操作
    handleChange({ fileList }) {
      this.fileList = fileList
      const uploadFile = []
      for (const i in fileList) {
        if (fileList[i].response) {
          uploadFile.push(fileList[i].response.data)
        } else {
          uploadFile.push(fileList[i].url)
        }
      }
      this.uploadFile = uploadFile
    },
    handleCancel() {
      this.previewVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
// /deep/.ant-upload-list-picture-card .ant-upload-list-item-thumbnail {
//   display: block;
//   width: 90%;
//   height: 90%;
//   position: static;
// }
// /deep/.ant-upload-list-picture-card .ant-upload-list-item-thumbnail img {
//   display: block;
//   width: 80%;
//   height: 80%;
//   position: static;
// }
// /deep/.ant-upload-list-picture-card .ant-upload-list-item-name {
//   display: block;
// }
// /deep/.ant-upload-disabled {
//   display: none;
// }
</style>
