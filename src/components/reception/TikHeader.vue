<template>
  <div class="header-placeholder"></div>
  <div class="tik-header">
    <div class="tik-header-left-margin hidden-xs-only"></div>
    <div class="tik-header-left">
      <tik-logo @click="$router.push({ path: '/redirect', query: { path: '' } })"></tik-logo>
      <nav class="tik-header-left-buttons">
        <ul style="display:flex;" class="hidden-xs-only">
          <li>
            <router-link to="/posts">首页</router-link>
          </li>
          <li>
            <router-link class="primary" to="/problem-collection">题集</router-link>
          </li>
          <li>
            <router-link class="primary" to="/groups">群组</router-link>
          </li>
        </ul>
        <!-- <ul>asdasd</ul> -->
        <ul
          @mouseenter="show = true"
          @mouseleave="show = false"
          class="phone-show hidden-sm-and-up"
        >
          <router-link to="/posts">
            <span>首页</span>
          </router-link>

          <el-icon>
            <arrow-down />
          </el-icon>
          <ul v-show="show" class="tik-header-left-buttons-phone hidden-sm-and-up">
            <router-link to="/posts">
              <li>首页</li>
            </router-link>
            <router-link to="/problem-collection">
              <li>题集</li>
            </router-link>
            <router-link to="/groups">
              <li>群组</li>
            </router-link>

            <router-link to="/poster">
              <li>
                <el-icon>
                  <edit></edit>
                </el-icon>写文章
              </li>
            </router-link>
          </ul>
        </ul>
      </nav>
    </div>

    <div class="tik-header-right">
      <router-link to="/poster" class="link-button hidden-xs-only">
        写文章
        <el-icon>
          <edit></edit>
        </el-icon>
        <!-- <el-button icon="edit" size="mini" style="color: black;" type="primary" class="button"></el-button> -->
      </router-link>
      <div class="avater-box">
        <router-link to="/personCenter">
          <el-avatar :size="30" :src="user.avatar" v-if="user.login"></el-avatar>
        </router-link>
      </div>

      <router-link to="/login">
        <el-button size="mini" class="button" v-if="!user.login">登录</el-button>
      </router-link>
      <router-link to="/login">
        <el-button size="mini" class="button" @click="logout" v-if="user.login">注销</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import 'element-plus/theme-chalk/display.css';
import { Edit, ArrowDown } from "@element-plus/icons";
import TikLogo from "@/components/common/TikLogo.vue";
import { mapMutations, mapState, mapActions } from "vuex";
import UserTitle from "@/components/common/UserTitle.vue";
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
    UserTitle, Edit, ArrowDown
  },
  mounted() {
    if (this.user.login) {
      this.loginMessage();
    }
  },
  data() {
    return {
      show: false
    };
  },
};
</script>
<style lang="sass" scoped>

@import "@/sass/_variables"
.tik-header-left-margin
  &:before
    content: ""
    display: table
    clear: both
    margin-left: 5em
.header-placeholder
  height: 50px
  &:before
    content: "."
    display: table
    color: transparent
    clear: both
  &:after
    content: "."
    display: table
    color: transparent
    clear: both
.link-button
  display: inline-block
  width: fit-content
  align-self: center
  font-size: 15px
  margin-right: 20px
.avater-box
  display: inline-block
  height: 50px
  margin-right: 10px
  padding-top: 10px
  cursor: pointer
  // box-sizing: border-box
  // margin: 20px
.tik-header
  position: fixed
  top: 0px
  z-index: 5
  width: 100%
  height: 50px
  justify-content: space-between
  background: $main-color
  display: flex
  box-shadow: 0 2px 4px rgba(0,0,0,0.12),0 0 6px rgba(0,0,0,0.04)
.tik-header-right
  height: 50px
  width: 350px
  display: flex
.button
  display: inline-block
  margin-right: 5px
  margin-top: 12px
  // height: 50px
  color: $secondary-color
.tik-header-left
  width: 100%
  display: flex
  margin-left: 20px
  // padding-left: 5rem
  // justify-content: center
  .phone-show
    margin: 0
    padding: 0
    // background: black
    width: 120px
    color: blue
    line-height: 50px
    text-align: center
    color: $minor-color
    &:hover
      cursor: pointer
    // text-align: center 
  .tik-header-left-buttons-phone
    background: white
    height: fit-content
    border: $border
    width: 120px
    padding: 0
    border-radius: $large-radius
    box-shadow: $box-shadow
    text-align: center
    li
      margin: 10px 0
      // padding: 5px 30px
  .tik-header-left-buttons
    width: fit-content
  ul
    height: 50px
    margin: 0
    width: 100%
  li
    align-self: center
    list-style: none
    margin-right: 10px
    padding: 0
    &:hover
      a
        padding: 0
        margin: 0
        color: $secondary-color
a
  -moz-user-select: none
  -webkit-user-select: none
  -ms-user-select: none
  -khtml-user-select: none
  -o-user-select: none
  user-select: none
</style>
