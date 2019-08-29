export const columns = [
  {
    title: '所属分类',
    dataIndex: 'catname'
  },
  {
    title: '属性名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  { title: '属性编码', dataIndex: 'code' },
  { title: '备注', dataIndex: 'remark' }
]
