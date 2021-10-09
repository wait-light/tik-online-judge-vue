<template>
  <div class="code-editor">
    <div class="code-menu">
      <el-select
        size="mini"
        style="width: 150px"
        v-model="language"
        placeholder="请选择语言"
        @change="languageChange"
      >
        <el-option
          v-for="item in languages"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        >
        </el-option>
      </el-select>
      <el-icon
        class="code-button"
        title="全屏显示/F11"
        :size="icon.size"
        :color="icon.color"
        @click="fullScreen"
      >
        <full-screen />
      </el-icon>
      <el-icon
        class="code-button"
        title="快捷键"
        :size="icon.size"
        :color="icon.color"
        @click="fullScreen"
      >
        <Warning />
      </el-icon>
    </div>
    <div class="code-panel">
      <textarea autofocus ref="codemirror" v-model="code"></textarea>
    </div>
  </div>
</template>

<script>
//element plus 图标引入
import { Edit, FullScreen, Warning } from "@element-plus/icons";

// ()=> import("codemirror/lib/codemirror.css")
import { markRaw } from "vue";
import CodeMirror from "codemirror";

// 引入CodeMirror和基础样式
import "codemirror/lib/codemirror.css";
//java智能提示（类C语言提示 -- 官方好像没有直接提供java的提示）
import "codemirror/mode/clike/clike.js";
// 选择IDEA主题样式，还有其他很多主题可选
import "codemirror/theme/idea.css";
// 支持使用Sublime快捷键
import "codemirror/keymap/sublime.js";
// 搜索功能的依赖
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";
// 支持搜索功能
import "codemirror/addon/search/search";
import "codemirror/addon/search/searchcursor.js";
// 支持各种代码折叠
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/comment-fold.js";
// 支持代码区域全屏功能
import "codemirror/addon/display/fullscreen.css";
import "codemirror/addon/display/fullscreen.js";
// 支持括号自动匹配
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/edit/closebrackets.js";
// import "codemirror/addon/hint/anyword-hint.js";
// 行注释
import "codemirror/addon/comment/comment.js";
// JSON错误检查
import "codemirror/addon/lint/lint.css";
import "codemirror/addon/lint/lint.js";
// import "codemirror/addon/runmode/colorize.js";
import "codemirror/mode/sql/sql";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/sql-hint";
// 支持代码自动补全
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint.js";
//当前行高亮
import "codemirror/addon/selection/active-line.js";

let codemirror;
let codemirrorConfig = {
  // Java高亮显示
  mode: { name: "javascript", globalVars: true },
  indentUnit: 4, // 缩进单位，默认2
  smartIndent: true, // 是否智能缩进
  //高亮当前行
  styleActiveLine: true,
  // 显示行号
  lineNumbers: true,
  // 设置主题
  theme: "idea",
  // 绑定sublime快捷键
  keyMap: "sublime",
  // 开启代码折叠
  lineWrapping: true,
  foldGutter: true,
  autocorrect: true,
  gutters: [
    "CodeMirror-linenumbers",
    "CodeMirror-foldgutter",
    "CodeMirror-lint-markers",
  ],
  // CodeMirror-lint-markers是实现语法报错功能
  lint: true,

  // 全屏模式
  fullScreen: false,

  // 括号匹配
  matchBrackets: true,
  autoCloseBrackets: true,
  showHint: true,
  // 额外快捷键
  extraKeys: {
    F11: (cm) => {
      cm.setOption("fullScreen", !cm.getOption("fullScreen"));
    },
    Esc: (cm) => {
      if (cm.getOption("fullScreen")) {
        cm.setOption("fullScreen", false);
      }
    },
  },
  //取消代码自动完成
  hintOptions: {
    completeSingle: false,
  },
  //滚动条样式
  scrollbarStyle: null,
};
export default {
  components: {
    Edit,
    FullScreen,
    Warning,
  },
  name: "tik-code-editor",
  data: () => ({
    code: "",
    icon: {
      size: 20,
      color: "#666",
    },
    languages: [
      // {
      //   value: 0,
      //   label: "SQL",
      //   mode: "text/x-mariadb",
      //   template: ``,
      // },
      {
        value: 1,
        label: "Java",
        mode: "text/x-java",
        template: `import java.util.Scanner;
public class Main{
    public static void main(String[] args){
        
    }
}`,
      },
      {
        value: 2,
        label: "C++",
        mode: "text/x-c++src",
        template: `#include <iostream>
using namespace std;
int main()
{
    
    return 0;
}`,
      },
    ],
    language: 0,
  }),
  mounted() {
    // 防止转为监听对象，vue3中如果CodeMirror对象被转为监听对象，会无法正常使用
    codemirror = markRaw(
      // 用ref获取需要渲染的textarea的DOM
      CodeMirror.fromTextArea(this.$refs.codemirror, codemirrorConfig)
    );
    // 将编辑器中的值存储下来
    codemirror.on("change", (cm) => {
      this.code = cm.getValue();
    });
    codemirror.setSize("auto", "100%");
    this.language = this.languages[0].value;
    this.languageChange(this.language);
    codemirror.on("changes", (instance, changes) => {
      //配置提示显示的情况
      var pattern = new RegExp(
        "^[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？\\\\\\s]$"
      );
      if (changes[0].origin == "+delete") {
        if (!pattern.test(changes[0].removed) && changes[0].removed != " ") {
          codemirror.showHint();
        }
      } else if (changes[0].origin == "+input") {
        if (!pattern.test(changes[0].text)) {
          codemirror.showHint();
        }
      }
    });
  },
  beforeUnmount() {
    this.destroy();
  },
  methods: {
    languageChange(value) {
      let selected = this.languages.find((item) => {
        return item.value == value;
      });
      codemirror.setOption("mode", selected.mode);
      codemirror.setValue(selected.template);
    },
    fullScreen() {
      codemirror.setOption("fullScreen", true);
      codemirror.focus();
    },
    destroy() {
      // 获取代表编辑器的DOM
      const element = codemirror.doc.cm.getWrapperElement();
      // 删除编辑器实例
      element && element.remove && element.remove();
    },
  },
};
</script>
<style lang="sass" scoped>
@import "@/sass/_variables"
.code-editor
  position: relative
  width: 100%
  height: 100%
  .code-panel
    // position: absolute
    height: calc( 100% - 39.6px )
    // height: 100%
    width: 100%
  .code-menu
    background-color: #f7f7f7
    padding: 5px 10px
    // padding: 5px 15px
    .code-button
      cursor: pointer
      margin: 0 10px
      position: relative
      svg
        position: absolute
        top: 5px
</style>
