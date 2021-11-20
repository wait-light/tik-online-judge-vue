<template>
  <el-row style="padding: 0">
    <el-col :span="3" class="menu-container">
      <el-card shadow="never">
        <img :src="group.avatar" class="image" />
        <h1>{{ group.name }}</h1>
      </el-card>

      <ul>
        <router-link
          :to="`/group/${$route.params.groupId}/tasks`"
          custom
          v-slot="{ href, isActive, navigate }"
        >
          <li :class="[isActive && 'active-class']" @click="navigate">
            <a :href="href">任务</a>
          </li>
        </router-link>
        <router-link
          :to="`/group/${$route.params.groupId}/resource`"
          custom
          v-slot="{ href, isActive, navigate }"
        >
          <li :class="[isActive && 'active-class']" @click="navigate">
            <a :href="href">资料</a>
          </li>
        </router-link>
      </ul>
      <el-divider></el-divider>
      <ul>
        <router-link
          :to="`/group/${$route.params.groupId}/invite`"
          custom
          v-slot="{ href, isActive, navigate }"
        >
          <li :class="[isActive && 'active-class']" @click="navigate">
            <a :href="href">邀请</a>
          </li>
        </router-link>
        <router-link
          :to="`/group/${$route.params.groupId}/problems`"
          custom
          v-slot="{ href, isActive, navigate }"
        >
          <li :class="[isActive && 'active-class']" @click="navigate">
            <a :href="href">题库</a>
          </li>
        </router-link>
        <router-link
          :to="`/group/${$route.params.groupId}/task/manager`"
          custom
          v-slot="{ href, isActive, navigate }"
        >
          <li :class="[isActive && 'active-class']" @click="navigate">
            <a :href="href">任务管理</a>
          </li>
        </router-link>
         <router-link
          :to="`/group/${$route.params.groupId}/user-manager`"
          custom
          v-slot="{ href, isActive, navigate }"
        >
          <li :class="[isActive && 'active-class']" @click="navigate">
            <a :href="href">人员管理</a>
          </li>
        </router-link>
      </ul>
    </el-col>
    <el-col :span="21" class="content-container">
      <router-view></router-view>
    </el-col>
  </el-row>
</template>

<script>
import { getData } from "@/js/common_data_operation";
export default {
  data() {
    return {
      group: {},
    };
  },
  mounted() {
    this.loadData(this.$route.params.groupId);
  },
  methods: {
    loadData(id) {
      getData(`/social/group/${id}`).then((res) => {
        if (res.success) {
          this.group = res.dto;
        }
      });
    },
  },
};
</script>
<style lang="sass" scoped>
@import "@/sass/_variables"
.menu-container
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04)
  padding: 0
  overflow: scroll
  height: calc( 100vh - 50px )
  h1
    text-align: center
    font-size: 6px
  ul
    list-style: none
    text-align: center
    padding: 0
    li
      border-radius: $large-radius
      padding: 10px
      font-size: 15px
      &:hover
        background: $auxiliary-color
        cursor: pointer
    a
      text-decoration-line: none
.content-container
  margin-top: 5px
  padding: 20px 30px 20px 40px
  height: calc( 100vh - 55px )
  box-sizing: border-box
  overflow: scroll
.active-class
  background: $auxiliary-color
  a
    color: $minor-color
.image
  width: 100%
  display: block
</style>
