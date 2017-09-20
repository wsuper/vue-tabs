import * as types from '../mutation-types.js'

const state = {
    status: false,
    routers: [],
    active: null,
    isLoadMenus: false
}

const getters = {
    getLayoutMenuStatus: state => state.status,
    getRouters: state => state.routers,
    getActive: state => state.active,
    getIsLoadMenus: state => state.isLoadMenus
}

const actions = {
    setLayoutMenuStatus ({ commit }, status) {
        commit(types.SET_LAYOUT_MENU_STATUS, { status })
    },
    setRouters ({ commit }, routers) {
        commit(types.SET_ROUTERS, { routers })
    },
    setActive ({ commit }, active) {
        commit(types.SET_ACTIVE, { active })
    },
    setIsLoadMenus ({ commit }, isLoadMenus) {
        commit(types.SET_IS_LOAD_MENUS, { isLoadMenus })
    }
}

const mutations = {
    [types.SET_LAYOUT_MENU_STATUS] (state, { status }) {
        state.status = status
    },
    [types.SET_ROUTERS] (state, { routers }) {
        state.routers = routers
    },
    [types.SET_ACTIVE] (state, { active }) {
        state.active = active
    },
    [types.SET_IS_LOAD_MENUS] (state, { isLoadMenus }) {
        state.isLoadMenus = isLoadMenus
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
