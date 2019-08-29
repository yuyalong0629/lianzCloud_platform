import { LayoutView, ExceptionView, UserView, ApprovalView } from '@/components/layouts'

import permissonManager from './modules/permission/router.permission'

import custManager from './modules/main/router.cust'
import mallManager from './modules/main/router.mall'
import pdmManager from './modules/main/router.pdm'
import orderManager from './modules/main/router.order'

import userManager from './modules/user/router.user'

import exceptionManager from './modules/exception/router.exception'

import approvalManager from './modules/approval/router.approval'

export const routerMap = [
  // main
  {
    path: '/',
    name: 'LayoutView',
    component: LayoutView,
    redirect: '/permission',
    children: [
      ...permissonManager,
      // 客户管理
      ...custManager,
      // 商城
      ...mallManager,
      // 产品管理
      ...pdmManager,
      // 订单
      ...orderManager
    ]
  },
  // user
  {
    path: '/userview',
    name: 'userview',
    component: UserView,
    redirect: '/user/login',
    children: [
      ...userManager
    ]
  },
  // Exception
  {
    path: '/exceptionview',
    name: 'exceptionview',
    component: ExceptionView,
    redirect: '/exception/403',
    children: [
      ...exceptionManager
    ]
  },
  // 审批
  {
    path: '/approvalManager',
    name: 'approvalManager',
    component: ApprovalView,
    redirect: '/approval/backlog',
    children: [
      ...approvalManager
    ]
  },
  {
    path: '*',
    redirect: '/exception/404'
  }
]
