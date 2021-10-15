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
      </el-tab-pane>
      <el-tab-pane label="提交" v-if="user.login">
        <div class="el-tab-pane-box submit-box">
          <el-button @click="submit" type="success">提交</el-button>
          <el-button @click="loadSubmitResults" type="info">刷新记录</el-button>
          <h4 class="title">提交记录</h4>
          <div style="box-shadow: 5px 6px 5px #eee">
            <el-collapse accordion>
              <el-collapse-item
                v-for="submitResult in submitResults"
                :key="submitResult.submitId"
              >
                <template #title>
                  <el-button
                    style="margin-right: 10px"
                    @click="getSubmitDetail(submitResult.submitId)"
                    size="mini"
                    >查看详情</el-button
                  >
                  <span class="tips">提交时间：</span>
                  {{ new Date(submitResult.createTime).toLocaleString() }}
                  <el-tag class="submit-tag" :type="resultType(submitResult)">{{
                    resultTypeString(submitResult)
                  }}</el-tag>
                </template>
                <el-table
                  :header-cell-style="{ textAlign: 'center' }"
                  :cell-style="{ textAlign: 'center' }"
                  :data="submitResult.judgeResults"
                  style="width: 100%; margin-bottom: 20px"
                >
                  <el-table-column type="expand">
                    <template #default="props">
                      <span class="tips"> 错误信息 ：</span>
                      {{ props.row.errorOutput }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="executionTime" label="执行时间(ms)" />
                  <el-table-column label="运行结果">
                    <template #default="scope">
                      <el-tag size="mini" :type="judgeStatusType(scope.row)">{{
                        scope.row.judgeStatus
                      }}</el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="题解">
        <div class="el-tab-pane-box submit-box">
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
    copyCode() {
      navigator.clipboard.writeText(this.submitDetail.content);
      ElMessage({
        message: "已复制",
        type: "success",
      });
    },
    getSubmitDetail(id) {
      this.submitDetail.open = true;
      getOne(`/executor/submit/${id}`).then((result) => {
        if (result.success) {
          this.submitDetail.content = result.dto.content;
        }
      });
    },
    openDrag() {
      this.draging = true;
    },
    cloasDrag() {
      this.draging = false;
    },
    judgeStatusType(judge) {
      if (!judge.judgeStatus) {
        return "info";
      }
      if (judge.judgeStatus == "ACCEPT") {
        return "success";
      }
      if (judge.judgeStatus == "PRESENTATION_ERROR") {
        return "warning";
      }
      return "danger";
    },
    resultType(submit) {
      if (!submit.status) {
        return "info";
      }
      if (submit.status == "ACCEPT") {
        return "success";
      }
      if (submit.status == "PRESENTATION_ERROR") {
        return "warning";
      }
      return "danger";
    },
    resultTypeString(submit) {
      if (!submit.status) {
        return "等待测评";
      }
      return submit.status;
    },
    async loadData() {
      let result = await getOne("/executor/problem/" + this.problem.id);
      if (result.success) {
        this.problem = result.dto;
      }
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
    if (this.judgeId()) {
      await this.loadData();
    }
    document.title = `题目【${this.problem.name}】`;
    if (this.user.login) {
      this.loadSubmitResults();
    }
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
.submit-box
  // display: flex
  padding: 5px 15px
  // flex-direction: column
.submit-tag
  margin-left: 15px
.tips
  // font-weight: 1000
  color: $minor-color
.title
  color: $minor-color
  font-weight: 1000
</style>
