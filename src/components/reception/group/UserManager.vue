<template>
  <el-row>
    <el-col style="margin: 0 auto" :lg="16" :md="18">
      <div class="user-list-item" v-for="user in userlist" :key="user.uid">
        <user-title :uid="user.uid"></user-title>
        <el-tag size="mini" :type="userTypeColor(user.userType)">{{
          userType(user.userType)
        }}</el-tag>
        <div class="buttons">
          <el-button
            @click="removeUser(user)"
            v-if="displayRemove(user.userType)"
            size="mini"
            type="danger"
            >移出</el-button
          >
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { getData, deleteData } from "@/js/common_data_operation";
import userTitle from "@/components/common/UserTitle.vue";
export default {
  components: {
    userTitle,
  },
  data() {
    return {
      userlist: [],
    };
  },
  methods: {
    removeUser(user) {
      deleteData(
        `/social/group-user/${this.$route.params.groupId}/${user.uid}`,
        null,
        true,
        "是否移除此用户"
      ).then((res) => {
        if (res.success) {
          this.loadUserInfo();
        }
      });
    },
    loadUserInfo() {
      getData(`/social/group-user/userlist/${this.$route.params.groupId}`).then(
        (res) => {
          if (res.success) {
            this.userlist = res.dto;
          }
        }
      );
    },
    userType(type) {
      if (type == "MASTER") {
        return "群主";
      } else if (type == "COMMON") {
        return "群员";
      }
      return type;
    },
    userTypeColor(type) {
      if (type == "MASTER") {
        return "warning";
      }
      return "info";
    },
    displayRemove(type) {
      if (type == "MASTER") {
        return false;
      }
      return true;
    },
  },
  mounted() {
    this.loadUserInfo();
  },
};
</script>

<style lang='sass' scoped>
@import "@/sass/_variables"
.buttons
  position: absolute
  right: 10px
  top: 50%
  transform: translateY(-50%)
.user-list-item
  position: relative
  border-bottom: $border
  border-left: $border
  border-right: $border
  border-radius: $large-radius
  padding: 5px
  &:hover
    background: $auxiliary-color
  &:first-child
    border-top: $border
  // border: $border
</style>