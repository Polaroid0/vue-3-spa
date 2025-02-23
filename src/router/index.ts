import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '../views/Auth/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import OrdersView from '../views/OrdersView.vue'

const routes = [
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/orders',
    component: OrdersView,
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  console.log(authStore.isAuthenticated)
  if (!authStore.isAuthenticated && to.meta.requiresAuth) {
    next('/login')
  } else if (authStore.isAuthenticated && !to.meta.requiresAuth) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
