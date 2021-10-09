<template>
  <div class="home-box">
    <tik-header></tik-header>
    <router-view></router-view>
    <!-- <tik-bottom></tik-bottom> -->
  </div>
</template>

<script>
import TikHeader from "@/components/reception/TikHeader.vue";
import TikBottom from "@/components/reception/TikBottom.vue";
export default {
  components: {
    TikHeader,
    TikBottom,
  },
};
</script>

<style lang="sass" scoped>
.home-box
  display: flex
  flex-direction: column
  // justify-content: space-between
  height: 100%
</style>