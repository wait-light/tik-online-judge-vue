<template>
  <div class="box">
    <div class="type-box">
      <el-radio-group @change="change" v-model="type" fill="#999999" size="medium">
        <el-radio-button label="我的群组"></el-radio-button>
        <el-radio-button label="受邀信息"></el-radio-button>
        <label
          v-if="createable"
          @click="groupAdd.open = true"
          class="el-radio-button--medium"
          aria-checked="false"
          tabindex="-1"
        >
          <span class="el-radio-button__inner">创建群组</span>
        </label>
        <label
          v-if="!createable"
          @click="groupCreatorApply.open = true"
          class="el-radio-button--medium"
          aria-checked="false"
          tabindex="-1"
        >
          <span class="el-radio-button__inner">申请创群</span>
        </label>
      </el-radio-group>
    </div>

    <el-dialog v-model="groupAdd.open" title="创建群组">
      <group-add-or-update></group-add-or-update>
    </el-dialog>
    <el-dialog :width="getDialogSize()" v-model="groupCreatorApply.open" title="申请创建群组权限">
      <group-creator-apply></group-creator-apply>
    </el-dialog>
    <router-view></router-view>
  </div>
</template>

<script>
import GroupAddOrUpdate from "@/components/reception/group/GroupAddOrUpdate.vue";
import groupCreatorApply from "@/components/reception/group/GroupCreatorApply.vue";
import { useStore } from "vuex";
import { computed, provide, reactive } from "vue";
export default {
  setup() {
    const store = useStore();
    store.dispatch("group/createableGet")
    const groupCreatorApply = reactive({
      open: false,
    })
    provide("groupCreatorApply", groupCreatorApply)
    return {
      createable: computed(() => store.state.group.createable),
      groupCreatorApply
    };
  },
  components: {
    GroupAddOrUpdate,
    groupCreatorApply,
  },
  data() {
    return {
      type: "我的群组",
      groupAdd: {
        open: false,
      },
    };
  },
  computed: {},
  methods: {

    change(label) {
      if (label === "我的群组") {
        this.$router.push("/groups/list");
      } else if (label === "受邀信息") {
        this.$router.push("/groups/invite-info");
      }
    },
    getDialogSize() {
      if (window.innerWidth < 992) {
        return '90%'
      } else {
        return '50%'
      }
    }
  },
  mounted() {
    document.title = "Tik Online Judge 群组"
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