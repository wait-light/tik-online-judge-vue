<template>
  <h4 style="text-align: center">问题添加/修改</h4>
  <el-form
    :rules="rules"
    class="container"
    ref="problem"
    :model="problem"
    label-width="80px"
  >
    <el-form-item label="名称" prop="name">
      <el-input v-model="problem.name"></el-input>
    </el-form-item>
    <el-form-item label="问题描述" prop="problemDescribe">
      <md-editor v-model="problem.problemDescribe" />
    </el-form-item>
    <el-form-item label="输入描述" prop="inputDescrible">
      <md-editor style="height: 200px" v-model="problem.inputDescrible" />
    </el-form-item>
    <el-form-item label="输出描述" prop="outputDescrible">
      <md-editor style="height: 200px" v-model="problem.outputDescrible" />
    </el-form-item>
    <el-form-item label="输入样例" prop="input">
      <el-input :rows="2" v-model="problem.input" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="输出样例" prop="output">
      <el-input :rows="2" v-model="problem.output" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="启用" prop="status">
      <el-switch v-model="problem.status"></el-switch>
    </el-form-item>
    <el-form-item label="开启共享" prop="share">
      <el-switch v-model="problem.share"></el-switch>
    </el-form-item>
    <el-form-item label="操作">
      <el-button v-if="!problem.id" type="primary" @click="addProblem"
        >添加</el-button
      >
      <el-button v-if="problem.id" type="warning">修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { commonajaxWithData } from "@/js/common_data_operation.js";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
export default {
  components: {
    MdEditor,
  },
  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        problemDescribe: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        inputDescrible: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        outputDescrible: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        input: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        output: [
          {
            required: true,
            trigger: "blur",
          },
        ],
      },
      type: "add",
      problem: {
        status: true,
        collectionId: 0,
      },
    };
  },
  mounted() {
    if (this.$route.params.collectionid) {
      this.type = "add";
      this.problem.collectionId = this.$route.params.collectionid;
    } else if (this.$route.params.problemid) {
      this.type = "update";
      this.problem.problemid = this.$route.params.problemid;
    }
  },
  methods: {
    addProblem() {
      this.$refs["problem"].validate((valid) => {
        if (valid) {
          commonajaxWithData(
            `/executor/problem-collection/problem/${this.problem.collectionId}`,
            "post",
            this.problem
          ).then((result) => {
            if (result.success) {
              this.$router.push("/backstage/problemcollection");
            }
          });
          return true;
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="sass" scoped>
.container
  padding: 10px 15px
</style>