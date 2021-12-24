<template>
  <div class="content-box">
    <el-row class="content-box" justify="center">
      <el-empty v-if="posts.length == 0" description="什么都没有"></el-empty>
      <div
        class="post-list"
        v-infinite-scroll="getSolutions"
        :infinite-scroll-disabled="!hasNextPage"
      >
        <div class="post-box" @click="goSolution(post.id)" v-for="post in posts" :key="post.id">
          <div class="post-header">
            <span class="post-user">{{ post.title }}</span>
            <span class="division"></span>
            <span class="post-time">{{ timeStr(new Date(post.createTime)) }}</span>
          </div>
          <div class="post-title">{{ post.title }}</div>
          <div class="post-content">{{ post.content }}</div>
          <div class="post-info">
            <div class="post-info-item">
              <el-icon>
                <View />
              </el-icon>
              <span>{{ post.view }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-row>
  </div>
  <!-- <el-empty v-if="total <= 0" description="还没人发布题解"></el-empty>
  <ul
    infinite-scroll-delay="100"
    :infinite-scroll-disabled="!hasNextPage"
    v-infinite-scroll="getSolutions"
    class="infinite-list"
    style="overflow: auto"
  >
    <router-link
      v-for="solution in solutions'_blank'"
      :key="solution.id"
      :to="`/solution/${problemId}/${solution.id}`"
      target="_blank"
    >
      <li class="infinite-list-item">
        <div>{{ solution.title }}</div>
        <span>{{ solution.content }}</span>
      </li>
    </router-link>
  </ul>-->
</template>
<script>
import { getList } from "@/js/common_data_operation.js";
import { View } from "@element-plus/icons";

export default {
  components: {
    View
  },
  props: {
    problemId: Number,
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      hasNextPage: true,
      total: 0,
      posts: [],
    };
  },
  watch: {
    problemId(newValue, oldValue) {
      this.hasNextPage = true;
      this.posts = [];
      this.page = 1;
      this.getSolutions();
    },
  },
  mounted() {
    if (this.problemId) {
      this.getSolutions();
    }
  },
  methods: {
    goSolution(id) {
      window.open(`/solution/${this.problemId}/${id}`, '_blank')
    },
    getSolutions() {
      if (this.hasNextPage && this.problemId) {
        getList(
          `/social/solution/solutions/${this.problemId}`,
          this.page,
          this.pageSize
        ).then((result) => {
          if (result.success && this.hasNextPage) {
            this.posts.push(...result.list);
            this.page++;
            this.pageSize = result.pageSize;
            this.hasNextPage = result.hasNextPage;
            this.total = result.total;
          }
        });
      }
    },
    timeStr(time) {
      let now = new Date().valueOf()
      let target = time.valueOf()
      let distance = (now - target) / 1000 / 60
      if (distance < 1) {
        return "刚刚"
      } else if (distance < 60) {
        return `${Math.floor(distance)}分钟前`
      } else if (distance < 1440) {
        return `${Math.floor(distance / 60)}小时前`
      } else if (distance < 43200) {
        return `${Math.floor(distance / 1440)}天前`
      } else if (distance < 518400) {
        return `${Math.floor(distance / 43200)}月前`
      } else {
        return `${Math.floor(distance / 518400)}年前`
      }
    }
  },
};
</script>

<style lang="sass" scoped>

@import '@/sass/_variables'
.post-list
  background: #fff
  border-bottom: $slim-border
  width: 100%
  .post-box
    padding: 15px
    border-bottom: $slim-border
    &:hover
      cursor: pointer
    .post-header
      font-size: 14px
      display: flex
      .post-user,.post-time
        margin-right: 10px
        color: #666
      .division
        margin-right: 10px
        position: relative
        top: 5px
    .post-title
      color: #444
      font-weight: 700
      // line-height: 24px
      text-overflow: ellipsis
      font-size: 16px
      margin: 8px 0px
    .post-content
      font-size: 13px
      color: #86909c
    .post-info
      margin-top: 5px
      .post-info-item
        color: #888
        font-size: 15px
        span
          position: relative
          bottom: 2px
          left: 3px
          font-size: 10px
.content-box
  background: #f9f9f9
  // min-height: 100%
  height: fit-content
    // min-height: 100%
  padding: 10px 10px
</style>