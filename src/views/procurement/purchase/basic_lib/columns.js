export const columns = [
  {
    title: '采购编号',
    dataIndex: 'factoryOdNumber',
    scopedSlots: { customRender: 'factoryOdNumber' },
    fixed: 'left'
  },
  {
    title: '供应商简称',
    dataIndex: 'supplierName'
  },
  {
    title: '材料名称',
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
    title: '数量',
    dataIndex: 'odNumber'
  },
  {
    title: '总价',
    dataIndex: 'odTotalPrice'
  },
  {
    title: '交期',
    dataIndex: 'odRequireDueDate'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    width: '5%'
  }
]
