// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './components'
import '../static/css/simple-line-icons.css'
import Layout from './pages/layout/layout.vue'

Vue.config.productionTip = false
Vue.use(ElementUI)
router.beforeEach((to, from, next) => {
    if (to.path !== '/') {
        if (store && !store.getters.getIsLoadMenus) {
            window.localStorage.setItem('path', to.path)
        } else {
            next()
        }
    } else {
        next()
    }
})
/* eslint-disable no-new */
new Vue({
    el: '#layout',
    router,
    store,
    template: '<Layout/>',
    components: { Layout }
})
