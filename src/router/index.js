import Vue from 'vue'
import Router from 'vue-router'
import Lease from '@/components/Lease'
import Document from '@/components/Document';
import Leases from '@/components/Leases'
import Login from '@/components/Login'
import Logout from '@/components/Logout'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'leases',
      component: Leases,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        guest: true
      }
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/lease/:id',
      name: 'lease',
      component: Lease,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/document/:id',
      name: 'document',
      component: Document,
      meta: {
        requiresAuth: true
      }
    },
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('jwt') == null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
