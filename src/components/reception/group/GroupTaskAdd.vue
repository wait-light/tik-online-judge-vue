<template>
  <el-form ref="taskForm" :rules="taskRules" :model="task" label-width="80px">
    <el-form-item label="标题" prop="name">
      <el-input v-model="task.name"></el-input>
    </el-form-item>
    <el-form-item label="描述">
      <el-input
        type="textarea"
        :rows="8"
        v-model="task.taskIntroduce"
      ></el-input>
    </el-form-item>
    <el-form-item label="开始时间" prop="beginTime">
      <el-date-picker
        v-model="task.beginTime"
        type="datetime"
        placeholder="选择开启时间"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="截止时间" prop="endTime">
      <el-date-picker
        v-model="task.endTime"
        type="datetime"
        placeholder="选择截止时间"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="选题">
      <el-tag
        @close="cancelTag(item[0])"
        v-for="item in selectedProblem"
        :key="item[0]"
        class="collection-item"
        closable
        >{{ item[1] }}</el-tag
      >
      <el-button type="success" size="small" @click="dialogOpen = true"
        >新增问题</el-button
      >
    </el-form-item>
    <el-form-item>
      <el-button @click="submit" type="warning" size="small">发布</el-button>
    </el-form-item>
    <el-dialog
      @opened="toggleRowSelection"
      v-model="dialogOpen"
      title="题库"
      fullscreen
      destroy-on-close
    >
      <el-select
        :loading="!collections"
        @focus="loadCollections"
        @change="collectionChange"
        style="margin-bottom: 10px"
        value-key="id"
        name="name"
        v-model="collection"
        placeholder="请选择题集"
      >
        <el-option
          v-for="item in collections"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-button
        class="problem-add-button"
        type="success"
        @click="dialogOpen = false"
        >添加</el-button
      >
      <el-table
        ref="problemsTable"
        @select="probelmSelect"
        @select-all="probelmSelect"
        style="margin-bottom: 10px"
        :data="problems"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="scope">
            {{ new Date(scope.row.createTime).toLocaleString() }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :hide-on-single-page="true"
        @size-change="sizeChange"
        @current-change="loadProblemList"
        :current-page="pageInfo.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total"
      >
      </el-pagination>
    </el-dialog>
  </el-form>
</template>
<script>
import { ElMessageBox, ElMessage } from "element-plus";
import { getData, postData, getList } from "@/js/common_data_operation";
export default {
  components: { ElMessageBox, ElMessage },
  data() {
    const checkDate = (rule, value, callback) => {
      if (!this.task.beginTime || !this.task.endTime) {
        callback();
      } else {
        if (this.task.endTime <= this.task.beginTime) {
          callback(new Error("开始时间必须小于截止时间"));
        } else {
          callback();
        }
      }
    };
    return {
      pageInfo: { total: 0, pageSize: 10, page: 1 },
      task: {
        title: "",
        beginTime: new Date(),
        endTime: "",
      },
      dialogOpen: false,
      collections: [],
      problems: [],
      collection: "",
      selectedProblem: new Map(),
      taskRules: {
        name: [
          { required: true, trigger: "blur", message: "标题不能为空" },
          { trigger: "" },
        ],
        beginTime: [
          {
            required: true,
            trigger: "blur",
            message: "开始时间不能为空",
          },
          {
            trigger: "blur",
            validator: checkDate,
          },
        ],
        endTime: [
          { required: true, trigger: "blur", message: "截止时间不能为空" },
        ],
      },
    };
  },
  methods: {
    async submit() {
      this.$refs.taskForm.validate(async (valid) => {
        if (valid) {
          let problems = [];
          let canSubmit = true;
          this.selectedProblem.forEach((name, id) => {
            problems.push(id);
          });
          if (problems.length <= 0) {
            canSubmit = false;
            await ElMessageBox.confirm("未选择任何问题，是否发布?", "Warning", {
              confirmButtonText: "确认",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                canSubmit = true;
              })
              .catch((res) => {});
          }
          if (canSubmit) {
            ElMessageBox.confirm("确认发布?", "Warning", {
              confirmButtonText: "确认",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                postData(
                  `/social/group-task-manager/${this.$route.params.groupId}`,
                  {
                    taskIntroduce: this.task.taskIntroduce,
                    name: this.task.name,
                    beginTime: this.task.beginTime,
                    endTime: this.task.endTime,
                    problems,
                  },
                  true
                ).then((res) => {
                  if (res.success) {
                    this.$router.push(
                      `/group/${this.$route.params.groupId}/task/manager`
                    );
                  }
                });
              })
              .catch((res) => {});
          }
        }
        return valid;
      });
    },
    cancelTag(tagId) {
      this.selectedProblem.delete(tagId);
    },
    probelmSelect(row) {
      //需要删除的问题id
      let needDeleteSet = new Set();
      this.problems.forEach((problem) => {
        needDeleteSet.add(problem.id);
      });
      for (let index = 0; index < row.length; index++) {
        const element = row[index];
        needDeleteSet.delete(element.id);
        this.selectedProblem.set(element.id, element.name);
      }
      needDeleteSet.forEach((item) => {
        this.selectedProblem.delete(item);
      });
    },
    sizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      this.loadProblemList();
    },
    loadProblemList(current) {
      if (current) {
        this.pageInfo.page = current;
      }
      getList(
        `/executor/problem-collection/collection/${this.collection}`,
        this.pageInfo.page,
        this.pageInfo.pageSize
      ).then((result) => {
        if (result.success) {
          this.problems = result.list;
          this.pageInfo.pageSize = result.pageSize;
          this.pageInfo.page = result.currentPage;
          this.pageInfo.total = result.total;
          this.toggleRowSelection();
        }
      });
    },
    loadCollections() {
      if (this.collections && this.collections.length > 0) {
        return;
      }
      getData(
        `/executor/collection-group/${this.$route.params.groupId}/collections`
      ).then((res) => {
        if (res.success) {
          this.collections = res.dto;
        }
      });
    },
    collectionChange() {
      this.pageInfo.page = 1;
      this.pageInfo.total = 0;
      this.loadProblemList();
    },
    toggleRowSelection() {
      this.$refs.problemsTable.clearSelection();
      this.problems.forEach((problem) => {
        //选中状态
        if (this.selectedProblem.has(problem.id)) {
          this.$refs.problemsTable.toggleRowSelection(problem, true);
        }
      });
    },
  },
  mounted() {},
};
</script>

<style lang='sass' scoped>
.collection-item
  margin-right: 6px
.problem-add-button
  float: right
</style>