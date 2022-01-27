<template>
  <el-row style="padding: 0">
    <el-col v-if="!isMobile()" :md="3" class="menu-container">
      <el-card shadow="never">
        <img :src="group.avatar" class="image" />
        <h1>{{ group.name }}</h1>
      </el-card>
      <ul v-if="userType == 'COMMON'">
        <router-link
          :to="`/group/${$route.params.groupId}/tasks`"
          custom
          v-slot="{ href, isActive, navigate }"
        >
          <li :class="[isActive && 'active-class']" @click="navigate">
            <a :href="href">任务</a>
          </li>
        </router-link>
        <!-- <router-link
          :to="`/group/${$route.params.groupId}/resource`"
          custom
          v-slot="{ href, isActive, navigate }"
        >
          <li :class="[isActive && 'active-class']" @click="navigate">
            <a :href="href">资料</a>
          </li>
        </router-link>-->
      </ul>
      <!-- <el-divider></el-divider> -->
      <ul v-if="userType == 'MASTER'">
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
    <el-col v-if="isMobile()" class="menu-container-phone">
      <ul v-if="userType == 'COMMON'">
        <router-link
          :to="`/group/${$route.params.groupId}/tasks`"
          custom
          v-slot="{ href, isActive, navigate }"
        >
          <li :class="[isActive && 'active-class']" @click="navigate">
            <a :href="href">任务</a>
          </li>
        </router-link>
        <!-- <router-link
          :to="`/group/${$route.params.groupId}/resource`"
          custom
          v-slot="{ href, isActive, navigate }"
        >
          <li :class="[isActive && 'active-class']" @click="navigate">
            <a :href="href">资料</a>
          </li>
        </router-link>-->
      </ul>
      <!-- <el-divider></el-divider> -->
      <ul v-if="userType == 'MASTER'">
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
    <el-col v-if="!isMobile()" :md="21" class="content-container">
      <router-view></router-view>
    </el-col>
    <el-col v-if="isMobile()" :xs="24" class="content-container-phone">
      <router-view></router-view>
    </el-col>
  </el-row>
</template>

<script>
import { getData } from "@/js/common_data_operation";
import { isMobile } from "@/js/mobile";
export default {
  data() {
    return {
      group: {},
      userType: "",
    };
  },
  mounted() {
    this.loadData(this.$route.params.groupId);
    this.getUserType();
  },
  methods: {
    loadData(id) {
      getData(`/social/group/${id}`).then((res) => {
        if (res.success) {
          this.group = res.dto;
        }
      });
    },
    isMobile,
    getUserType() {
      //  TODO 暂时取消权限认证
      // this.userType = "MASTER"
      // console.log("asd",this.userType,"MASTER");
      getData(`/social/group-user/${this.$route.params.groupId}`).then(
        (res) => {
          if (res.success) {
            console.log(res);
            this.userType = res.dto;
            if (this.userType == "COMMON") {
              this.$router.push(`/group/${this.$route.params.groupId}/tasks`);
            } else if (this.userType == "MASTER") {
              this.$router.push(`/group/${this.$route.params.groupId}/task/manager`);
            }
          }
        }
      );
    },
  },
};
</script>
<style lang="sass" scoped>
@import "@/sass/_variables"
.menu-container
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04)
  padding: 0
  margin: 0
  border: 0
  // overflow: scroll 
  height: calc( 100vh - 55px )
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
      text-decoration-line: nonecontent-container-phone
.menu-container-phone
  padding: 0
  margin: 0
  border-bottom: $border
  display: flex
  height: 50px
  // overflow: scroll 
  ul
    margin: auto 0
    display: flex
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
  padding: 20px 10px 10px 20px
  height: 100%
  box-sizing: border-box
  overflow: scroll
.content-container-phone
  padding: 20px 10px 10px 20px
  height: calc( 100vh - 100px )
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
