export const columns = [
  {
    title: '分类名称',
    dataIndex: 'name',
    width: '25%',
    scopedSlots: { customRender: 'name' }
  },
  { title: '分类编码', width: '25%', dataIndex: 'code' },
  { title: '创建时间', width: '25%', dataIndex: 'createTime', scopedSlots: { customRender: 'createTime' } },
  { title: '状态', width: '25%', dataIndex: 'status' }
]
