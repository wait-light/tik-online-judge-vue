<template>
  <div style="margin-top: 10px"></div>
  <el-row>
    <el-col :span="4">
      <el-menu class="menu" :router="false">
        <router-link
          to="account"
          active-class="active"
        >
          <el-menu-item>
            <span>账户</span>
          </el-menu-item>
        </router-link>
        <router-link to="solutions" active-class="active">
          <el-menu-item>
            <span>文章</span>
          </el-menu-item>
        </router-link>

        <!-- <el-menu-item  index="/redirect?path=/">
          <span>个人信息</span>
        </el-menu-item>
        <el-menu-item>
          <span>登录记录</span>
        </el-menu-item>-->
      </el-menu>
    </el-col>
    <el-col :span="20">
      <el-card class="person_center_container">
        <router-view></router-view>
      </el-card>
      <!-- <div class="person_center_container"></div> -->
    </el-col>
  </el-row>
</template>

<script setup>
import { useRoute } from "vue-router"

document.title = "Tik Online Judge 个人中心"
const route = useRoute()
</script>

<style lang="sass" scoped>
@import "@/sass/_variables.sass"
.menu
  padding: 0 10px
.active
  li
    background: $auxiliary-color
    border-radius: $large-radius
  span
    color: $minor-color
    font-weight: 600
.person_center_container
  margin: 10px 20px
</style>
