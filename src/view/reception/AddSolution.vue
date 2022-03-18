<template>
  <div v-loading="loading" element-loading-text="正在载入文章">
    <div class="title-box">
      <input placeholder="请输入文章标题..." max="64" v-model="solution.title" />
      <div style="width:220px; margin:auto 10px;">
        <span class="showing-info">展示</span>
        <el-switch style="margin-right: 10px;" v-model="solution.status"></el-switch>
        <el-dropdown>
          <el-button :type="buttonType" size="mini" @click="buttonClick">
            {{ buttonText }}
            <el-icon class="el-icon--right">
              <ArrowDown />
            </el-icon>
          </el-button>
          <!-- <el-button type="success" size="mini" v-else @click="updateSolution">
            修改
            <el-icon class="el-icon--right">
              <ArrowDown />
            </el-icon>
          </el-button>-->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                @click="$router.push({ path: '/redirect', query: { path: '' } })"
              >返回首页</el-dropdown-item>
              <el-dropdown-item
                @click="open('https://www.runoob.com/markdown/md-tutorial.html')"
              >Markdown教程</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <md-editor :historyLength="20" class="editor" v-model="solution.content" />
  </div>
</template>

<script>
import MdEditor from "@/components/common/TikMdEditor.vue";
import {
  getOne,
  update,
  getList,
  deleteById,
  save,
  commonajaxWithData,
} from "@/js/common_data_operation.js";
import "md-editor-v3/lib/style.css";
import { ArrowDown } from "@element-plus/icons";
import { ElMessage } from 'element-plus';
export default {
  components: { MdEditor, ArrowDown },
  data() {
    return {
      loading: false,
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
  computed: {
    buttonType() {
      return this.solution.id ? "success" : "primary"
    },
    buttonClick() {
      return this.solution.id ? this.updateSolution : this.addSolution
    },
    buttonText() {
      return this.solution.id ? "更新" : "发布"
    }
  },
  methods: {
    open(url) {
      window.open(url, "_blank")
    },
    hasSolution() {
      this.loading = true
      commonajaxWithData(
        `/social/solution/hasSolution/${this.solution.problemId}`,
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
        this.loading = false
      }).catch(err => {
        this.loading = false
      });
    },
    getSolution() {
      this.loading = true
      commonajaxWithData(
        `/social/solution/${this.solution.id}`,
        "get",
        null,
        false
      ).then((result) => {
        if (result.success) {
          this.solution = result.dto;
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      });
    },
    addSolution() {
      if (!this.solution.title) {
        ElMessage.warning("标题不能为空")
        return
      }
      if (!this.solution.content) {
        ElMessage.warning("内容不能为空")
        return
      }
      commonajaxWithData(
        `/social/solution`,
        "post",
        this.solution,
        true
      ).then(res => {
        if (res.success) {
          this.solution.id = res.id
        }
      })
    },
    updateSolution() {
      if (!this.solution.title) {
        ElMessage.warning("标题不能为空")
        return
      }
      if (!this.solution.content) {
        ElMessage.warning("内容不能为空")
        return
      }
      commonajaxWithData(
        `/social/solution/${this.solution.id}`,
        "put",
        this.solution,
        true
      )
    },
  },
};
</script>

<style lang="sass" scoped>

.showing-info
  font-size: 12px
  line-height: 20px
  margin-right: 5px
  color: #666
  display: inline-block
  &::after
    content: ":"
.title-box
  display: flex
  box-sizing: border-box
  input
    width: 100%
    height: 60px
    text-indent: 30px
    font-size: 25px
    color: #333
    outline: none
    border: 0
    .operation
      display: flex
      margin: 0 20px
      align-self: center
      width: fit-content
        // background: black
.box
  padding: 20px 50px
.editor
  height: calc( 100vh - 62px )
</style>