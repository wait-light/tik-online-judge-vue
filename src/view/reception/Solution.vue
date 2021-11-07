<template>
  <div class="box">
    <h3>{{ solution.title }}</h3>
    <div class="baseMessage-box">
      <span class="baseMessage">解题人: {{ solutioner }}</span>
      <span class="baseMessage"
        >发布时间: {{ dateStringFormat(solution.createTime) }}</span
      >
      <span class="baseMessage"
        >修改时间: {{ dateStringFormat(solution.updateTime) }}</span
      >
    </div>

    <md-editor v-model="solution.content" :previewOnly="true" />
  </div>
</template>

<script>
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { getOne } from "@/js/common_data_operation.js";
export default {
  components: { MdEditor },
  data() {
    return {
      solution: {
        id: 0,
        uid: 0,
      },
      solutioner:"tik-tik"
    };
  },
  mounted() {
    this.solution.id = this.$route.params.solutionId;
    this.getSolution();
  },
  methods: {
    dateStringFormat(dateString) {
      return new Date(dateString).toSimpleString();
    },
    getSolution() {
      getOne(`/social/solution/${this.solution.id}`).then((result) => {
        if (result.success) {
          console.log(result);
          this.solution = result.dto;
        }
      });
    },
  },
};
</script>

<style lang="sass" scoped>
@import '@/sass/_variables'
.box
    margin: 20px 25px
    padding: 25px
    min-height: 80vh
    box-shadow: $box-shadow
.baseMessage
    color: $secondary-color
    margin-right: 20px
    font-size: 10px
.baseMessage-box
    margin-bottom: 15px
</style>