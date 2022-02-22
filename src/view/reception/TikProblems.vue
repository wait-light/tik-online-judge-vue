<template>
  <div class="main-problem-box tik-scrollbar">
    <h1>题集</h1>
    <tik-problem-list
      class="problems"
      style="width: 80%"
      :problems="problems"
    ></tik-problem-list>
    <el-pagination
      :hide-on-single-page="hideOnSinglePage"
      @size-change="pageSizeChange"
      @current-change="pageChange"
      :current-page="pageInfo.page"
      :page-sizes="pageInfo.pageSizes"
      :page-size="pageInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.total"
    >
    </el-pagination>
  </div>
</template>

<script>
import TikProblemList from "@/components/reception/TikProblemList.vue";
import {
  getOne,
  update,
  getList,
  deleteById,
  commonajaxWithData,
} from "@/js/common_data_operation.js";
export default {
  components: {
    TikProblemList,
  },
  data() {
    return {
      collectionId: 0,
      problems: [],
      pageInfo: {
        pageSize: 1,
        page: 1,
        total: 0,
        pageSizes: [10, 20, 30, 50, 100],
      },
      hideOnSinglePage: true,
    };
  },
  methods: {
    async loadData() {
      let result = await getList(
        "/executor/problem-collection/" + this.collectionId,
        this.pageInfo.page,
        this.pageInfo.pageSize
      );
      if (result.success) {
        console.log(result);
        this.problems = result.list;
        this.pageInfo.pageSize = result.pageSize;
        this.pageInfo.page = result.page;
        this.pageInfo.total = result.total;
      }
    },
    async pageChange(page) {
      this.pageInfo.page = page;
      this.loadData();
    },
    async pageSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.loadData();
    },
  },
  mounted() {
    let id = this.$route.params.id;
    let toNumber = Number(id);
    if (toNumber && Number.isInteger(toNumber) && toNumber > 0) {
      this.collectionId = toNumber;
      this.loadData();
    }
  },
};
</script>

<style lang="sass" scoped>
@import "@/sass/_variables"
.main-problem-box
  height: 100%
  background: #f9f9f9
  padding: 10px
  .pagination
    text-align: center
    margin-top: 15px
  .problems
    border: $border
    margin: 0 auto
    border-radius: $large-radius
  h1
    margin-top: 0
    text-align: center
    color: $secondary-color
</style>