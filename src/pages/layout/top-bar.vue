<template>
    <div id="top-bar">
        <div id="logo">
            <img :class="logoClass" src="static/images/logo.png"/>
        </div>
        <div class="menu">
            <i class="icon-menu" @click="clickMenu"></i>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    data () {
        return {
            isCollapse: false,
            logoClass: 'logoOpen'
        }
    },
    methods: {
        ...mapActions([
            'setLayoutMenuStatus'
        ]),
        clickMenu () {
            this.isCollapse = !this.isCollapse
            this.setLayoutMenuStatus(this.isCollapse)
            document.getElementById('logo').style.width = this.isCollapse ? '64px' : '200px'
            this.logoClass = this.isCollapse ? 'logoClose' : 'logoOpen'
        }
    }
}
</script>
<style>
#top-bar{
    width: 100%;
    height: 50px;
    background-color: #23b7e5;
    position: fixed!important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    z-index: 999;
}
#logo{
    float: left;
    width: 200px;
    height: 50px;
    text-align: center;
}
.logoOpen{
    width: 40%; margin-top: 10px;
}
.logoClose{
    width: 80%; margin-top: 15px;
}
.menu{
    float: left;
    height: 50px;
    line-height: 50px;
    padding-left: 10px;
    color: white;
}
.menu i{cursor: pointer; font-size: 14px; font-weight: bold;}
.menu i:active{color: black}
</style>
