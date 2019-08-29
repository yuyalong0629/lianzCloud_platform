export const columns = [
  {
    title: '订单编号',
    dataIndex: 'odOrderNumber',
    scopedSlots: { customRender: 'odOrderNumber' }
  },
  {
    title: '产品编码',
    dataIndex: 'odSkuCode',
    scopedSlots: { customRender: 'odSkuCode' }
  },
  {
    title: '产品名称',
    dataIndex: 'odSkuName',
    scopedSlots: { customRender: 'odSkuName' }
  },
  {
    title: '规格',
    dataIndex: 'odSpec'
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
    title: '工艺确认',
    dataIndex: 'craft',
    scopedSlots: { customRender: 'craft' }
  },
  {
    title: '交期',
    dataIndex: 'odRequireDueDate',
    scopedSlots: { customRender: 'odRequireDueDate' }
  },
  {
    title: '状态',
    dataIndex: 'statusNum',
    scopedSlots: { customRender: 'status' },
    width: '5%'
  }
]
