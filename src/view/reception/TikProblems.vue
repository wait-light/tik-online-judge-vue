<template>
  <div class="main-problem-box tik-scrollbar">
    <h1>题集</h1>
    <tik-problem-list
      class="problems"
      style="width: 80%"
      :problems="problems"
    ></tik-problem-list>
    <el-pagination class="pagination" layout="prev, pager, next" :total="1000">
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
    };
  },
  methods: {
    async loadData() {
      let result = await getList(
        "/executor/problem-collection/" + this.collectionId
      );
      if (result.success) {
        this.problems = result.list;
      }
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
  padding: 10px
  .pagination
    text-align: center
    margin-top: 15px
  .problems
    margin: 0 auto
  h1
    margin-top: 0
    text-align: center
    color: $secondary-color
</style>