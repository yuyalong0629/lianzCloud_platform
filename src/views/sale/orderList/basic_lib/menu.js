// order 表格头部
export const columns = [
  {
    title: '订单编码',
    dataIndex: 'oorderNumber',
    scopedSlots: { customRender: 'oorderNumber' },
    fixed: 'left'
  },
  {
    title: '客户单号',
    dataIndex: 'opurchaseOrderno'
  },
  {
    title: '客户编码',
    dataIndex: 'ocustCode'
  },
  {
    title: '客户简称',
    dataIndex: 'ocustShortName'
  },
  {
    title: '订单总计(元)',
    dataIndex: 'ototalSum'
  },
  // {
  //   title: '生产基地',
  //   dataIndex: 'oproductionBase',
  //   width: 150
  // },
  // {
  //   title: '客户经理',
  //   dataIndex: 'ocustAmaldar',
  //   width: 150
  // },
  {
    title: '订单来源',
    dataIndex: 'osource',
    scopedSlots: { customRender: 'osource' }
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
    title: '产品规格',
    dataIndex: 'odSpec',
    scopedSlots: { customRender: 'odSpec' }
  },
  {
    title: '税率(%)',
    dataIndex: 'taxRate',
    scopedSlots: { customRender: 'taxRate' }
  },
  {
    title: '单价(元)',
    dataIndex: 'odSkuCustPrice',
    scopedSlots: { customRender: 'odSkuCustPrice' }
  },
  {
    title: '订单数量',
    dataIndex: 'odNumber',
    scopedSlots: { customRender: 'odNumber' }
  },
  {
    title: '订单总计(元)',
    dataIndex: 'odAmount',
    scopedSlots: { customRender: 'odAmount' }
  },
  {
    title: '要求交期',
    dataIndex: 'odRequireDueDate',
    scopedSlots: { customRender: 'odRequireDueDate' }
  },
  {
    title: '承诺交期',
    dataIndex: 'odPromiseDueDate',
    scopedSlots: { customRender: 'odPromiseDueDate' }
  },
  {
    title: '客户图号',
    dataIndex: 'odSkuCustDrawNum',
    scopedSlots: { customRender: 'odSkuCustDrawNum' }
  },
  {
    title: '订单日期',
    dataIndex: 'odOrderplacingTime',
    scopedSlots: { customRender: 'odOrderplacingTime' }
  },
  {
    title: '状态',
    dataIndex: 'ostatus',
    width: 70,
    scopedSlots: { customRender: 'ostatus' },
    fixed: 'right'
  }
]

// 订单新增/详情表格头
export const columnsOrderInfo = [
  {
    title: '产品名称',
    dataIndex: 'odSkuName',
    scopedSlots: { customRender: 'name' },
    width: 120
  },
  {
    title: '产品规格',
    dataIndex: 'odSpec',
    width: 120
  },
  {
    title: '单价',
    dataIndex: 'odSkuCustPrice',
    scopedSlots: { customRender: 'odSkuCustPrice' },
    width: 120
  },
  {
    title: '数量',
    dataIndex: 'odNumber',
    scopedSlots: { customRender: 'odNumber' },
    width: 120
  },
  {
    title: '总计',
    dataIndex: 'odAmount',
    scopedSlots: { customRender: 'odAmount' },
    width: 120
  },
  {
    title: '客户编码',
    dataIndex: 'odSkuCustCode',
    width: 120
  },
  {
    title: '采购单号',
    dataIndex: 'odPurchaseOrderno',
    scopedSlots: { customRender: 'odPurchaseOrderno' },
    width: 120
  },
  {
    title: '要求交期',
    dataIndex: 'odRequireDueDate',
    scopedSlots: { customRender: 'odRequireDueDate' },
    width: 120
  },
  {
    title: '承诺交期',
    dataIndex: 'odPromiseDueDate',
    scopedSlots: { customRender: 'odPromiseDueDate' },
    width: 120
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'operation' },
    fixed: 'right',
    align: 'center',
    width: 120
  }
]

// 订单状态的枚举
export const orderStatus = [
  {
    label: '预订单',
    value: 'PREORDER'
  },
  {
    label: '已提交',
    value: 'SUBMISSIONORDER'
  },
  {
    label: '已接单',
    value: 'ACCEPTORDER'
  },
  {
    label: '已拒单',
    value: 'REJECTORDE'
  },
  {
    label: '已完成',
    value: 'FINISH'
  },
  {
    label: '已取消',
    value: 'CANCEL'
  },
  {
    label: '已经发货',
    value: 'HAVEDELLIVERY'
  },
  {
    label: '部分发货',
    value: 'PARTDELLIVERY'
  },
  {
    label: '未发货',
    value: 'UNDELLIVERY'
  },
  {
    label: '已签收',
    value: 'ALREADYLIVERY'
  }
]
