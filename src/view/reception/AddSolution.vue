<template>
  <div class="box">
    <el-form :model="solution" ref="solution" class="demo-form-inline">
      <el-form-item label="标题">
        <el-input v-model="solution.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="题解">
        <md-editor v-model="solution.content" />
      </el-form-item>
      <el-form-item label="展示">
        <el-switch v-model="solution.status"></el-switch>
      </el-form-item>
      <el-form-item label="操作">
        <el-button type="primary" v-if="!solution.id" @click="addSolution"
          >发布</el-button
        >
        <el-button type="success" v-if="solution.id" @click="updateSolution"
          >修改</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import MdEditor from "md-editor-v3";
import {
  getOne,
  update,
  getList,
  deleteById,
  save,
  commonajaxWithData,
} from "@/js/common_data_operation.js";
import "md-editor-v3/lib/style.css";
export default {
  components: { MdEditor },
  data() {
    return {
      solution: {
        id: 0,
        problemId: 0,
        title: "",
        content: "",
        status: true,
      },
      rules: {
        title: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.solution.problemId = this.$route.params.problemId;
    this.hasSolution();
  },
  methods: {
    hasSolution() {
      commonajaxWithData(
        `/executor/solution/hasSolution/${this.solution.problemId}`,
        "get",
        null,
        false
      ).then((result) => {
        if (result.success) {
          if (result.solutionId) {
            this.solution.id = result.solutionId;
            this.getSolution();
          }
        }
      });
    },
    getSolution() {
      commonajaxWithData(
        `/executor/solution/${this.solution.id}`,
        "get",
        null,
        false
      ).then((result) => {
        if (result.success) {
          this.solution = result.dto;
        }
      });
    },
    addSolution() {
      this.$refs["solution"].validate((valid) => {
        if (valid) {
          commonajaxWithData(
            `/executor/solution`,
            "post",
            this.solution,
            true
          ).then((result) => {
            if (result.success) {
              this.$router.push("/problem/" + this.solution.problemId);
            }
          });
          return true;
        } else {
          return false;
        }
      });
    },
    updateSolution() {
      this.$refs["solution"].validate((valid) => {
        if (valid) {
          commonajaxWithData(
            `/executor/solution/${this.solution.id}`,
            "put",
            this.solution,
            true
          ).then((result) => {
            if (result.success) {
              this.$router.push("/problem/" + this.solution.problemId);
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
.box
    padding: 20px 50px
</style>