export const columns = [
  {
    title: '入库单号',
    dataIndex: 'applyCode',
    scopedSlots: { customRender: 'applyCode' }
  },
  {
    title: '生产单号',
    dataIndex: 'code'
    // scopedSlots: { customRender: 'code' },
  },
  {
    title: '产品名称',
    dataIndex: 'name'
    // scopedSlots: { customRender: 'odSkuName' },
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
    title: '入库数量',
    dataIndex: 'inCount'
  },
  {
    title: '入库类型',
    dataIndex: 'instorageType',
    scopedSlots: { customRender: 'instorageType' }
  },
  {
    title: '紧急程度',
    dataIndex: 'requireLevel',
    scopedSlots: { customRender: 'requireLevel' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    width: 140
  }
]

export const columnsDetial = [
  {
    title: '销售单号',
    dataIndex: 'relateOrderCode'
  },
  {
    title: '客户编号',
    dataIndex: 'relateCustCode'
  },
  {
    title: '订单数量',
    dataIndex: 'odNumber'
  },
  {
    title: '入库数量',
    dataIndex: 'assignCount'
  }
]
