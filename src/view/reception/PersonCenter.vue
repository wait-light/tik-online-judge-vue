<template>
  <div style="margin-top: 10px"></div>
  <el-row>
    <el-col :span="4">
      <el-menu :router="true" default-active="/redirect?path=/personCenter/account">
        <el-menu-item index="/redirect?path=/personCenter/account">
          <span>账户</span>
        </el-menu-item>
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
document.title = "Tik Online Judge 个人中心"
</script>

<style lang="sass" scoped>

.person_center_container
  margin: 10px 20px
</style>
