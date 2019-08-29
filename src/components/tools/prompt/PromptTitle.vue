<template>
  <div class="prompt-title">
    <a-row>
      <a-col :span="18">
        <h3 class="prompt-h3">{{ getPromptTitle.title }}</h3>
      </a-col>
      <a-col :span="6" class="prompt-wrapper" v-if="getPromptTitle.isEdit">
        <span
          class="prompt-edit"
          @click="onHandlePromptEdit"
          v-show="getDetailPermission.includes('UPDATE')"
        >
          <a-icon class="eidt-icon" type="edit" />
          <span>{{editTitle}}</span>
        </span>
        <span
          class="prompt-delete"
          @click="onHandlePromptDelete"
          v-show="getDetailPermission.includes('DELETE')"
        >
          <a-icon class="delete-icon" type="delete" />
          <span>删除</span>
        </span>
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  name: 'prompt-title',
  data() {
    return {
      editTitle: '编辑'
    }
  },
  methods: {
    onHandlePromptEdit() {
      // console.log(this.isEdit)
      if (this.editTitle === '编辑') {
        this.editTitle = '取消'
        this.$emit('isDisabled', false)
        return
      }
      this.$emit('isDisabled', true)
      this.editTitle = '编辑'
    },
    onHandlePromptDelete() {
      const that = this
      this.$confirm({
        title: '删除',
        content: '您确认要删除？',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          that.$emit('isDelete', false)
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    }
  },
  computed: {
    getPromptTitle() {
      return this.$store.state.promptTitle
    },
    getDetailPermission() {
      return this.$store.state.detailPermission
    }
  }
}
</script>
<style lang="less" scoped>
.prompt-title {
  border-bottom: 1px solid #ebedf0;
  min-height: 40px;
  margin-bottom: 10px;
  .prompt-wrapper {
    display: flex;
    justify-content: flex-end;
    .prompt-edit {
      margin: 0 12px;
      cursor: pointer;
      .eidt-icon {
        color: green;
        margin-right: 4px;
      }
    }
    .prompt-delete {
      cursor: pointer;
      .delete-icon {
        color: #f00;
        margin-right: 4px;
      }
    }
  }
}
</style>
