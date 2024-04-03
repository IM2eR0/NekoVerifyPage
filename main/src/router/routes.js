const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'home', component: () => import('pages/IndexPage.vue') },
      { path: 'profiles', component: () => import('pages/UserInterface/Profiles.vue') }
    ]
  },
  { path: '/login', component: () => import('pages/UserService/login.vue') },
  { path: '/register', component: () => import('pages/UserService/register.vue') },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
