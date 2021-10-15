<template></template>

<script>
export default {
  mounted() {
    var path = this.$route.query.path;
    if (!path) {
      path = "/";
    }
    this.$router.push(path);
  },
};
</script>

<style>
</style>