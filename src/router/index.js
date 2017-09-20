import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'

Vue.use(Router)

/** 路由赖加载配置 **/
const Page1 = resolve => require(['pages/page1.vue'], resolve)
const Page2 = resolve => require(['pages/Page2.vue'], resolve)
const Page3 = resolve => require(['pages/Page3.vue'], resolve)

export default new Router({
    routes: [
        {path: '/', name: 'Hello', component: Hello},
        {path: '/page1', name: 'page1', component: Page1},
        {path: '/page2', name: 'page2', component: Page2},
        {path: '/page3', name: 'page3', component: Page3}
    ]
})
