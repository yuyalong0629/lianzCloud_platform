/**
 * @description 订单状态 出入库状态 币种等枚举
 */

export const status = [
  {
    label: '已接单',
    value: 'RECEIVED'
  },
  {
    label: '等待接单',
    value: 'WAITING'
  },
  {
    label: '生产中',
    value: 'IN_PRODUCTION'
  },
  {
    label: '已完成',
    value: 'COMPLETED'
  },
  {
    label: '已取消',
    value: 'CANCELLED'
  },
  {
    label: '已拒单',
    value: 'REJECTED'
  }
]

export const moneyType = [
  {
    label: '元',
    value: 'CNY'
  },
  {
    label: '美元',
    value: 'USD'
  },
  {
    label: '港元',
    value: 'HKD'
  },
  {
    label: '英镑',
    value: 'GBP'
  },
  {
    label: '欧元',
    value: 'EUR'
  },
  {
    label: '台币',
    value: 'TWD'
  },
  {
    label: '日圆',
    value: 'JPY'
  },
  {
    label: '韩圆',
    value: 'KRW'
  }
]

// 入库类型 0.INDEPENDENT.工厂自主申请 1.PRODUCTION.工厂生产单完成入库申请 2.UPPLIER.材料商自主申请 3.VENDOR.材料商销售单入库申请
export const instorageType = [
  {
    label: '工厂自主申请',
    value: 'INDEPENDENT'
  },
  {
    label: '工厂生产单完成入库申请',
    value: 'PRODUCTION'
  },
  {
    label: '材料商自主申请',
    value: 'UPPLIER'
  },
  {
    label: '材料商销售单入库申请',
    value: 'VENDOR'
  }
]

export const puStorageStatus = [
  {
    key: 'PRODUCTION',
    value: '生产中'
  },
  {
    key: 'WAITING_IN',
    value: '等待入库'
  },
  {
    key: 'PARTIAL_IN',
    value: '部分入库'
  },
  {
    key: 'STORED_IN',
    value: '已入库'
  },
  {
    key: 'ONEED',
    value: '移除'
  },
  {
    key: 'WAITING_OUT',
    value: '等待出库'
  },
  {
    key: 'PARTIAL_OUT',
    value: '部分出库'
  },
  {
    key: 'STORED_OUT',
    value: '已出库'
  },
  {
    key: 'CANCEL_IN',
    value: '取消入库'
  },
  {
    key: 'CANCEL_OUT',
    value: '取消出库'
  },
  {
    key: 'SUBMISSION',
    value: '已提交入库申请'
  },
  {
    key: 'STORED_OUT_SUBMIT',
    value: '已提交出库申请'
  }
]
