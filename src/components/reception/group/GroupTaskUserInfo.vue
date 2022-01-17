<template>
  <el-card class="task-describe">
    <h1>{{ task.name }}</h1>
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
  <h3>完成情况：{{ finishCount }}/{{ userlist.length }}</h3>
  <el-collapse accordion>
    <el-collapse-item v-for="user in userlist" :key="user.uid" :name="user.uid">
      <template #title>
        <div v-if="userProblemStatus">
          <user-title :uid="user.uid"></user-title>
          {{ userFinishCountMap.get(user.uid) }}/{{ problems.length }}
        </div>
      </template>
      <div class="problem-item-box" v-if="problemItemDisplay">
        <router-link
          v-for="item in problems"
          :key="item.id"
          :to="`/problem/${item.id}/?secretKey=${item.secretKey}`"
        >
          <span class="problem-item">
            {{ item.name }}
            <cicle-success v-if="userProblemStatus && userProblemStatus[user.uid][item.id]"></cicle-success>
            <cicle-wrong v-else></cicle-wrong>
          </span>
        </router-link>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
import { stringifyGet, getData } from "@/js/common_data_operation";
import UserTitle from "@/components/common/UserTitle.vue";
import CicleSuccess from "@/components/common/CicleSuccess.vue";
import CicleWrong from "@/components/common/CicleWrong.vue";
export default {
  components: { UserTitle, CicleSuccess, CicleWrong },
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
  watch: {
    userlist(newValue, oldValue) {
      if (
        newValue &&
        newValue.length > 0 &&
        this.problems &&
        this.problems.length > 0
      ) {
        this.loadProblemIsFinished();
      }
    },
    problems(newValue, oldValue) {
      if (
        newValue &&
        newValue.length > 0 &&
        this.userlist &&
        this.userlist.length > 0
      ) {
        this.loadProblemIsFinished();
      }
    },
  },
  methods: {
    makeCount(status) {
      let userSuccessCount = 0;
      let keys = Object.getOwnPropertyNames(status);
      keys.forEach((key) => {
        if (status[key]) {
          userSuccessCount++;
        }
      });
      if (userSuccessCount == this.problems.length) {
        this.finishCount++;
        console.log("asdawsd");
      }
      return userSuccessCount;
    },
    loadData() {
      getData(
        `/social/task/manager/${this.$route.params.groupId}/${this.$route.params.taskId}`
      ).then((res) => {
        if (res.success) {
          this.task = res.task;
          this.problems = res.problems;
        }
      });
    },
    loadUserInfo() {
      getData(`/social/group-user/userlist/${this.$route.params.groupId}`).then(
        (res) => {
          if (res.success) {
            for (let index = res.dto.length - 1; index >= 0; index--) {
              const element = res.dto[index];
              if (element.userType == "MASTER") {
                res.dto.splice(index, 1);
              }
            }
            this.userlist = res.dto;
          }
        }
      );
    },
    loadProblemIsFinished() {
      let uids = [];
      this.userlist.forEach((item) => {
        uids.push(item.uid);
      });
      stringifyGet("/executor/user/task/problem/status", {
        uid: uids,
        pid: this.problems.map((item) => item.id),
      }).then((res) => {
        this.userProblemStatus = res.dto;
        this.calculateUserFinish();
        console.log(this.problems);
      });
    },
    calculateUserFinish() {
      let map = new Map();
      let finishCount = 0;
      // this.finishCount = 0;
      const status = this.userProblemStatus;
      this.userlist.forEach((user) => {
        let count = 0;
        this.problems.forEach((pid) => {
          if (status[user.uid][pid]) {
            count++;
          }
        });
        if (count == this.problems.length) {
          finishCount++;
        }
        map.set(user.uid, count);
      });
      this.userFinishCountMap = map;
      this.finishCount = finishCount
    },
  },
  mounted() {
    this.loadData();
    this.loadUserInfo();
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
</style>