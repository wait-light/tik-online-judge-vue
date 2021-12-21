<template>
  <el-row class="box">
    <el-col class="box-content" :lg="12" :md="16">
      <h3>{{ solution.title }}</h3>
      <div class="baseMessage-box">
        <user-title :uid="solution.uid"></user-title>
        <span class="baseMessage">发布时间: {{ dateStringFormat(solution.createTime) }}</span>
        <span class="baseMessage">修改时间: {{ dateStringFormat(solution.updateTime) }}</span>
      </div>
      <el-divider></el-divider>
      <div v-if="$route.params.problemId">
        <router-link :to="`/problem/${$route.params.problemId}`" target="_blank">
          <p class="to-detail">
            <span>&#8592;</span>前往问题详情
          </p>
        </router-link>
        <el-divider></el-divider>
      </div>

      <md-editor @onGetCatalog="onGetCatalog" v-model="solution.content" :previewOnly="true" />
      <el-divider style="margin-top: 20px;"></el-divider>
      <h1 class="comment-division">评论</h1>
      <solution-comment></solution-comment>
    </el-col>
    <el-col :lg="4" :md="4">
      <catalog class="test" :heads="catalogList"></catalog>
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
import Catalog from "@/components/common/Catalog.vue"
export default {
  components: { MdEditor, UserTitle, SolutionComment, Catalog },
  data() {
    return {
      solution: {
        id: 0,
        uid: 0,
      },
      solutioner: "匿名用户",
      catalogList: []
    };
  },
  mounted() {
    this.solution.id = this.$route.params.solutionId;
    this.getSolution();
  },
  methods: {
    onGetCatalog(list) {
      this.catalogList = list
    },
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
.test
  position: -webkit-sticky
  position: sticky
  height: 500px
  overflow: auto  
  // width: 100px
  top: 50px
.to-detail
  margin: -25px 0
  padding: 20px
  &:hover
    background: $division-color
  span
    font-size: 20px
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