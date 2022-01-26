<template>
  <el-card class="task-describe">
    <h1>{{ task.name }}</h1>
    <span class="time"
      >任务时间：{{ new Date(task.beginTime).toLocaleString() }} 到
      {{ new Date(task.endTime).toLocaleString() }}</span
    >
    <el-divider></el-divider>
    <user-title :uid="task.createUserId"></user-title>
    <span class="time">发布时间：{{ new Date(task.createTime).toLocaleString() }}</span>
    <div>
      <p style="word-wrap: break-word">
        {{ task.taskIntroduce }}
      </p>
    </div>
  </el-card>
  <p>完成情况：{{ finishCount }} / {{ problems.length }}</p>
  <el-card v-if="problems" class="task-detail">
    <router-link
      class="task-item"
      v-for="item in problems"
      :key="item.id"
      :to="`/problem/${item.id}?secretKey=${item.secretKey}`"
    >
      <cicle-success
        v-if="problemFinishStatus && problemFinishStatus[item]"
      ></cicle-success>
      <cicle-wrong v-else></cicle-wrong>
      <p>{{ item.name }}</p>
    </router-link>
  </el-card>
  <el-empty v-else description="没有任务"></el-empty>
</template>

<script>
import CicleSuccess from "@/components/common/CicleSuccess.vue";
import CicleWrong from "@/components/common/CicleWrong.vue";
import UserTitle from "@/components/common/UserTitle.vue";
import {
  commonajaxWithData,
  stringifyGet,
  getData,
} from "@/js/common_data_operation";
export default {
  components: {
    CicleSuccess,
    CicleWrong,
    UserTitle,
  },
  data() {
    return {
      task: {},
      problems: [],
      problemFinishStatus: {},
      finishCount: 0,
    };
  },
  methods: {
    loadData() {
      getData(
        `/social/task/${this.$route.params.groupId}/${this.$route.params.taskId}`
      ).then((res) => {
        if (res.success) {
          this.task = res.task;
          this.problems = res.problems;
        }
      });
    },
    loadProblemIsFinished() {
      stringifyGet("/executor/user/problem/status", {
        pid: this.problems,
      }).then((res) => {
        if (res.success) {
          this.problemFinishStatus = res.dto;
          let finishCount = 0;
          for (let i in res.dto) {
            if (res.dto[i]) {
              finishCount++;
            }
          }
          this.finishCount = finishCount;
        }
      });
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style lang="sass" scoped>
@import "@/sass/_variables"
.task-describe
  h1
    font-size: 18px
.task-detail
  margin-top: 20px
.time
  color: $secondary-color
  font-size: 8px
.task-item
  padding: 10px
  border-radius: $large-radius
  border-bottom: 1px solid var(--el-border-color-base)
  display: flex
  p
    margin: 0 0 0 20px
    text-align: center
    line-height: 28px
    color: $minor-color
  &:hover
    background: $auxiliary-color
    cursor: pointer
  // display: flex
  // justify-content: space-between
</style>