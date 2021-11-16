<template>
  <tik-avatar :src="group.avatar" :name="group.name"></tik-avatar>
</template>
<script>
import TikAvatar from "@/components/common/TikAvatar.vue";
import { getData } from "@/js/common_data_operation";
export default {
  props: {
    groupId: Number,
  },
  components: {
    TikAvatar,
  },
  data() {
    return {
      group: {
        name: "加载中",
      },
    };
  },
  methods: {
    loadData() {
      getData("/social/group/" + this.groupId).then((res) => {
        if (res.success) {
          this.group = res.dto;
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
</style>