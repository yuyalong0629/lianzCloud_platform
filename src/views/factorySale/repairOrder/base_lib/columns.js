export const columns = [
  {
    title: '订单编号',
    dataIndex: 'odOrderNumber',
    scopedSlots: { customRender: 'odOrderNumber' }
    // width: '15%'
  },
  {
    title: '产品编码',
    dataIndex: 'code'
    // scopedSlots: { customRender: 'code' },
    // width: '15%'
  },
  {
    title: '产品名称',
    dataIndex: 'name'
    // scopedSlots: { customRender: 'odSkuName' },
    // width: '10%'
  },
  {
    title: '规格',
    dataIndex: 'spec'
    // width: '10%'
  },
  {
    title: '材质',
    dataIndex: 'cz'
    // width: '10%'
  },
  {
    title: '单位',
    dataIndex: 'unit'
    // width: '10%'
  },
  {
    title: '数量',
    dataIndex: 'number'
    // width: '10%'
  },
  {
    title: '交期',
    dataIndex: 'odRequireDueDate',
    scopedSlots: { customRender: 'odRequireDueDate' }
    // width: '10%'
  },
  {
    title: '状态',
    dataIndex: 'statusNum',
    scopedSlots: { customRender: 'status' },
    width: '5%'
  }
]

export const detailColumns = [
  {
    title: '销售单号',
    dataIndex: 'relateOrderCode'
    // width: '25%'
  },
  {
    title: '客户名称',
    dataIndex: 'relateCustName'
    // width: '25%'
  },
  {
    title: '数量',
    dataIndex: 'odNumber'
    // width: '25%'
  },
  {
    title: '收货方式',
    dataIndex: 'receiveWay',
    scopedSlots: { customRender: 'receiveWay' }
    // width: '25%'
  }
]
