const exceptionManager = [
  {
    path: '/exception/403',
    name: 'Exception403',
    component: () => import('@/views/exception/403.vue')
  },
  {
    path: '/exception/404',
    name: 'Exception404',
    component: () => import('@/views/exception/404.vue')

  },
  {
    path: '/exception/500',
    name: 'Exception500',
    component: () => import('@/views/exception/500.vue')
  },
  {
    path: '/exception/browser',
    name: 'ExceptionBrowser',
    component: () => import('@/views/exception/Browser.vue')
  }
]

export default exceptionManager
