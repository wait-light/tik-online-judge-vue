<template>
  <div class="main-content-box tik-scrollbar">
    <div class="collection-type-box">
      <el-radio-group v-model="collectionType" fill="#999999" size="medium">
        <el-radio-button label="公开集"></el-radio-button>
        <el-radio-button label="私人集"></el-radio-button>
      </el-radio-group>
    </div>
    <el-empty
      v-if="!table || (table && table.length <= 0)"
      description="没有任何题集"
    ></el-empty>
    <div class="collections">
      <div class="collections-item" v-for="item in table" :key="item.id">
        <el-icon>
          <folder />
        </el-icon>
        <el-link :href="'/problemlist/' + item.id">{{ item.name }}</el-link>
        <span class="endtime" v-if="item.beginTime >= item.endTime">长期</span>
        <span class="endtime" v-else-if="new Date() > new Date(item.endTime)"
          >已过期</span
        >
        <span class="endtime" v-else
          >{{ new Date(item.beginTime).toSimpleString() }} 到
          {{ new Date(item.endTime).toSimpleString() }}</span
        >
      </div>
    </div>
  </div>
</template>
<script>
import { Folder } from "@element-plus/icons";
import {
  getOne,
  update,
  getList,
  deleteById,
  commonajaxWithData,
} from "@/js/common_data_operation.js";
export default {
  components: {
    Folder,
  },
  data() {
    return {
      collectionType: "公开集",
      table: [],
    };
  },
  watch: {
    collectionType() {
      this.loadData();
    },
  },
  methods: {
    async pageChange(page) {
      this.pageInfo.page = page;
      this.loadData();
    },
    async loadData() {
      let result;
      if (this.collectionType == "公开集") {
        result = await getList("/executor/problem-collection/public");
      } else {
        result = await getList("/executor/problem-collection/priate");
      }
      if (result.success) {
        this.table = result.list;
      }
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style lang="sass" scoped>
@import "@/sass/_variables"
.main-content-box
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
.collection-type-box
  box-shadow: $box-shadow
  border-radius: $large-radius
  width: fit-content
  margin: 0 auto
  padding: 10px
.collections
  box-shadow: $box-shadow
  border-radius: $large-radius
  margin: 20px auto 0px
  padding: 20px
  width: 50%
.collections-item
  padding: 10px
  .endtime
    float: right
    color: $minor-color
    font-size: 10px
</style>
