<template>
    <div id="layout">
        <top-bar></top-bar>
        <menu-bar :menu-list="menus"></menu-bar>
        <div id="content">
            <div id="tabs-list-wrapper">
                <ul class="tabs-list">
                    <li key="" v-for="(item, index) in getRouters" @contextmenu.prevent="clickKeyRight($event, item, index)" :class="item.selected?'active':''" @click="clickTabItem(item, index)">
                        {{item.text}}
                        <span class="btn-close" @click="clickCloseTabItem($event, item, index)">×</span>
                    </li>
                </ul>
            </div>
            <div id="router-view">
                <keep-alive :include="routers">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
        <right-click-menu @click-menu="clickRightMenu" v-show="isShowRightClickMenu" v-clickoutside="closeRightClickMenu"></right-click-menu>
    </div>
</template>
<script>
import Vue from 'vue'
import MenuBar from './menu-bar.vue'
import TopBar from './top-bar.vue'
import RightClickMenu from './right-click-menu.vue'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import { mapGetters, mapActions } from 'vuex'
import menuJson from './menu.json'
export default {
    components: {
        MenuBar, TopBar, RightClickMenu
    },
    directives: {
        Clickoutside
    },
    data () {
        return {
            menus: null,
            routers: null,
            loading: false,
            loadingText: null,
            isShowRightClickMenu: false,
            startTime: null,
            rightKeyIndex: null,
            rightKeyItem: null,
            currentIndex: null
        }
    },
    created () {
        let self = this
        Vue.prototype.$menu = {
            open: function (url) {
                if (!url) return
                if (self.getRouters.length > 0) {
                    let routers = JSON.parse(JSON.stringify(self.getRouters))
                    let isNull = false
                    let active = null
                    for (let i = 0; i < routers.length; i++) {
                        let obj = routers[i]
                        obj.selected = false
                        if (url.indexOf(obj.url) !== -1) {
                            obj.selected = true
                            active = obj.active
                            isNull = true
                        }
                    }
                    if (!isNull) {
                        self.openMenu(self, url)
                    } else {
                        self.setRouters(routers)
                        self.setActive(active)
                        self.$router.push(url)
                    }
                } else {
                    self.openMenu(self, url)
                }
            }
        }
    },
    methods: {
        ...mapActions([
            'setRouters',
            'setActive',
            'setIsLoadMenus'
        ]),
        openMenu (self, url) {
            self.parseMenus(self.menus).then(routerMenus => {
                if (routerMenus[url]) {
                    let obj = routerMenus[url]
                    self.setActive(obj.active)
                    obj.selected = true
                    if (self.getRouters.length === 0) {
                        self.setRouters(new Array(obj))
                    } else {
                        let routers = JSON.parse(JSON.stringify(self.getRouters))
                        routers.forEach(item => {
                            item.selected = false
                        })
                        routers.push(obj)
                        self.setRouters(routers)
                    }
                    self.$router.push(url)
                }
            })
        },
        loadMenus () {
            this.menus = menuJson
            this.parseMenus(this.menus).then(routerMenus => {
                this.setIsLoadMenus(true)
                let defaultRouter = window.localStorage.getItem('path')
                if (defaultRouter !== null && defaultRouter !== 'undefined') {
                    defaultRouter = defaultRouter.substring(1, defaultRouter.length)
                    if (routerMenus[defaultRouter]) {
                        let obj = routerMenus[defaultRouter]
                        this.setActive(obj.active)
                        obj.selected = true
                        this.setRouters(new Array(obj))
                        this.$router.push(defaultRouter)
                        window.localStorage.removeItem('path')
                    }
                }
            })
        },
        parseMenus (menus) {
            return new Promise(function (resolve, reject) {
                let allMenus = {}
                for (let i = 0; i < menus.length; i++) {
                    let obj = menus[i]
                    if (obj.children && Array.isArray(obj.children) && obj.children.length > 0) {
                        for (let j = 0; j < obj.children.length; j++) {
                            let child = obj.children[j]
                            if (child.children && Array.isArray(child.children) && child.children.length > 0) {
                                for (let k = 0; k < child.children.length; k++) {
                                    let sub = child.children[k]
                                    allMenus[sub.name] = {text: sub.text, url: sub.name, selected: false, level: 3, active: i + '-' + j + '-' + k}
                                }
                            } else {
                                allMenus[child.name] = {text: child.text, url: child.name, selected: false, level: 2, active: i + '-' + j}
                            }
                        }
                    } else {
                        allMenus[obj.name] = {text: obj.text, url: obj.name, selected: false, level: 1, active: i.toString()}
                    }
                }
                resolve(allMenus)
            })
        },
        clickTabItem (item) {
            if (!item.selected && this.getRouters.length > 0) {
                let routers = JSON.parse(JSON.stringify(this.getRouters))
                routers.forEach(router => {
                    if (router.url === item.url && router.text === item.text) {
                        router.selected = true
                        this.$router.push(router.url)
                    } else {
                        router.selected = false
                    }
                })
                this.setRouters(routers)
                this.setActive(item.active)
            }
        },
        clickCloseTabItem (event, item, index) {
            if (this.getRouters.length === 1) {
                this.setRouters([])
                this.setActive(null)
                this.$router.push('/')
            } else {
                let routers = JSON.parse(JSON.stringify(this.getRouters))
                routers.splice(index, 1)
                if (item.selected) {
                    if (index === routers.length) {
                        routers[index - 1].selected = true
                        this.$router.push(routers[index - 1].url)
                        this.setActive(routers[index - 1].active)
                    } else {
                        routers[index].selected = true
                        this.$router.push(routers[index].url)
                        this.setActive(routers[index].active)
                    }
                }
                this.setRouters(routers)
            }
            if (event) event.cancelBubble = true
        },
        clickKeyRight (event, item, index) {
            let rightClickMenu = document.getElementById('right-click-menu')
            rightClickMenu.style.top = event.pageY + 'px'
            rightClickMenu.style.left = event.pageX + 'px'
            this.isShowRightClickMenu = true
            this.rightKeyItem = item
            this.rightKeyIndex = index
            this.startTime = new Date().getTime()
        },
        closeRightClickMenu () {
            let endTime = new Date().getTime()
            if (endTime - this.startTime > 200) {
                this.isShowRightClickMenu = false
                this.rightKeyItem = null
                this.rightKeyIndex = null
            }
        },
        clickRightMenu (index) {
            this.isShowRightClickMenu = false
            switch (index) {
            case 0:
                this.clickCloseTabItem(null, this.rightKeyItem, this.rightKeyIndex)
                break
            case 1:
                let rightKeyItem = JSON.parse(JSON.stringify(this.rightKeyItem))
                if (!rightKeyItem.selected) {
                    rightKeyItem.selected = true
                    this.setActive(rightKeyItem.active)
                    this.$router.push(rightKeyItem.url)
                }
                this.setRouters(new Array(rightKeyItem))
                break
            case 2:
                this.setRouters([])
                this.$router.push('/')
                this.setActive(null)
                break
            default:
                break
            }
        }
    },
    computed: {
        ...mapGetters({
            getStatus: 'getLayoutMenuStatus',
            getRouters: 'getRouters'
        })
    },
    watch: {
        getStatus () {
            let content = document.getElementById('content')
            let menuBar = document.getElementById('menu-bar')
            if (this.getStatus) {
                content.style.width = document.documentElement.clientWidth - 74 + 'px'
                content.style.marginLeft = '74px'
                menuBar.style.width = '64px'
            } else {
                content.style.marginLeft = '210px'
                content.style.width = document.documentElement.clientWidth - 210 + 'px'
                menuBar.style.width = '200px'
            }
        },
        getRouters () {
            let routerView = document.getElementById('router-view')
            let clientHeight = document.documentElement.clientHeight
            if (this.getRouters.length === 0) {
                this.routers = null
                routerView.style.height = clientHeight - 60 + 'px'
            } else {
                let routers = []
                this.getRouters.forEach(item => {
                    routers.push(item.url)
                })
                this.routers = routers.join(',')
                if (this.getRouters.length === 1) {
                    routerView.style.height = clientHeight - 95 + 'px'
                } else {
                    let wrapper = document.getElementById('tabs-list-wrapper')
                    routerView.style.height = clientHeight - 60 - wrapper.offsetHeight + 'px'
                }
            }
        }
    },
    mounted () {
        let content = document.getElementById('content')
        let menuBar = document.getElementById('menu-bar')
        let routerView = document.getElementById('router-view')
        let clientHeight = document.documentElement.clientHeight
        content.style.marginLeft = '210px'
        content.style.width = document.documentElement.clientWidth - 210 + 'px'
        content.style.height = clientHeight - 60 + 'px'
        routerView.style.height = clientHeight - 60 + 'px'
        let self = this
        window.onresize = function () {
            let clientHeight = document.documentElement.clientHeight
            content.style.width = document.documentElement.clientWidth - menuBar.offsetWidth - 10 + 'px'
            content.style.height = clientHeight - 60 + 'px'
            if (self.getRouters.length > 0) {
                routerView.style.height = clientHeight - 95 + 'px'
            } else {
                routerView.style.height = clientHeight - 60 + 'px'
            }
        }
        this.loadMenus()
    }
}
</script>
<style>
*,html,body{
    margin: 0;
    padding: 0;
}
html{background-color: rgb(243,246,249)}
body::-webkit-scrollbar {
    display: none;
}
#content{
    position: absolute;
    top: 50px;
    background-color: white;
    margin-left: 10px;
    margin-top: 10px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    transition: 0.3s;
}
.tabs-list-wrapper{
    background-color: #ededed;
}
.tabs-list {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: auto;
    width: auto;
    zoom: 1;
    background-color: rgb(243,246,249)
}
.tabs-list>li {
    float: left;
    padding: 10px 35px 10px 10px;
    margin-right: 2px;
    position: relative;
    font-family: Arial,Microsoft YaHei,\\9ED1\4F53,\\5B8B\4F53,sans-serif;
    font-size: 13px;
    text-align: left;
    border-right: 1px solid #dadada;
    color: #999;
    background-color: #ededed;
}
.tabs-list>li.active {
    background: black;
    color: #fff;
}
.tabs-list > li.active .btn-close {
  opacity: 1;
}
.tabs-list > li:hover {
  cursor: pointer;
}
.tabs-list > li:hover .btn-close {
  opacity: 1;
}
.tabs-list > li .btn-close {
  position: absolute;
  display: inline-block;
  opacity: 0.5;
  top: 5px;
  right: -6px;
  line-height: 10px;
  width: 18px;
  height: 18px;
  border-radius: 14px;
  font-size: 16px;
  color: white;
  transition: all 0.2s ease;
}
.tabs-list > li .btn-close:hover {
  color: #333;
  transform: scale(1.5);
  cursor: pointer;
}
</style>
