<template>
  <el-table
    :data="problems"
    height="calc( 100vh - 200px )"
    stripe
    :header-cell-style="{ textAlign: 'center' }"
    :cell-style="{ textAlign: 'center' }"
  >
    <el-table-column prop="id" label="编号" width="100"> </el-table-column>
    <el-table-column prop="name" label="问题">
      <template #default="scope">
        <el-link :href="'/problem/' + scope.row.id" type="primary">{{
          scope.row.name
        }}</el-link>
      </template>
    </el-table-column>
    <!-- <el-table-column prop="ratio" label="Ratio(AC/Submit)" width="180">
    </el-table-column> -->
    <el-table-column prop="updateTime" label="时间" width="100">
      <template #default="scope">
        {{ new Date(scope.row.updateTime).toSimpleString() }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    problems: Array,
  },
  data() {
    return {};
  },
};
</script>

<style lang="sass" scoped>
.el-table__body-wrapper::-webkit-scrollbar
  width: 6px // 横向滚动条
  height: 6px // 纵向滚动条 必写
.el-table__body-wrapper::-webkit-scrollbar-thumb
  background-color: #000
  border-radius: 3px
</style>