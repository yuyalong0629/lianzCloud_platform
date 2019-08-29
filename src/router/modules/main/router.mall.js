const mallManager = [
  {
    path: '/mall/cashier',
    name: 'cashier',
    component: () => import('@/views/mall/Cashier.vue'),
    meta: { breads: ['商城', '基础设置', '支付方式'] }
  },
  {
    path: '/mall/delivery',
    name: 'technologyManage',
    component: () => import('@/views/mall/Delivery.vue'),
    meta: { breads: ['商城', '基础设置', '配送方式'] }
  }
]

export default mallManager
