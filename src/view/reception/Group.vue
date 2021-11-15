<template>
  <el-row style="padding: 0">
    <el-col :span="3" class="menu-container">
      <el-card shadow="never" >
        <img
          src="https://w.wallhaven.cc/full/g7/wallhaven-g75r7d.jpg"
          class="image"
        />
        <h1>18计算机科学与技术1班</h1>
      </el-card>

      <ul>
        <router-link
          to="/group/tasks"
          custom
          v-slot="{ href, isActive, navigate }"
        >
          <li :class="[isActive && 'active-class']" @click="navigate">
            <a :href="href">任务</a>
          </li>
        </router-link>
        <router-link
          to="/group/resource"
          custom
          v-slot="{ href, isActive, navigate }"
        >
          <li :class="[isActive && 'active-class']" @click="navigate">
            <a :href="href">资料</a>
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
import { defineComponent } from "vue";

export default defineComponent({
  components: {},
  setup() {},
});
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
