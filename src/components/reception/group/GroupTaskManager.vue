<template>
  <router-link :to="`/group/${$route.params.groupId}/task`">
    <el-button style="margin-bottom: 30px" size="mini" type="primary"
      >新建任务</el-button
    ></router-link
  >

 
  <router-link
    :to="`/group/${$route.params.groupId}/task/${item.id}`"
    v-for="item in tasks"
    :key="item"
    custom
    v-slot="{ href, navigate }"
  >
    <div class="task-item" @click="navigate">
      <a :href="href">{{ item.name }}</a>
      <div>
        <div
          style="
            display: inline-block;
            margin-right: 20px;
            vertical-align: middle;
          "
        >
          <span class="task-item-time"
            >开始时间：{{ new Date(item.beginTime).toLocaleString() }}</span
          >
          <br />
          <span class="task-item-time"
            >截止时间：{{ new Date(item.endTime).toLocaleString() }}</span
          >
        </div>

        <!-- <el-button size="mini" type="warning" @click.stop="updateTask(item.id)"
          >修改</el-button
        > -->
        <el-button size="mini" type="danger" @click.stop="deleteTask(item.id)"
          >删除</el-button
        >
      </div>
    </div>
  </router-link>
   <el-empty v-if="tasks" description="未发布任何任务"></el-empty>
</template>
<script>
import { getData, deleteData } from "@/js/common_data_operation";
// import { ElMessageBox } from "element-plus";

export default {
  data() {
    return {
      tasks: [],
    };
  },
  methods: {
    stop(event) {},
    loadData() {
      getData(`/social/group-task-manager/${this.$route.params.groupId}`).then(
        (res) => {
          if (res.success) {
            this.tasks = res.dto;
          }
        }
      );
    },
    updateTask(taskId) {
      this.$router.push(
        `/group/${this.$route.params.groupId}/task/${taskId}/manager`
      );
    },
    deleteTask(taskId) {
      deleteData(
        `/social/group-task-manager/${this.$route.params.groupId}/${taskId}`,
        null,
        true
      ).then(res=>{
        if(res.success){
          this.loadData()
        }
      });
    },
  },
  mounted() {
    this.loadData();
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
  a,div
    align-self: center
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