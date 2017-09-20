<template>
    <div id="page2">
        页面2 ss{{value}}
    </div>
</template>
<script>
export default {
    name: 'page2',
    data () {
        return {
            value: parseInt(Math.random() * 10)
        }
    }
}
</script>
