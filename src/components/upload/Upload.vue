<template>
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
      <div v-if="fileList.length < 10">
        <a-icon type="plus" />
        <div class="ant-upload-text">Upload</div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'component_name',
  data() {
    return {
      previewVisible: false,
      previewImage: '',
      // url
      fileList: [],
      headers: {
        'AUTH-TOKEN': localStorage.getItem('ACCESS_TOKEN'),
        companyId: localStorage.getItem('companyId')
      },
      propsFileList: [],
      count: 0
    }
  },
  props: {
    picInfoData: {
      type: Array,
      default: []
    }
  },
  methods: {
    // upload
    handleCancel() {
      this.previewVisible = false
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    async handleChange({ file, fileList }) {
      this.fileList = await fileList
      console.log(this.fileList)
      this.count++
      if (this.count === 3) {
        this.propsFileList = []
        this.fileList.forEach(item => {
          console.log(item)
          if (item.response) {
            this.propsFileList.push({
              picUrl: item.response.data
            })
          } else {
            this.propsFileList.push({
              ...item
            })
          }
        })
        this.$emit('propsFileList', this.propsFileList)
        this.count = 0
      }
    }
  },
  watch: {
    picInfoData: {
      handler(val) {
        if (val.length) {
          console.log(val)
          this.fileList = []
          val.forEach(item => {
            this.fileList.push({
              ...item,
              url: item.picUrl,
              uid: Math.floor(Math.random() * 100),
              name: 'xxx.png'
            })
          })
          console.log(this.fileList)
          this.$emit(
            'propsFileList',
            this.fileList.map(item => {
              return {
                ...item
              }
            })
          )
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
</style>