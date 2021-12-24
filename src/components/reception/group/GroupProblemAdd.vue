<template>
  <el-steps :space="200" :active="1" simple>
    <el-step title="标题" :icon="Edit"></el-step>
    <el-step title="问题描述" :icon="UploadFilled"></el-step>
    <el-step title="输入描述" :icon="Picture"></el-step>
    <el-step title="输出描述" :icon="Picture"></el-step>
    <el-step title="输入样例" :icon="Picture"></el-step>
    <el-step title="输出样例" :icon="Picture"></el-step>
    <!-- <el-step title="共享" :icon="Picture"></el-step>
    <el-step title="启用" :icon="Picture"></el-step>
    <el-step title="上传" :icon="Picture"></el-step>-->
  </el-steps>

  <el-carousel :height="'calc( 100vh - 80px)'" :autoplay="false" arrow="always">
    <el-carousel-item class="step-box">
      <div class="step-box-item">
        <h1>标题</h1>
        <el-input placeholder="标题">asssdf</el-input>
      </div>
    </el-carousel-item>
    <el-carousel-item>
      <div style="margin:auto 0">asdasd</div>
    </el-carousel-item>
  </el-carousel>
  <!-- <div class="step-box">
    <div class="step-box-item">1</div>
    <div class="step-box-item">2</div>
  </div>-->
  <h4 style="text-align: center">{{ typeDescribe }}</h4>
  <el-form :rules="rules" class="container" ref="problem" :model="problem" label-width="80px">
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
      <el-button v-if="!problem.id" type="primary" @click="addProblem">添加</el-button>
      <el-button v-if="problem.id" type="warning" @click="updateProblem">修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { commonajaxWithData, getOne } from "@/js/common_data_operation.js";
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
      typeDescribe: "问题添加",
    };
  },
  mounted() {
    if (this.$route.params.collectionid) {
      this.type = "add";
      this.typeDescribe = "问题添加";
      this.problem.collectionId = this.$route.params.collectionid;
    } else if (this.$route.params.problemId) {
      this.type = "update";
      this.problem.id = this.$route.params.problemId;
      this.typeDescribe = "问题修改";
      this.loadProblemData();
    }
  },
  methods: {
    loadProblemData() {
      getOne("/executor/problem/" + this.problem.id).then((res) => {
        if (res.success) {
          this.problem = res.dto;
        }
      });
    },
    updateProblem() {
      this.$refs["problem"].validate((valid) => {
        if (valid) {
          commonajaxWithData(
            `/executor/collection-group/problems/${this.$route.params.groupId}`,
            "put",
            this.problem
          ).then((result) => {
            if (result.success) {
              this.$router.push(
                `/group/${this.$route.params.groupId}/problems`
              );
            }
          });
          return true;
        } else {
          return false;
        }
      });
    },
    addProblem() {
      this.$refs["problem"].validate((valid) => {
        if (valid) {
          commonajaxWithData(
            `/executor/collection-group/problems/${this.$route.params.groupId}`,
            "post",
            this.problem
          ).then((result) => {
            if (result.success) {
              this.$router.push(
                `/group/${this.$route.params.groupId}/problems`
              );
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

.step-box
  display: flex
  height: 100%
  justify-content: center
  .step-box-item
    display: block
    text-align: center
    // position: absolute
    margin: auto 0
    // height: 100%
    // width: 100%
.container
  padding: 10px 15px
</style>