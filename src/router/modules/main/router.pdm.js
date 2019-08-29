const pdmManager = [
  // PDM
  {
    path: '/pdm/category',
    name: 'gathering',
    component: () => import('@/views/product/pdm/category/Category.vue')
  },
  {
    path: '/pdm/catattr',
    name: 'payment',
    component: () => import('@/views/product/pdm/catattr/Catattr.vue')
  },
  {
    path: '/pdm/goods',
    name: 'refund',
    component: () => import('@/views/product/pdm/goods/Goods.vue')
  },
  // BOM
  {
    path: '/pdm/bom/category',
    name: 'bomGathering',
    component: () => import('@/views/product/bom/category/Category.vue')
  },
  {
    path: '/pdm/bom/catattr',
    name: 'bomCatattr',
    component: () => import('@/views/product/bom/catattr/Catattr.vue')
  },
  {
    path: '/pdm/bom/materials',
    name: 'materials',
    component: () => import('@/views/product/bom/bom_list/Material.vue')
  },
  // 工艺
  {
    path: '/pdm/craft/process',
    name: 'craftProcess',
    component: () => import('@/views/product/craft/process/Process.vue')
  },
  {
    path: '/pdm/craft/craftLine',
    name: 'craftLine',
    component: () => import('@/views/product/craft/craftLine/CraftLine.vue')
  }
]
export default pdmManager
