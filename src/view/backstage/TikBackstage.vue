<template>
  <tik-header></tik-header>
  <el-row class="tik-home-container">
    <el-col :span="4">
      <el-menu router background-color="#FFFFFF" :default-active="activeIndex">
        <el-sub-menu index="1">
          <template #title>
            <i class="el-icon-location"></i>
            <span>权限</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/backstage/user">用户权限管理</el-menu-item>
            <el-menu-item index="/backstage/role">角色管理</el-menu-item>
            <el-menu-item index="/backstage/menu">权限菜单管理</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item index="/backstage/problem">问题管理</el-menu-item>
        <el-menu-item index="/backstage/problemdata">问题数据管理</el-menu-item>
        <el-menu-item index="/backstage/submit">提交管理</el-menu-item>
        <el-menu-item index="/backstage/tag">标签管理</el-menu-item>
        <el-menu-item index="/backstage/problemcollection"
          >问题集管理</el-menu-item
        >
      </el-menu>
    </el-col>
    <el-col class="tik-home-container-content" :span="20">
      <router-view></router-view>
    </el-col>
  </el-row>
</template>

<script>
import TikHeader from "@/components/backstage/TikHeader.vue";
export default {
  components: { TikHeader },
  data() {
    return {
      activeIndex: "",
    };
  },
  mounted() {
    document.title = "Tik Online Judge 后台管理系统";
    this.activeIndex = this.$route.href;
  },
  methods: {},
};
</script>
<style lang="sass" scoped>
.tik-home-container
  margin-top: 4px
  width: 100vw
  height: calc( 100% - 54px )
  .el-col-4
    border-right: 1px solid #e6e6e6
    min-width: 200px
  .tik-home-container-content
    padding: 20px 30px
    height: 100%
.el-menu
  border-right: none !important
  width: 100% !important
</style>
