<template>
<div id="menu-bar">
    <el-menu class="el-menu-vertical-demo" :default-active="defaultActive" @open="handleOpen" @close="handleClose" :collapse="isCollapse" :unique-opened="true">
        <template v-for="(item, index) in menus">
            <template v-if="item.children&&item.children.length>0">
                <el-submenu :index="index.toString()">
                    <template slot="title">
                        <template v-if="index===parentIndex">
                          <i :class="item.icon" class="active"></i>&nbsp;&nbsp;
                          <span slot="title" class="active">{{item.text}}</span>
                        </template>
                        <template lot="title" v-else>
                            <i :class="item.icon"></i>&nbsp;&nbsp;
                            <span slot="title">{{item.text}}</span>
                        </template>
                    </template>
                    <template v-for="(child, childIndex) in item.children">
                        <template v-if="child.children&&child.children.length>0">
                            <el-submenu :index="index+'-'+childIndex">
                                <template slot="title">
                                  <span slot="title" :class="parentIndex===index&&currentChildIndex===childIndex?'active':''">{{child.text}}</span>
                                </template>
                                <template v-for="(sub, subIndex) in child.children">
                                    <el-menu-item :index="index+'-'+childIndex+'-'+subIndex" @click="clickSubMenuItem(index, childIndex, subIndex, sub)">
                                        <span slot="title">{{sub.text}}</span>
                                    </el-menu-item>
                                </template>
                            </el-submenu>
                        </template>
                        <template v-else>
                            <el-menu-item :index="index+'-'+childIndex" @click="clickChildMenuItem(index, childIndex, child)">
                                <span slot="title">{{child.text}}</span>
                            </el-menu-item>
                        </template>
                    </template>
                </el-submenu>
            </template>
            <template v-else>
                <el-menu-item :index="index+''" @click="clickParentMenuItem(index, item)" :class="index===parentIndex?'active':''">
                    <i :class="item.icon"></i>&nbsp;&nbsp;
                    <span slot="title">{{item.text}}</span>
                </el-menu-item>
            </template>
        </template>
    </el-menu>
</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'MenuBar',
    props: {menuList: Array, active: String},
    data () {
        return {
            isCollapse: false,
            menus: [],
            parentIndex: -1,
            currentChildIndex: -1,
            currentSubIndex: -1,
            defaultActive: null
        }
    },
    computed: {
        ...mapGetters({
            getStatus: 'getLayoutMenuStatus',
            getRouters: 'getRouters',
            getActive: 'getActive'
        })
    },
    methods: {
        handleOpen (key, keyPath) {
        },
        handleClose (key, keyPath) {
        },
        ...mapActions([
            'setRouters',
            'setActive'
        ]),
        clickParentMenuItem (index, menu) {
            menu.level = 1
            this.parentIndex = index
            this.currentChildIndex = -1
            this.currentSubIndex = -1
            this.clickMenuItem(menu)
        },
        clickChildMenuItem (parentIndex, index, menu) {
            menu.level = 2
            this.parentIndex = parentIndex
            this.currentChildIndex = index
            this.currentSubIndex = -1
            this.clickMenuItem(menu)
        },
        clickSubMenuItem (parentIndex, childIndex, index, menu) {
            menu.level = 3
            this.parentIndex = parentIndex
            this.currentChildIndex = childIndex
            this.currentSubIndex = index
            this.clickMenuItem(menu)
        },
        clickMenuItem (menu) {
            let routers = JSON.parse(JSON.stringify(this.getRouters))
            if (routers.length > 0) {
                let isNull = false
                routers.forEach(item => {
                    if (item.url === menu.name && item.text === menu.text) {
                        item.selected = true
                        isNull = true
                    } else {
                        item.selected = false
                    }
                })
                if (!isNull) {
                    this.setDefaultActive(menu)
                    routers.push({text: menu.text, url: menu.name, selected: true, level: menu.level, active: this.defaultActive})
                }
                this.$router.push(menu.name)
            } else {
                this.setDefaultActive(menu)
                routers.push({text: menu.text, url: menu.name, selected: true, level: menu.level, active: this.defaultActive})
                this.$router.push(menu.name)
            }
            this.setRouters(routers)
        },
        setDefaultActive (menu) {
            if (menu.level === 1) {
                this.defaultActive = this.parentIndex.toString()
            } else if (menu.level === 2) {
                this.defaultActive = this.parentIndex + '-' + this.currentChildIndex
            } else {
                this.defaultActive = this.parentIndex + '-' + this.currentChildIndex + '-' + this.currentSubIndex
            }
            this.setActive(this.defaultActive)
        }
    },
    watch: {
        menuList () {
            this.menus = this.menuList
        },
        getStatus () {
            this.isCollapse = this.getStatus
            if (!this.isCollapse) {
                let defaultActive = this.defaultActive
                this.defaultActive = null
                setTimeout(() => {
                    this.defaultActive = defaultActive
                }, 400)
            }
        },
        getActive () {
            if (this.getActive === null) {
                this.parentIndex = -1
                this.currentChildIndex = -1
                this.currentSubIndex = -1
                this.defaultActive = null
            } else {
                this.defaultActive = this.getActive
                let actives = this.defaultActive.split('-')
                let length = actives.length
                this.parentIndex = parseInt(actives[0])
                if (length > 1) {
                    this.currentChildIndex = parseInt(actives[1])
                }
            }
        }
    },
    mounted () {
        let menuBar = document.getElementById('menu-bar')
        let elMenu = document.getElementsByClassName('el-menu')
        menuBar.addEventListener('mousewheel', function (event) {
            if (elMenu[0].offsetHeight + 50 < document.documentElement.clientHeight) {
                if (event.deltaY > 0) return
            }
            let deltaY = event.deltaY > 0 ? 30 : -30
            let top = elMenu[0].offsetTop - deltaY
            if (deltaY < 0) {
                if (top > 0) {
                    elMenu[0].style.top = '0px'
                } else {
                    elMenu[0].style.top = top + 'px'
                }
            } else if (deltaY > 0) {
                let clientHeight = document.documentElement.clientHeight
                let maxTop = elMenu[0].offsetHeight + 56 * 3 - clientHeight
                if (-(top) >= maxTop) {
                    top = -(maxTop)
                }
                elMenu[0].style.top = top + 'px'
            }
        }, false)
    }
}
</script>
<style lang="css">
#menu-bar{
    left: 0;
    top: 50px;
    bottom: 0;
    height: 100%;
    background-color: white;
    border-right: 1px solid rgb(217,217,217);
    width: 201px;
    transition: 0.3s;
    z-index: 998;
    position: fixed!important;
}
#menu-bar::-webkit-scrollbar {
    display: none;
}
.el-menu{
    background-color: white;
}
.el-menu i{font-size: 14px}
.el-menu--collapse i:first-child{font-size: 21px}
.el-submenu .el-menu{background-color: rgb(240,240,240)}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    transition: width .2s cubic-bezier(.35,0,.25,1),translate .2s cubic-bezier(.35,0,.25,1);
    background-color: white;
    width: 200px;
    min-height: 400px;
}
.el-menu-item.is-active{
    color: #23b7e5
}
.el-menu .active{color: #23b7e5;}
.el-menu-item, .el-submenu__title{line-height: 45px; height: 45px;}
.el-submenu .el-menu-item{line-height: 45px; height: 45px;}
</style>
