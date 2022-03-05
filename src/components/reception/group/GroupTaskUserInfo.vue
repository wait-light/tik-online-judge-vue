<template>
  <el-card class="task-describe">
    <h1 class="title" title="前往详情" @click="$router.push(`/race/${$route.params.taskId}`)">{{ task.name }}<el-icon><right /></el-icon></h1>
    <span class="time">
      任务时间：{{ new Date(task.beginTime).toLocaleString() }} 到
      {{ new Date(task.endTime).toLocaleString() }}
    </span>
    <el-divider></el-divider>
    <user-title :uid="task.createUserId"></user-title>
    <span class="time">发布时间：{{ new Date(task.createTime).toLocaleString() }}</span>
    <div>
      <p style="word-wrap: break-word">{{ task.taskIntroduce }}</p>
    </div>
  </el-card>
</template>
<script>
import { stringifyGet, getData } from "@/js/common_data_operation";
import UserTitle from "@/components/common/UserTitle.vue";
import { Right } from "@element-plus/icons"
export default {
  components: { UserTitle,Right },
  data() {
    return {
      task: {},
      userlist: [],
      problems: [],
      finishCount: 0,
      problemMap: "",
      problemItemDisplay: true,
      userProblemStatus: "",
      userFinishCountMap: new Map(),
    };
  },
  methods: {
    loadData() {
      getData(
        `/social/task/manager/${this.$route.params.groupId}/${this.$route.params.taskId}`
      ).then((res) => {
        if (res.success) {
          this.task = res.task;
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
.task-describe
  h1
    font-size: 18px
.time
  color: $secondary-color
  font-size: 8px

.user-list-item
  position: relative
  border-bottom: $border
  border-left: $border
  border-right: $border
  border-radius: $large-radius
  padding: 5px
  &:hover
    background: $auxiliary-color
  &:first-child
    border-top: $border
  // border: $border
.problem-item
  margin: 2px 5px
  border: $border
  padding: 10px
  border-radius: $large-radius
  // &:hover
  //   background: red
.problem-item-box
  padding: 12px 10px 0px 10px
.title
  cursor: pointer
</style>