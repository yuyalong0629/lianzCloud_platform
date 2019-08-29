export const columns = [
  {
    title: '订单编码',
    dataIndex: 'supplierOdNumber',
    scopedSlots: { customRender: 'supplierOdNumber' }
  },
  {
    title: '产品编码',
    dataIndex: 'code'
    // scopedSlots: { customRender: 'code' },
  },
  {
    title: '产品名称',
    dataIndex: 'name'
  },
  {
    title: '规格',
    dataIndex: 'spec'
  },
  {
    title: '材质',
    dataIndex: 'cz'
  },
  {
    title: '单位',
    dataIndex: 'unit'
  },
  {
    title: '数量',
    dataIndex: 'odNumber'
  },
  {
    title: '交期',
    dataIndex: 'odRequireDueDate',
    scopedSlots: { customRender: 'odRequireDueDate' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    width: '5%'
  }
]
