const orderManager = [
  {
    path: '/sale/order',
    name: 'order',
    component: () => import('@/views/sale/orderList/Order.vue')
  },
  {
    path: '/order/dispatch',
    name: 'dispatchOrder',
    component: () => import('@/views/sale/dispatchOrder/dispatch.vue')
  },
  {
    path: '/order/purchase',
    name: 'purchase',
    component: () => import('@/views/sale/purchase/purchase.vue')
  },
  {
    path: '/order/delivery',
    name: 'orderDelivery',
    component: () => import('@/views/sale/delivery/delivery.vue')
  },
  {
    path: '/factory/purchase',
    name: 'FactoryPurchase',
    component: () => import('@/views/factorySale/purchase/purchase.vue')
  },
  {
    path: '/factory/dispatch',
    name: 'dispatchFactory',
    component: () => import('@/views/factorySale/dispatchOrder/dispatch.vue')
  },
  {
    path: '/factory/repair',
    name: 'repairOrder',
    component: () => import('@/views/factorySale/repairOrder/repair.vue')
  },
  {
    path: '/factory/put',
    name: 'putStorage',
    component: () => import('@/views/warehouse/putStorage/putStorage.vue')
  },
  {
    path: '/factory/grn',
    name: 'putOrderList',
    component: () => import('@/views/warehouse/GRN/putOrder.vue')
  },
  {
    path: '/factory/outbound',
    name: 'Outbound',
    component: () => import('@/views/warehouse/Outbound/outOrder.vue')
  },
  {
    path: '/procurement/list',
    name: 'procurementList',
    component: () => import('@/views/procurement/purchasList/purchasList.vue')
  },
  {
    path: '/procurement/purchase/list',
    name: 'PurchasList',
    component: () => import('@/views/procurement/purchase/purchase.vue')
  },
  {
    path: '/supplier/purchase',
    name: 'SupplierList',
    component: () => import('@/views/supplierSale/purchase/purchase.vue')
  },
  {
    path: '/supplier/delivery',
    name: 'supplierDelivery',
    component: () => import('@/views/supplierSale/delivery/delivery.vue')
  },
  // 销售价目表
  {
    path: '/supplier/pricelist',
    name: 'Pricelist',
    component: () => import('@/views/supplierSale/price_list/Pricelist')
  }
]

export default orderManager
