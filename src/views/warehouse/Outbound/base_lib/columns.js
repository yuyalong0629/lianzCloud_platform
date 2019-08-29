export const columns = [
  {
    title: '发货单号',
    dataIndex: 'applyCode',
    scopedSlots: { customRender: 'applyCode' }
  },
  {
    title: '客户',
    dataIndex: 'toName'
  },
  {
    title: '发货仓库',
    dataIndex: 'warehouse',
    scopedSlots: { customRender: 'warehouse' }
  },
  {
    title: '收货人',
    dataIndex: 'oaddresseeName'
  },
  {
    title: '联系方式',
    dataIndex: 'ophone'
  },
  {
    title: '地址',
    dataIndex: 'oaddress'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  }
]

export const columnsDetail = [
  {
    title: '销售单号',
    dataIndex: 'relateOrderCode'
    // scopedSlots: { customRender: 'applyId' }
  },
  {
    title: '订单数量',
    dataIndex: 'relateOrderSkuCount'
  },
  // {
  //   title: '已发数量'
  //   // dataIndex: 'applyCode'
  // },
  {
    title: '本次数量',
    dataIndex: 'assignCount'
  },
  {
    title: '产品编号',
    dataIndex: 'fromSkuInfo.code'
  },
  {
    title: '产品名称',
    dataIndex: 'fromSkuInfo.name'
  },
  {
    title: '产品规格',
    dataIndex: 'fromSkuInfo.spec'
  }
]
