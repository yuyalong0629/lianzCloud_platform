/**
 * @description: 联系人信息
 * @param {Array} columns [联系人TabHeader]
 * @return: columns
 */
export const columns = [
  {
    title: '成员姓名',
    dataIndex: 'name',
    width: '10%',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '10%',
    scopedSlots: { customRender: 'sex' }
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: '15%',
    scopedSlots: { customRender: 'phone' }
  },
  {
    title: '部门',
    dataIndex: 'companyPosition',
    width: '15%',
    scopedSlots: { customRender: 'companyPosition' }
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: '22%',
    scopedSlots: { customRender: 'email' }
  },
  {
    title: '其他方式',
    dataIndex: 'contact',
    width: '15%',
    scopedSlots: { customRender: 'contact' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '10%',
    scopedSlots: { customRender: 'operation' }
  }
]

/**
 * @description: 首页Tab初始化数据
 * @param {Array} columnCust [TabHeader]
 * @return: columnCust
 */
export const columnCust = [
  {
    title: '客户编码',
    dataIndex: 'clientCode',
    scopedSlots: { customRender: 'clientCode' }
  },
  {
    title: '客户简称',
    dataIndex: 'clientShortName'
  },
  {
    title: '客户经理',
    dataIndex: 'clientAbbreviation'
  },
  {
    title: '联系人',
    dataIndex: 'clientName'
  },
  {
    title: '联系方式',
    dataIndex: 'clientPhone'
  },
  {
    title: '所属行业',
    dataIndex: 'clientIndustryValue'
  },
  {
    title: '客户等级',
    dataIndex: 'clientLevel'
  },
  {
    title: '状态',
    dataIndex: 'clientStatus',
    scopedSlots: { customRender: 'clientStatus' }
  }
]

/**
 * @description: 收货人地址
 * @param {Array} columnAddress [收货人地址Header]
 * @return: columnAddress
 */
export const columnAddress = [
  {
    title: '收件人姓名',
    dataIndex: 'receiver',
    width: 150,
    scopedSlots: { customRender: 'receiver' }
  },
  {
    title: '联系方式',
    dataIndex: 'phone',
    width: 150,
    scopedSlots: { customRender: 'phone' }
  },
  {
    title: '所在地区',
    dataIndex: 'address',
    width: 290,
    scopedSlots: { customRender: 'address' }
  },
  {
    title: '街道地址',
    dataIndex: 'detailAddr',
    width: 200,
    scopedSlots: { customRender: 'detailAddr' }

  },
  {
    title: '是否默认收货地址',
    dataIndex: 'defaultGoodsAddr',
    width: 200,
    scopedSlots: { customRender: 'defaultGoodsAddr' }

  },
  {
    title: '邮政编码',
    dataIndex: 'postCode',
    width: 150,
    scopedSlots: { customRender: 'postCode' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 100,
    fixed: 'right',
    scopedSlots: { customRender: 'operation' }
  }
]
