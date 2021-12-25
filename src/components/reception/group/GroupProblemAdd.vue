<template>
  <el-row style="height:95%">
    <el-col :xs="3" :sm="3" style="height:100%">
      <el-steps direction="vertical" :active="active">
        <el-step title="基础信息"></el-step>
        <el-step title="问题描述"></el-step>
        <el-step title="输入描述"></el-step>
        <el-step title="输出描述"></el-step>
        <el-step finish-status="finish" title="样例"></el-step>
      </el-steps>
    </el-col>
    <el-col :push="1" :xs="18" :sm="20">
      <el-carousel
        ref="stepContent"
        direction="vertical"
        :height="'calc( 100vh - 200px )'"
        class="step-container"
        @change="change"
        :loop="false"
        :autoplay="false"
        indicator-position="none"
        arrow="never"
      >
        <el-carousel-item class="step-box">
          <div class="step-box-item">
            <el-form :rules="rules" v-model="problem" label-width="80px">
              <el-form-item label="标题">
                <el-input placeholder="标题" v-model="problem.name" />
              </el-form-item>
              <el-form-item label="共享" title="是否共享给其他题集">
                <el-switch v-model="problem.share"></el-switch>
              </el-form-item>
              <el-form-item label="立即启用" title="是否立即开启使用">
                <el-switch v-model="problem.status"></el-switch>
              </el-form-item>
            </el-form>

            <!-- <el-input ></el-input> -->
          </div>
        </el-carousel-item>
        <el-carousel-item class="step-box">
          <md-editor style="height: 100%;" v-model="problem.problemDescribe" />
          <!-- <div style="margin:auto 0">asdasd</div> -->
        </el-carousel-item>
        <el-carousel-item class="step-box">
          <md-editor style="height: 100%;" v-model="problem.inputDescrible" />
          <!-- <div style="margin:auto 0">asdasd</div> -->
        </el-carousel-item>
        <el-carousel-item class="step-box">
          <md-editor style="height: 100%;" v-model="problem.outputDescrible" />
          <!-- <div style="margin:auto 0">asdasd</div> -->
        </el-carousel-item>
        <el-carousel-item class="step-box">
          <el-form label-width="80px" style="width: 100%;">
            <el-form-item label="输入样例">
              <el-input rows="9" type="textarea" v-model="problem.input"></el-input>
            </el-form-item>
            <el-form-item label="输出样例">
              <el-input rows="9" type="textarea" v-model="problem.output"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button v-if="!problem.id" type="primary" @click="addProblem">添加</el-button>
              <el-button v-if="problem.id" type="warning" @click="updateProblem">修改</el-button>
              <!-- <el-button type="success" @click="">保存</el-button> -->
            </el-form-item>
          </el-form>
        </el-carousel-item>
      </el-carousel>
      <div style="float:right;margin-top:10px">
        <el-button size="mini" @click="preStep">上一步</el-button>
        <el-button size="mini" @click="netStep">下一步</el-button>
      </div>
    </el-col>
  </el-row>

  <!-- <h4 style="text-align: center">{{ typeDescribe }}</h4> -->
  <el-form :rules="rules" class="container" ref="problem" :model="problem" label-width="80px"></el-form>
</template>

<script>
import { commonajaxWithData, getOne } from "@/js/common_data_operation.js";
import MdEditor from "md-editor-v3";
import { isMobile } from "@/js/backstage/mobile";
import "md-editor-v3/lib/style.css";
//禁用tab跳转，防止出现页面畸形
document.onkeydown = function HandleTabKey(evt) {
  if (evt.keyCode == 9) {
    if (evt.preventDefault) {
      evt.preventDefault();
    }
    else {
      change
      evt.returnValue = false;
    }
  }
}

export default {
  components: {
    MdEditor,
  },
  data() {
    return {
      active: 0,
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
    isMobile,
    preStep() {
      this.$refs.stepContent.prev()
    },
    netStep() {
      this.$refs.stepContent.next()
    },
    change(now, old) {
      this.active = now
    },
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
            this.problem,
            true
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
            this.problem,
            true
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
@import '@/sass/_variables'
.switch
  margin-right: 20px
.title
  width: 80%
  margin: 10px 10%
  border: $border
  height: 60px
  text-indent: 30px
  font-size: 25px
  color: #333
  outline: none
  // border: 0
.step-box
  // text-align: center
  margin: 0 auto
  display: flex
  height: 100%
  width: 100%
  justify-content: center
  .step-box-item
    display: block
    // text-align: center
    width: 80%
    margin: auto 0
.container
  padding: 10px 15px
</style>