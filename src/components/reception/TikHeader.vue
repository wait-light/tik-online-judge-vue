<template>
  <div class="tik-header">
    <div class="tik-header-left">
      <tik-logo></tik-logo>
      <div class="tik-header-left-buttons">
        <router-link class="primary" to="/problem-collection">题集</router-link>
        <router-link to="/">讨论</router-link>
        <router-link to="/backstage">后台</router-link>
      </div>
    </div>

    <div class="tik-header-right">
      <router-link to="/sign"
        ><el-button size="mini" class="button">注册</el-button></router-link
      >
      <router-link to="/login"
        ><el-button size="mini" class="button">登录</el-button></router-link
      >
    </div>
  </div>
</template>

<script>
import TikLogo from "@/components/common/TikLogo.vue";
export default {
  components: {
    TikLogo,
  },
  data() {
    return {};
  },
};
</script>
<style lang="sass" scoped>
@import "@/sass/_variables"
.tik-header
  width: 100%
  height: 50px
  justify-content: space-between
  background: $main-color
  display: flex
  box-shadow: 0 2px 4px rgba(0,0,0,0.12),0 0 6px rgba(0,0,0,0.04)
.tik-header-right
  margin-right: 100px
  height: 100%
  padding: 11px 0
.button
  margin-right: 5px
  color: $secondary-color
.tik-header-left
  margin-left: 150px
  display: flex
  span
    font-size: 30px
    color: $minor-color
    margin-left: 50px
    position: absolute
    top: 10px
  .primary
    margin-left: 120px
  a
    display: inline-block
    line-height: 50px
    margin-right: 15px
    font-size: 20px
    text-decoration: none
    color: $secondary-color
</style>
