<template>
  <div class="demo-collapse">
    <el-collapse v-model="activeName">
      <el-collapse-item title="进行中" name="1">
        <router-link to="/group/task" v-for="item in 5" :key="item">
          <div class="task-item">
            <span class="cicle">任务</span>
            <!-- <el-image
              style="width: 50px; height: 50px"
              src="https://w.wallhaven.cc/full/k7/wallhaven-k7lpe6.png"
              fit="cover"
            ></el-image> -->
            <p>第{{ item }}周作业</p>
            <span class="task-item-time">{{
              new Date().toLocaleString()
            }}</span>
          </div>
        </router-link>
      </el-collapse-item>
      <el-collapse-item title="已过期" name="2">
        <el-empty description="什么任务也没有"></el-empty>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName:"1"
    };
  },
};
</script>
<style lang="sass" scoped>
@import "@/sass/_variables"
a
  text-decoration-line: none
.task-item
  border-radius: $small-radius
  box-sizing: border-box
  display: flex
  padding: 15px 20px
  width: 100%
  height: 80px
  justify-content: space-between
  text-decoration-line: none
  border-bottom: 1px solid var(--el-border-color-base)
  &:hover
      background: $auxiliary-color
      cursor: pointer
  p
    font-size: 1.45em
    color: $minor-color
    line-height: 50px
    padding: 0
    margin: 0
.cicle
  display: inline-block
  text-align: center
  background: var(--el-border-color-base)
  line-height: 50px
  color: black
  height: 50px
  width: 50px
  border-radius: 100%
.task-item-time
  font-size: 12px
  color: $secondary-color
  align-self: center
</style>
