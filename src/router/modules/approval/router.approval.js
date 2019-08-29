const approvalManager = [
  {
    path: '/approval/backlog',
    name: 'Backlog',
    component: () => import('@/views/approval/backlog/backlog.vue'),
    meta: { breads: ['审批', '待办'] }
  },
  {
    path: '/approval/read',
    name: 'Read',
    component: () => import('@/views/approval/read/Read.vue'),
    meta: { breads: ['审批', '阅览'] }
  },
  {
    path: '/approval/allApproval',
    name: 'allApproval',
    component: () => import('@/views/approval/all/Allapproval.vue'),
    meta: { breads: ['审批', '全部'] }
  },
  {
    path: '/approval/initiator',
    name: 'Initiator',
    component: () => import('@/views/approval/originator/initiator.vue'),
    meta: { breads: ['审批', '自己发起'] }
  }
]

export default approvalManager
