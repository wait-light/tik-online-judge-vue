<template>
  <div class="problem-detail-description el-tab-pane-box">
    <el-skeleton v-if="!problem.name" :rows="10" animated />
    <div v-if="problem.name">
      <h1>
        {{ problem.name }}
      </h1>
      <h3>题目描述</h3>
      <md-editor v-model="problem.problemDescribe" :previewOnly="true" />
      <!-- <p>{{ problem.problemDescribe }}</p> -->
      <h3>输入描述</h3>
      <md-editor v-model="problem.inputDescrible" :previewOnly="true" />
      <!-- <p>{{ problem.inputDescrible }}</p> -->
      <h3>输出描述</h3>
      <md-editor v-model="problem.outputDescrible" :previewOnly="true" />
      <!-- <p>{{ problem.outputDescrible }}</p> -->
      <h3>样例输入</h3>
      <!-- <md-editor v-model="problem.input" :previewOnly="true" /> -->
      <pre class="data-io">{{ problem.input }}</pre>
      <h3>样例输出</h3>
      <!-- <md-editor v-model="problem.output" :previewOnly="true" /> -->
      <pre class="data-io">{{ problem.output }}</pre>
    </div>
  </div>
</template>
<script>
import MdEditor from "md-editor-v3";
import { getOne } from "@/js/common_data_operation.js";
export default {
  components: {
    MdEditor,
  },
  props: ["problemId"],
  data() {
    return {
      problem: {},
    };
  },
  methods: {
    async loadData() {
      let result = await getOne("/executor/problem/" + this.problemId);
      if (result.success) {
        this.problem = result.dto;
      }
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style lang='sass' scoped>
@import '@/sass/_variables'
.problem-detail-description
    padding: 0 15px
    .data-io
        background-color: $auxiliary-color
        padding: 10px
    h1
        font-size: 20px
        text-align: center
    h3
        font-size: 15px
</style>