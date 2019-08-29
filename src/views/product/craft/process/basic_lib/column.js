export const columns = [
  {
    title: '工序编码',
    dataIndex: 'code',
    width: '20%',
    scopedSlots: { customRender: 'code' }
  },
  { title: '工序名称', width: '20%', dataIndex: 'name' },
  // { title: '是否质检', width: '16%', dataIndex: 'qc' },
  { title: '标准工时', width: '20%', dataIndex: 'standardHours' },
  { title: '公时计费', width: '20%', dataIndex: 'timeBilling' },
  { title: '备注', width: '20%', dataIndex: 'remark' }
]
