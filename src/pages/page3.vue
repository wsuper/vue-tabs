<template>
    <div id="page1">
        页面3
        <el-button @click="openMenu">打开页面2</el-button>
    </div>
</template>
<script>
export default {
    name: 'page3',
    methods: {
        openMenu () {
            this.$menu.open('page2')
        }
    }
}
</script>
