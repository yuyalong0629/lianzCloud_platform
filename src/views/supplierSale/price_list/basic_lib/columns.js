// tab Header
export const columns = [
  {
    title: '产品名称',
    dataIndex: 'name',
    width: '16%',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '版本',
    dataIndex: 'versionCode',
    width: '16%'
  },
  {
    title: '现价',
    dataIndex: 'price',
    width: '16%'
  },
  {
    title: '报价时间',
    dataIndex: 'creatorTime',
    width: '16%',
    scopedSlots: { customRender: 'creatorTime' }
  },
  {
    title: '工厂名称',
    dataIndex: 'factoryName',
    width: '16%',
    scopedSlots: { customRender: 'factoryName' }
  },
  {
    title: '更改时间',
    dataIndex: 'modifyTime',
    width: '16%',
    scopedSlots: { customRender: 'modifyTime' }
  }
]
