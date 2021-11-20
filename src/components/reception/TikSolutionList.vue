<template>
  <el-empty v-if="total <= 0" description="还没人发布题解"></el-empty>
  <ul
    infinite-scroll-delay="100"
    :infinite-scroll-disabled="!hasNextPage"
    v-infinite-scroll="getSolutions"
    class="infinite-list"
    style="overflow: auto"
  >
    <router-link
      v-for="solution in solutions"
      :key="solution.id"
      :to="`/solution/${solution.id}`"
      target="_blank"
    >
      <li class="infinite-list-item">
        <div>{{ solution.title }}</div>
        <span> {{ solution.content }}</span>
      </li>
    </router-link>
  </ul>
</template>
<script>
import { getList } from "@/js/common_data_operation.js";
export default {
  props: {
    problemId: Number,
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      hasNextPage: true,
      total: 0,
      solutions: [],
    };
  },
  watch: {
    problemId(newValue, oldValue) {
      this.hasNextPage = true;
      this.solutions = [];
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
    getSolutions() {
      if (this.hasNextPage && this.problemId) {
        getList(
          `/social/solution/solutions/${this.problemId}`,
          this.page,
          this.pageSize
        ).then((result) => {
          if (result.success && this.hasNextPage) {
            this.solutions.push(...result.list);
            this.page++;
            this.pageSize = result.pageSize;
            this.hasNextPage = result.hasNextPage;
            this.total = result.total;
          }
        });
      }
    },
  },
};
</script>

<style lang="sass" scoped>
@import '@/sass/_variables'
.infinite-list
  height: 300px
  padding: 0
  margin: 10px -10px
  list-style: none
.infinite-list-item
  display: flex
  padding: 5px 15px
  align-items: center
  border-bottom: $border
  height: 50px
  cursor: pointer
  margin: 0px
  color: black
  display: block
  &:hover
    background: $auxiliary-color
  div
    font-size: 14px
    margin-bottom: 5px
    font-weight: 700
  span
    color: $secondary-color
    font-size: 8px
a
  text-decoration: none
</style>