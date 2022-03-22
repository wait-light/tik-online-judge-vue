<template>
  <div class="groups" v-if="groups && groups.length > 0">
    <el-row>
      <el-col class="item-warper" :lg="8" :md="12" :xs="24" v-for="item in groups" :key="item" >
        <el-card class="group-item" :body-style="{ padding: '0px' }">
          <div class="group-image" :style="'background-image: url(\'' + item.avatar + '\');'"></div>
          <div style="padding: 14px">
            <div class="bottom">
              <router-link :to="`/group/${item.id}`">{{ item.name }}</router-link>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <el-empty class="groups" v-else description="未加入任何群组"></el-empty>
</template>
<script>
import { getData } from "@/js/common_data_operation";
export default {
  data() {
    return {
      groups: [],
    };
  },
  methods: {
    loadData() {
      getData("/social/group/myGroups").then((result) => {
        if (result.success) {
          this.groups = result.dto;
        }
      });
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style lang='sass' scoped>

.box
  margin: 10px auto
.groups
  display: flex
  padding: 10px
  background: #f9f9f9
  // flex-wrap: wrap
  width: 100%
  box-sizing: border-box
  .el-row
    width: 100%
    margin: 10px
    .el-card
      box-sizing: border-box
      border: 0
      // padding: 20px
      // margin: 0 10px 
.item-warper
  padding: 10px
.group-item
  width: 100%
  text-align: center
.group-image
  height: 30vh
  width: 100%
  background-size: cover
  background-repeat: no-repeat
</style>