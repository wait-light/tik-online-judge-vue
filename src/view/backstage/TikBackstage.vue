<template>
  <tik-header></tik-header>
  <el-row class="tik-home-container">
    <el-col :span="4">
      <el-menu router background-color="#FFFFFF" :default-active="activeIndex">
        <el-sub-menu
          :index="`${index}`"
          v-for="(directory, index) in directorys"
          :key="directory.id"
        >
          <template #title>
            <el-icon v-if="directory.icon">
              <component :is="Icons[directory.icon]"></component>
              {{ directory.name }}
            </el-icon>
          </template>
          <el-menu-item-group>
            <el-menu-item :index="sub.url" v-for="sub in directory.children" :key="sub.id">
              <el-icon v-if="directory.icon">
                <component :is="Icons[sub.icon]"></component>
                {{ sub.name }}
              </el-icon>
            </el-menu-item>
            <!-- <el-menu-item :index="sub.url" v-for="sub in directory." :key="sub.id">{{ sub.name }}</el-menu-item> -->
            <!-- <el-menu-item index="/backstage/user">用户管理</el-menu-item>
            <el-menu-item index="/backstage/role">角色管理</el-menu-item>
            <el-menu-item index="/backstage/menu">权限菜单管理</el-menu-item>
            <el-menu-item index="/backstage/ask">权限申请</el-menu-item>-->
          </el-menu-item-group>
        </el-sub-menu>
        <!-- <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <question-filled />问题管理
            </el-icon>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/backstage/problem">问题管理</el-menu-item>
            <el-menu-item index="/backstage/problemcollection">问题集管理</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>-->
      </el-menu>
    </el-col>
    <el-col class="tik-home-container-content" :span="20">
      <router-view></router-view>
    </el-col>
  </el-row>
</template>

<script setup>
import TikHeader from "@/components/backstage/TikHeader.vue";
import { getData } from "@/js/common_data_operation";
import * as Icons from "@element-plus/icons"
import { computed, ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import { useRoute } from 'vue-router';
import { useStore } from "vuex";

const store = useStore()
const route = useRoute()
const activeIndex = ref("")

const directorys = computed(() => {
  return store.getters["auth/getDirectory"]("/backstage")
})

onMounted(() => {
  document.title = "Tik Online Judge 后台管理系统";
  activeIndex.value = route.href
})
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
