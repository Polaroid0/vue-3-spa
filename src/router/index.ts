import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '../views/Auth/LoginView.vue'
import OrdersView from '../views/Orders/ListView.vue'

const routes = [
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/orders',
    component: OrdersView,
    meta: {
      requiresAuth: true
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated && to.meta.requiresAuth) {
    next('/login')
  } else if (authStore.isAuthenticated && !to.meta.requiresAuth) {
    next('/orders')
  } else {
    next()
  }
})

export default router
