<template>
  <a>
    <tik-avatar
      @click.stop="$router.push(`/personCenter/${uid}`)"
      class="title-box"
      :size="size"
      :src="user.avatar"
      :name="user.nickname"
    ></tik-avatar>
  </a>
</template>
<script>
import TikAvatar from "@/components/common/TikAvatar.vue";
import { getData } from "@/js/common_data_operation";
export default {
  props: {
    uid: [Number,String],
    showName: {
      default: true
    },
    size: {
      default: "medium"
    }
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
          if (!this.showName) {
            this.user.nickname = ""
          }
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

.title-box
  &:hover
    cursor: pointer
</style>