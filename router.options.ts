import type { RouterConfig } from '@nuxt/schema'
// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig> {
  scrollBehavior: (to:any, from:any, savedPosition:any) => {
    console.log(savedPosition, 'ssssss')
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },

  routes: (_routes) => [
    {
      name: 'home',
      path: '/',
      component: () => import('~/pages/home.vue')
    }
  ]
}