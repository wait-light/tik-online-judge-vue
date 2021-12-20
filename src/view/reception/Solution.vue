<template>
  <el-row class="box">
    <el-col class="box-content" :lg="12" :md="16">
      <h3>{{ solution.title }}</h3>
      <div class="baseMessage-box">
        <user-title :uid="solution.uid"></user-title>
        <span class="baseMessage">发布时间: {{ dateStringFormat(solution.createTime) }}</span>
        <span class="baseMessage">修改时间: {{ dateStringFormat(solution.updateTime) }}</span>

        <router-link :to="`/problem/${$route.params.problemId}`">
          <span class="baseMessage">前往问题详情</span>
        </router-link>
      </div>
      <el-divider></el-divider>
      <md-editor v-model="solution.content" :previewOnly="true" />
      <el-divider style="margin-top: 20px;"></el-divider>
      <h1 class="comment-division">评论</h1>
      <solution-comment></solution-comment>
    </el-col>
  </el-row>
  <el-backtop />
</template>

<script>
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { getOne } from "@/js/common_data_operation.js";
import UserTitle from "@/components/common/UserTitle.vue";
import SolutionComment from "@/components/reception/solution/SolutionComment.vue";
export default {
  components: { MdEditor, UserTitle, SolutionComment },
  data() {
    return {
      solution: {
        id: 0,
        uid: 0,
      },
      solutioner: "匿名用户",
    };
  },
  mounted() {
    this.solution.id = this.$route.params.solutionId;
    this.getSolution();
  },
  methods: {
    dateStringFormat(dateString) {
      return new Date(dateString).toSimpleString();
    },
    getSolution() {
      getOne(`/social/solution/${this.solution.id}`).then((result) => {
        if (result.success) {
          this.solution = result.dto;
        }
      });
    },
  },
};
</script>

<style lang="sass" scoped>
@import '@/sass/_variables'
.left-arrow
  background: black
.comment-division
  font-size: 18px
.box
  margin: 0 auto
  padding: 25px
  width: 100%
  .box-content
    margin: 0 auto
.baseMessage
  color: $secondary-color
  margin-left: 10px
  margin-right: 20px
  font-size: 10px
.baseMessage-box
  margin-bottom: 15px
</style>