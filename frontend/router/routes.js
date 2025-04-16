const HomeView = () => import('../src/views/Home.vue')
const LoginView = () => import('../src/views/Login.vue')
const RegisterView = () => import('../src/views/Register.vue')
const MemberView = () => import('../src/views/Member.vue')

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: false, title: 'Home' },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false, title: 'Login' },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresAuth: false, title: 'Register' },
  },
  {
    path: '/member',
    name: 'Member',
    component: MemberView,
    meta: { requiresAuth: true, title: 'Member' },
  },
]

export default routes
