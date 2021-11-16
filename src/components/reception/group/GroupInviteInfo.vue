<template>
  <div class="container">
    <div v-if="inviteMessage && inviteMessage.length > 0">
      <div
        class="invite-info-item"
        v-for="item in inviteMessage"
        :key="item.id"
      >
        <div class="invite-info">
          <user-title :uid="item.initiator"></user-title>
          <span class="info">邀请你加入</span>
          <group-title :groupId="item.groupId"></group-title>
        </div>
        <div style="display: flex">
          <el-button
            style="align-self: center"
            type="success"
            size="mini"
            @click="consumeInvite(item.id, 'ACCEPT')"
            >同意</el-button
          >
          <el-button
            style="align-self: center"
            type="danger"
            size="mini"
            @click="consumeInvite(item.id, 'REJECT')"
            >拒绝</el-button
          >
        </div>
      </div>
    </div>
    <el-empty v-else description="没有邀请信息"></el-empty>
  </div>
</template>
<script>
import { getData, putData } from "@/js/common_data_operation";
import GroupTitle from "@/components/reception/group/GroupTitle.vue";
import UserTitle from "@/components/common/UserTtile.vue";
export default {
  components: {
    GroupTitle,
    UserTitle,
  },
  data() {
    return {
      inviteMessage: [],
    };
  },
  methods: {
    loadData() {
      getData("/social/invite/myInvited").then((res) => {
        if (res.success) {
          this.inviteMessage = res.dto;
          console.log(res);
        }
      });
    },
    consumeInvite(id, status) {
      putData(
        `/social/invite/${id}`,
        {
          inviteStatus: status,
        },
        true
      ).then((res) => {
        if (res.success) {
          this.loadData();
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
@import "@/sass/_variables"
.container
  width: 1200px
  margin: 0 auto
.invite-info
  display: flex
  .info
    margin: 0 10px
    align-self: center
    font-size: 10px
    color: $secondary-color
.invite-info-item
  border: 1px solid var(--el-border-color-base)
  padding: 5px 10px
  margin: 5px 0
  border-radius: $large-radius
  display: flex
  justify-content: space-between
</style>