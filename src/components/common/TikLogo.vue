<template>
  <div @click="goHome" class="tik-logo">
    <img src="@/assets/judge.png" />
    <span>Tik OJ</span>
  </div>
</template>

<script>
export default {
  methods:{
    goHome(){
      this.$router.push("/")
    }
  }
};
</script>

<style lang="sass" scoped>
@import "@/sass/_variables"
.tik-logo
    cursor: pointer
    img
        width: 40px
        height: 40px
        margin: 5px 0
    span
        display: inline-block
        font-size: 20px
        color: $minor-color
        margin-left: 20px
        top: 25px
        transform: translateY(-50%)
        position: absolute
</style>