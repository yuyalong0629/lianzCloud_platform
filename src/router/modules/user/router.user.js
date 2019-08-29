const userManager = [
  {
    path: '/user/login',
    name: 'login',
    component: () => import('@/views/user/Login.vue')
  },
  {
    path: '/user/register',
    name: 'register',
    component: () => import('@/views/user/Register.vue')

  },
  {
    path: '/user/retrieve',
    name: 'retrieve',
    component: () => import('@/views/user/Retrieve.vue')
  }
]

export default userManager
