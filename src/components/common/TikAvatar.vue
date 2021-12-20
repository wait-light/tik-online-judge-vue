<template>
  <div class="avatar-container">
    <el-avatar :size="size" :src="src"></el-avatar>
    <span>{{ name }}</span>
  </div>
</template>
<script>
export default {
  props: {
    src: String,
    name: String,
    size: {
      default: "small"
    }
  }
};
</script>

<style lang='sass' scoped>
.avatar-container
  margin: 3px 6px
  display: inline-block
  // width: 80px
  span
    margin-left: 10px
    font-size: 12px
    vertical-align: middle
</style>