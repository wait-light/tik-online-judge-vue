<template>
  <div style="min-width: 510px" class="el-tab-pane-box submit-box">
    <el-dialog
      v-if="user.login"
      v-model="submitDetail.open"
      v-loading="submitDetail.open"
      title="源码"
    >
      <el-button type="info" size="mini" @click="copyCode">点击复制</el-button>
      <pre class="code-box">{{ submitDetail.content }}</pre>
    </el-dialog>
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
</template>
<script>
import { getOne } from "@/js/common_data_operation.js";
import { mapState } from "vuex";
export default {
  props: ["problemId"],
  data() {
    return {
      submitResults: [],
      submitDetail: {
        open: false,
        content: "",
      },
    };
  },
  mounted() {
    this.loadSubmitResults();
  },
  methods: {
    copyCode() {
      navigator.clipboard.writeText(this.submitDetail.content);
      ElMessage({
        message: "已复制",
        type: "success",
      });
    },
    loadSubmitResults() {
      getOne("/executor/judge-result/" + this.problemId).then((result) => {
        if (result.success) {
          this.submitResults = result.array;
        }
      });
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
    getSubmitDetail(id) {
      this.submitDetail.open = true;
      getOne(`/executor/submit/${id}`).then((result) => {
        if (result.success) {
          this.submitDetail.content = result.dto.content;
        }
      });
    },
    resultTypeString(submit) {
      if (!submit.status) {
        return "等待测评";
      }
      return submit.status;
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
  },
  computed: {
    ...mapState("user", {
      user: (state) => state.user,
    }),
  },
};
</script>

<style lang='sass' scoped>
.el-tab-pane-box
  height: calc( 100vh - 116px )
  overflow: auto
.submit-box
  padding: 5px 15px
.submit-tag
  margin-left: 10px
</style>