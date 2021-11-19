<template>
  <tik-avatar :src="user.avatar" :name="user.nickname"></tik-avatar>
</template>
<script>
import TikAvatar from "@/components/common/TikAvatar.vue";
import { getData } from "@/js/common_data_operation";
export default {
  props: {
    uid: Number,
  },
  components: {
    TikAvatar,
  },
  data() {
    return {
      user: {
        nickname: "加载中",
      },
    };
  },
  methods: {
    loadData() {
      getData("/auth/anonymous/index/" + this.uid).then((res) => {
        if (res.success) {
          this.user = res.dto;
        }
      });
    },
  },
  watch: {
    uid(newId, oldId) {
      if (newId) {
        this.loadData();
      }
    },
  },
  mounted() {
    if (this.uid) {
      this.loadData();
    }
  },
};
</script>

<style lang='sass' scoped>
</style>