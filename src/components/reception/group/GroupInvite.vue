<template>
  <el-form ref="invite" :model="invite" label-width="120px">
    <el-form-item label="受邀人">
      <el-input
        clearable
        v-model="invite.invitees"
        placeholder="请输入受邀人的账号或邮箱"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="invitePost">邀请</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { postData } from "@/js/common_data_operation"
export default {
  data() {
    return {
      invite: {
          invitees:"",
          groupId:0
      },
    };
  },
  methods: {
    invitePost() {
      postData("/social/invite/",this.invite,true)
    },
  },
  mounted(){
      this.invite.groupId = this.$route.params.groupId
  }
};
</script>
<style lang="sass" scoped>
</style>