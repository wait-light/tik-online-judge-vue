<template>
  <el-row justify="center" class="box">
    <el-col class="box-content" :lg="12" :sm="16">
      <h3 id="tik-title">{{ solution.title }}</h3>
      <el-row class="baseMessage-box">
        <el-col :xs="24">
          <user-title :uid="solution.uid"></user-title>
        </el-col>
        <el-col
          :xs="9"
          :sm="8"
          class="baseMessage"
        >发布时间: {{ dateStringFormat(solution.createTime) }}</el-col>
        <el-col
          :xs="9"
          :sm="8"
          class="baseMessage"
        >修改时间: {{ dateStringFormat(solution.updateTime) }}</el-col>
        <el-col :xs="6" :sm="8" class="baseMessage">浏览量:{{ solution.view }}</el-col>
      </el-row>
      <el-divider></el-divider>
      <div v-if="$route.params.problemId">
        <router-link
          :to="`/problem/${$route.params.problemId}?secretKey=${secretKey}`"
          target="_blank"
        >
          <p class="to-detail">
            <span>&#8592;</span>前往问题详情
          </p>
        </router-link>
        <el-divider></el-divider>
      </div>

      <md-editor @onGetCatalog="onGetCatalog" v-model="solution.content" :previewOnly="true" />
      <el-divider style="margin-top: 20px;"></el-divider>
      <h1 id="comment" class="comment-division">评论</h1>
      <solution-comment></solution-comment>
    </el-col>
    <el-col :md="5">
      <catalog :anchorOffset="-50" v-if="!isMobileSize()" class="catalog" :heads="catalogList"></catalog>
    </el-col>
  </el-row>
  <div
    v-if="isMobileSize()"
    class="mobile-catalog-open"
    @click="mobileCatalogButtonShow = !mobileCatalogButtonShow"
  >
    <el-icon
      style="display: flex; align-items: center;justify-content: center;width:100%;height:100%;"
      color="#409eff"
      :size="20"
    >
      <Menu />
    </el-icon>
  </div>
  <catalog
    v-show="mobileCatalogButtonShow"
    :anchorOffset="-50"
    v-if="isMobileSize()"
    class="mobile-catalog"
    :heads="catalogList"
  ></catalog>
  <el-backtop />
  <!-- <el-backtop /> -->
</template>

<script>
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import 'element-plus/theme-chalk/display.css'
import { getOne } from "@/js/common_data_operation.js";
import UserTitle from "@/components/common/UserTitle.vue";
import SolutionComment from "@/components/reception/solution/SolutionComment.vue";
import Catalog from "@/components/common/Catalog.vue"
import { Menu } from "@element-plus/icons";
export default {
  components: { MdEditor, UserTitle, SolutionComment, Catalog, Menu },
  data() {
    return {
      solution: {
        id: 0,
        uid: 0,
      },
      secretKey: "",
      solutioner: "匿名用户",
      catalogList: [],
      mobileCatalogButtonShow: false
    };
  },
  mounted() {
    this.solution.id = this.$route.params.solutionId;
    this.getSolution();
  },
  methods: {
    isMobileSize() {
      return window.innerWidth < 992;
    },
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
          this.secretKey = result.secretKey
        }
      });
    },
  },
};
</script>

<style lang="sass" scoped>

@import '@/sass/_variables'
.mobile-catalog-open
  position: fixed
  right: 40px
  bottom: 90px
  width: 40px
  height: 40px
  box-shadow: $box-shadow
  border-radius: 50%
  z-index: 500
  background: white
  &:hover
    cursor: pointer
.mobile-catalog
  position: fixed
  border: $border
  top: 50%
  transform: translateY(-50%)
  right: 0
  z-index: 500
  // border: 1px solid black
  box-shadow: $box-shadow
  border-radius: $large-radius
  min-height: 50px
  width: 50vw
  max-height: 50vh
  overflow: scroll
  background: white
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
  border-radius: $small-radius
  .box-content
    margin: 25px 5%
    background: #fff
    padding: 10px 25px
.baseMessage
  color: $secondary-color
  // display: inline-block
  text-align: center
  // vertical-align: middle
  margin: auto 0
  // margin-left: 10px
  // margin-right: 20px
  font-size: 10px
.baseMessage-box
  margin-bottom: 15px
</style>