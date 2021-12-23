<template>
  <el-row justify="center" class="box">
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

      <md-editor :previewTheme="'vuepress'" @onGetCatalog="onGetCatalog" v-model="solution.content" :previewOnly="true" />
      <el-divider style="margin-top: 20px;"></el-divider>
      <h1 id="comment" class="comment-division">评论</h1>
      <solution-comment></solution-comment>
    </el-col>
    <el-col :lg="5" :md="5" class>
   
      <catalog  :anchorOffset="-50" class="catalog" :heads="catalogList"></catalog>
    </el-col>
  </el-row>

  <el-backtop />
  <!-- <el-backtop /> -->
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
.catalog
  border-radius: $large-radius
  position: sticky
  max-height: 500px
  width: 100%
  overflow: auto
  background: white
  top: 75px
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
  background: #f9f9f9
  // padding: 25px
  // width: 100%
  border-radius: $small-radius
  .box-content
    margin: 25px 5%
    background: #fff
    padding: 10px 25px
.baseMessage
  color: $secondary-color
  margin-left: 10px
  margin-right: 20px
  font-size: 10px
.baseMessage-box
  margin-bottom: 15px
</style>