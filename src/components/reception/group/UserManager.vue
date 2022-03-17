<template>
  <div class="invite-box">
    <el-row style="width:100%;">
      <el-col style="margin:0 auto;" :lg="16" :md="18">
        <el-input clearable v-model="invite.invitees" placeholder="请输入受邀人的账号或邮箱">
          <template #append>
             <el-button type="primary" @click="invitePost">邀请</el-button>
          </template>
        </el-input>
      </el-col>
    
    </el-row>
  </div>
  <el-row>
    <el-col style="margin: 0 auto" :lg="16" :md="18">
      <div class="user-list-item" v-for="user in userlist" :key="user.uid">
        <user-title :uid="user.uid"></user-title>
        <el-tag size="mini" :type="userTypeColor(user.userType)">
          {{
            userType(user.userType)
          }}
        </el-tag>
        <div class="buttons">
          <el-button
            @click="removeUser(user)"
            v-if="displayRemove(user.userType)"
            size="mini"
            type="danger"
          >移出</el-button>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { getData, deleteData,postData } from "@/js/common_data_operation";
import userTitle from "@/components/common/UserTitle.vue";
export default {
  components: {
    userTitle,
  },
  data() {
    return {
      userlist: [],
      invite: {
        invitees: "",
        groupId: 0,
      },
    };
  },
  methods: {
    invitePost() {
      postData("/social/invite/", this.invite, true);
    },
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
    this.invite.groupId = this.$route.params.groupId;
  },
};
</script>

<style lang='sass' scoped>

@import "@/sass/_variables"
.invite-box
  display: flex
  margin-bottom: 15px
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