<template>
  <div class="groups">
    <el-card
      class="group-item"
      v-for="item in groups"
      :key="item"
      :body-style="{ padding: '0px' }"
    >
      <div
        class="image"
        :style="'background-image: url(\'' + item.avatar + '\');'"
      ></div>
      <div style="padding: 14px">
        <div class="bottom">
          <router-link to="/group">{{ item.name }}</router-link>
        </div>
      </div>
    </el-card>
  </div>
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
  width: 1300px
  margin: 0 auto
  display: flex
  flex-wrap: wrap
.group-item
  width: 301px
  margin: 10px
  height: 100%
  text-align: center
.image
  height: 120px
  background-size: cover
  background-repeat: no-repeat
</style>