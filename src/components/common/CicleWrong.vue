<template>
  <span class="cicle-wrong"></span>
</template>


<style lang='sass' scoped>
@import "@/sass/_variables"
.cicle-wrong
    &::after 
        content: "×"
        display: inline-block
        text-align: center
        background: $info-color
        color: white
        font-weight: 1200
        font-size: 1.2em
        line-height: 25px
        height: 25px
        width: 25px
        border-radius: 100%
</style>