<template>
  <div class="tik-header">
    <div class="tik-header-left">
      <tik-logo></tik-logo>
      <div class="tik-header-left-buttons">
        <router-link class="primary" to="/problem-collection">题集</router-link>
        <!-- <router-link to="/">讨论</router-link> -->
        <!-- <router-link to="/backstage">后台</router-link> -->
      </div>
    </div>

    <div class="tik-header-right">
      <div class="avater-box">
        <el-avatar :size="30" :src="user.avatar" v-if="user.login"></el-avatar>
      </div>

      <router-link to="/login"
        ><el-button size="mini" class="button" v-if="!user.login"
          >登录</el-button
        ></router-link
      >
      <router-link to="/login"
        ><el-button size="mini" class="button" @click="logout" v-if="user.login"
          >注销</el-button
        ></router-link
      >
    </div>
  </div>
</template>

<script>
import TikLogo from "@/components/common/TikLogo.vue";
import { mapMutations, mapState, mapActions } from "vuex";
export default {
  methods: {
    ...mapMutations("user", ["logout"]),
    ...mapActions("user", ["loginMessage"]),
  },
  computed: {
    ...mapState("user", {
      user: (state) => state.user,
    }),
  },
  components: {
    TikLogo,
  },
  mounted() {
    if (this.user.login) {
      this.loginMessage();
    }
  },
  data() {
    return {};
  },
};
</script>
<style lang="sass" scoped>
@import "@/sass/_variables"
.avater-box
  display: inline-block
  height: 50px
  margin-right: 10px
  padding-top: 10px
  // box-sizing: border-box
  // margin: 20px
.tik-header
  width: 100%
  height: 50px
  justify-content: space-between
  background: $main-color
  display: flex
  box-shadow: 0 2px 4px rgba(0,0,0,0.12),0 0 6px rgba(0,0,0,0.04)
.tik-header-right
  // margin-right: 100px
  height: 50px
  width: 150px
  // padding: 0
  display: flex
.button
  display: inline-block
  margin-right: 5px
  height: 50px
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
