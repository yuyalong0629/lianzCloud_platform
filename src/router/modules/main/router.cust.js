const custManager = [
  {
    path: '/crm/cust',
    name: 'customer',
    component: () => import('@/views/cust/Customer.vue'),
    meta: { breads: ['客户关系管理', '客户'] }
  }
]

export default custManager
