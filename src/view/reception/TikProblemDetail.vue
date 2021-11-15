<template>
  <div
    class="problem-detail-box"
    @mouseup="cloasDrag"
    @mousemove="boxWidthDrag"
  >
    <el-tabs type="card" :style="{ width: leftBoxWidth }">
      <el-dialog
        v-if="user.login"
        v-model="submitDetail.open"
        v-loading="submitDetail.open"
        title="源码"
      >
        <el-button type="info" size="mini" @click="copyCode"
          >点击复制</el-button
        >
        <pre class="code-box">{{ submitDetail.content }}</pre>
      </el-dialog>
      <el-tab-pane label="问题详情">
        <problem-detail
          v-if="problem.id"
          :problemId="problem.id"
        ></problem-detail>
      </el-tab-pane>
      <el-tab-pane style="padding:10px;" label="提交" v-if="user.login">
        <el-button @click="submit" type="success">提交</el-button>
        <el-button @click="loadSubmitResults" type="info">刷新记录</el-button>
        <problem-submit-list
          v-if="problem.id"
          :problemId="problem.id"
        ></problem-submit-list>
      </el-tab-pane>
      <el-tab-pane label="题解">
        <div class="el-tab-pane-box" style="padding: 5px 15px;">
          <el-button
            v-if="user.login"
            type="primary"
            size="mini"
            @click="$router.push('/addSolution/' + problem.id)"
            >写题解</el-button
          >
          <tik-solution-list :problemId="problem.id"></tik-solution-list>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="排行">
        <div class="el-tab-pane-box submit-box"></div>
      </el-tab-pane> -->
    </el-tabs>

    <div @mousedown="openDrag" @mouseup="cloasDrag" class="box-size-slider">
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </div>
    <div class="problem-editor-submit-box" :style="{ width: rightBoxWidth }">
      <tik-code-editor ref="editor"></tik-code-editor>
    </div>
  </div>
</template>

<script>
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import TikCodeEditor from "@/components/common/TikCodeEditor.vue";
import ProblemDetail from "@/components/reception/problem/ProblemDetail.vue";
import ProblemSubmitList from "@/components/reception/problem/ProblemSubmitList.vue";
import { ElMessage } from "element-plus";
import { mapState } from "vuex";
import {
  getOne,
  save,
  commonajaxWithData,
} from "@/js/common_data_operation.js";
import TikSolutionList from "@/components/reception/TikSolutionList.vue";
export default {
  components: {
    TikCodeEditor,
    MdEditor,
    TikSolutionList,
    ProblemDetail,
    ProblemSubmitList,
  },
  data() {
    return {
      leftWidth: "50",
      problem: {},
      submitResults: [],
      draging: false,
      submitResults: [],
      submitDetail: {
        open: false,
        content: "",
      },
    };
  },
  methods: {
    openDrag() {
      this.draging = true;
    },
    cloasDrag() {
      this.draging = false;
    },
    resultTypeString(submit) {
      if (!submit.status) {
        return "等待测评";
      }
      return submit.status;
    },
    async submit() {
      let submit = {
        content: this.$refs.editor.code,
        languageType: this.$refs.editor.language,
        problemId: this.problem.id,
      };
      let result = await save("/executor/submit/judge", submit, false);
      if (result.success) {
        ElMessage({
          message: result.msg,
          type: "success",
        });
      } else {
        ElMessage({
          message: result.msg,
          type: "danger",
        });
      }
    },
    judgeId() {
      let id = Number(this.$route.params.id);
      if (id && Number.isInteger(id) && id > 0) {
        this.problem.id = id;
        return true;
      }
      return false;
    },
    boxWidthDrag(mousemove) {
      if (this.draging) {
        let width = (mousemove.x / mousemove.view.innerWidth) * 100;
        if (width <= 30) {
          width = 30;
        } else if (width >= 80) {
          width = 80;
        }
        this.leftWidth = width;
      }
    },
    async loadSubmitResults() {
      let result = await getOne("/executor/judge-result/" + this.problem.id);
      if (result.success) {
        this.submitResults = result.array;
      }
    },
  },
  computed: {
    leftBoxWidth() {
      return `calc( ${this.leftWidth}vw - 10px )`;
    },
    rightBoxWidth() {
      return `${100 - this.leftWidth}vw`;
    },
    ...mapState("user", {
      user: (state) => state.user,
    }),
  },
  async mounted() {
    this.judgeId()
  },
};
</script>

<style lang="sass" scoped>
@import '@/sass/_variables'
.code-box
  padding: 10px
  box-shadow: $box-shadow
  width: 100%
  height: 50vh
.problem-detail
  text-align: center
  height: 100%
.problem-detail-box
  display: flex
  height: calc( 100% - 52px )
.problem-editor-submit-box
  height: 100%
.problem-editor-submit-box
  display: flex
  flex-direction: column
  
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
.el-tab-pane-box
  height: calc( 100vh - 116px )
  overflow: auto
.box-size-slider
  background: #ddd
  cursor: col-resize
  width: 10px
  height: 100%
  position: relative
  display: flex
  flex-direction: column
  justify-content: center
  span
    margin: 0 auto
    padding: 0
    height: 10px
    user-select: none
    -webkit-user-select: none
    -ms-user-select: none
    -moz-user-select: none
    font-weight: 1000
    color: #aaa
.tips
  // font-weight: 1000
  color: $minor-color
.title
  color: $minor-color
  font-weight: 1000
</style>
