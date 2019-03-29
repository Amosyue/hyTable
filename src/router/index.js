import Vue from 'vue'
import Router from 'vue-router'
import  test from '@/page/test'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'test',
      component: test
    },
    {
      path: '/test',
      name: 'test',
      component: test
    }
  ]
})
