import Vue from 'vue'
import Tools from './tools/tools'

const components = []

const install = function (Vue, opts = {}) {
    if (install.installed) return

    var tools = new Tools()
    Vue.prototype.$tools = tools

    components.map(component => {
        Vue.component(component.name, component)
    })
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
};

Vue.use(install)
