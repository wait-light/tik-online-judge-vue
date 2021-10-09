<template>
    <div class="tik-home-buttom">
        <p><a href="https://adxd.top">wait_light</a> © 2021. 版权所有。</p>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="sass">
@import '@/sass/_variables' 
.tik-home-buttom
    height: 60px
    display: flex
    justify-content: center
    background: $minor-color
    p
        line-height: 60px
        margin: 0
        color: $main-color
        a
            text-decoration: none
            color: $main-color
            padding:3px 8px
            margin-right: 10px
            box-shadow: 5px 5px 10px rgba(0,0,0,0.5 )
</style>