const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'home', component: () => import('pages/IndexPage.vue') },
      { path: 'profiles', component: () => import('pages/UserInterface/Profiles.vue') },
      { path: 'profiles/info', component: () => import('pages/UserInterface/ProfilesInfo.vue') },
      { path: 'admin', component: () => import('pages/UserInterface/AdminPage.vue') },
      { path: 'my', component: () => import('pages/UserInterface/SelfProfile.vue') },
      { path: 'webhooks', component: () => import('pages/UserInterface/WebHooks.vue') },
      { path: 'userslist', component: () => import('pages/UserInterface/UsersList.vue') },
      { path: 'settings', component: () => import('pages/UserInterface/Settings.vue') }
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
