<template>
  <router-link :to="`/group/${$route.params.groupId}/task`">
    <el-button style="margin-bottom: 30px" size="mini" type="primary"
      >新建任务</el-button
    ></router-link
  >

  <!-- <el-empty v-if="tasks" description="未发布任何任务"></el-empty> -->
  <router-link
    :to="`/group/${$route.params.groupId}/task`"
    v-for="item in 5"
    :key="item"
    custom
    v-slot="{ href, route, navigate }"
  >
    <div class="task-item" @click="navigate">
      <a :href="href">asdss</a>
      <!-- <span class="cicle">任务</span> -->
      <!-- <el-image
              style="width: 50px; height: 50px"
              src="https://w.wallhaven.cc/full/k7/wallhaven-k7lpe6.png"
              fit="cover"
            ></el-image> -->
      <p>第{{ item }}周作业</p>
      <!-- <span class="task-item-time">{{ new Date().toLocaleString() }}</span> -->
      <!-- <button @click="a = 2">asdasd</button> -->
      <div>
        <el-button size="mini" type="warning" @click="stop">修改</el-button>
        <el-button size="mini" type="danger" @click="stop">删除</el-button>
      </div>
    </div>
  </router-link>
</template>
<script>
export default {
  data() {
    return {
      tasks: [],
    };
  },
  methods: {
    stop(event) {
      event.stopPropagation();
    },
  },
};
</script>

<style lang='sass' scoped>
@import "@/sass/_variables"
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