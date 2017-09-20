import Vue from 'vue'
import Api from './api/api'
import Tools from './tools/tools'

const components = []

const install = function (Vue, opts = {}) {
    if (install.installed) return

    var api = new Api()
    var tools = new Tools()
    Vue.prototype.$api = api
    Vue.prototype.$tools = tools

    components.map(component => {
        Vue.component(component.name, component)
    })
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
};

Vue.use(install)
