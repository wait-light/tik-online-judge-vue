<template>
  <div class="container">
    <div class="invite-info-item" v-for="item in 3" :key="item">
      <div class="invite-info">
        <tik-avatar
          :src="'https://w.wallhaven.cc/full/g7/wallhaven-g75r7d.jpg'"
          name="某某"
        ></tik-avatar>
        <span class="info">邀请你加入</span>
        <tik-avatar
          :src="'https://w.wallhaven.cc/full/g7/wallhaven-g75r7d.jpg'"
          name="学生会"
        ></tik-avatar>
      </div>

      <div style="display:flex">
        <el-button style="align-self: center" type="success" size="mini">同意</el-button>
        <el-button style="align-self: center" type="danger" size="mini">拒绝</el-button>
      </div>
    </div>
    <!-- <el-empty description="没有邀请信息"></el-empty> -->
  </div>
</template>
<script>
import TikAvatar from "@/components/common/TikAvatar.vue";
export default {
  components: {
    TikAvatar,
  },
  data() {},
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