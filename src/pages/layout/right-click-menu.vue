<template>
    <div id="right-click-menu">
        <ul>
            <li key="" v-for="(item, index) in titles" @click="clickMenu(index)">{{item}}</li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'right-click-menu',
    data () {
        return {
            titles: ['关闭', '关闭其它', '关闭全部']
        }
    },
    methods: {
        clickMenu (index) {
            this.$emit('click-menu', index)
        }
    }
}
</script>
<style scoped lang="css">
#right-click-menu{
    position: fixed!important;
    width: 160px;
    left: 285px;
    top: 89px;
    background-color: white;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    box-shadow: 0 6px 12px rgba(0,0,0,.175);
}
#right-click-menu ul {margin: 0; padding: 0}
#right-click-menu li {
    padding-left: 20px;
    list-style: none;
    line-height: 36px;
    font-size: 13px;
    margin: 0;
    padding: 0;
    padding-left: 10px;
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #e4eaec;
}
#right-click-menu li:hover{
    background-color: rgba(240, 240, 240, 0.5);
}
</style>
