<template>
  <div class="box">
    <div class="type-box">
      <el-radio-group
        @change="change"
        v-model="type"
        fill="#999999"
        size="medium"
      >
        <el-radio-button label="我的群组"></el-radio-button>
        <el-radio-button label="受邀信息"></el-radio-button>
        <label
          @click="groupAdd.open = true"
          class="el-radio-button--medium"
          aria-checked="false"
          tabindex="-1"
          ><span class="el-radio-button__inner">创建群组</span></label
        >
      </el-radio-group>
    </div>

    <el-dialog v-model="groupAdd.open" title="创建群组">
      <group-add-or-update></group-add-or-update>
    </el-dialog>
    <router-view></router-view>
  </div>
</template>

<script>
import GroupAddOrUpdate from "@/components/reception/group/GroupAddOrUpdate.vue";
export default {
  components: {
    GroupAddOrUpdate,
  },
  data() {
    return {
      type: "我的群组",
      groupAdd: {
        open: false,
      },
    };
  },
  methods: {
    change(label) {
      console.log(this.type);
      if (label === "我的群组") {
        this.$router.push("/groups/list");
      } else if (label === "受邀信息") {
        this.$router.push("/groups/invite-info");
      }
    },
  },
  mounted() {
    if (this.$route.href == "/groups/invite-info") {
      this.type = "受邀信息";
    } else if (this.$route.href == "/groups/list") {
      this.type = "我的群组";
    }
  },
};
</script>

<style lang="sass" scoped>
@import "@/sass/_variables"
.type-box
  box-shadow: $box-shadow
  border-radius: $large-radius
  width: fit-content
  margin: 10px auto 20px
  padding: 10px
</style>