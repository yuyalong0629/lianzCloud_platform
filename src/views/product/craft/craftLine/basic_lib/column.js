export const columns = [
  {
    title: '编码',
    dataIndex: 'code',
    width: '33%',
    scopedSlots: { customRender: 'code' }
  },
  { title: '名称', width: '33%', dataIndex: 'name' },
  { title: '状态', width: '33%', dataIndex: 'status', scopedSlots: { customRender: 'status' } }
]

// INFO
export const columnsInfo = [
  {
    title: '名称',
    dataIndex: 'name',
    width: '33%',
    scopedSlots: { customRender: 'name' }
  },
  // {
  //   title: '质检',
  //   dataIndex: 'qc',
  //   width: '25%',
  //   scopedSlots: { customRender: 'qc' }
  // },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '33%',
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '文件',
    dataIndex: 'optBook',
    width: '33%',
    scopedSlots: { customRender: 'optBook' }
  }
]
