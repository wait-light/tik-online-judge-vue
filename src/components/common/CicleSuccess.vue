<template>
  <span class="cicle-success"></span>
</template>


<style lang='sass' scoped>
@import "@/sass/_variables"
.cicle-success
    &::after
        content: "√"
        display: inline-block
        text-align: center
        background: $success-color
        color: white
        font-weight: 1200
        font-size: 1.2em
        line-height: 25px
        height: 25px
        width: 25px
        border-radius: 100%
</style>