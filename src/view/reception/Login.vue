<template>
  <div class="login_container">
    <div class="login_box">
      <h1>登录</h1>
      <el-tabs type="card" v-model="loginType">
        <el-tab-pane label="验证码" name="email">
          <el-form
            ref="emailform"
            label-width="80px"
            :label-position="'top'"
            :rules="rules"
            :model="entity"
          >
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="entity.email"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <el-row>
                <el-col :xs="24" :sm="18">
                  <el-input
                    v-model="entity.code"
                    @keyup.enter="
                      submitForm(
                        'emailform',
                        'EMAIL',
                        this.entity.email,
                        this.entity.code
                      )
                    "
                  ></el-input>
                </el-col>
                <el-col :xs="24" :sm="6">
                  <el-button
                    size="mini"
                    type="success"
                    :disabled="codeSecond <= 0 ? false : true"
                    @click="sendCode"
                  >{{ sendCodeStr }}</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button
                style="margin-right: 10px"
                type="primary"
                @click="
                  submitForm(
                    'emailform',
                    'EMAIL',
                    this.entity.email,
                    this.entity.code
                  )
                "
              >登录/注册</el-button>
              <el-button type="warning" @click="$router.push('/passwordrest')">密码修改</el-button>
            </el-form-item>
            <el-checkbox v-model="agree" label="同意"></el-checkbox>
            <el-link style="margin-top: -8px; margin-left: 8px" href="/user-agreement">《服务条款》</el-link>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="密码" name="password">
          <el-form
            ref="passwordform"
            label-width="80px"
            :label-position="'top'"
            :rules="rules"
            :model="entity"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="entity.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="entity.password"
                show-password
                @keyup.enter="
                  submitForm(
                    'passwordform',
                    'PASSWORD',
                    this.entity.username,
                    this.entity.password
                  )
                "
              ></el-input>
            </el-form-item>

            <el-button
              style="margin-right: 10px"
              type="primary"
              @click="
                submitForm(
                  'passwordform',
                  'PASSWORD',
                  this.entity.username,
                  this.entity.password
                )
              "
            >登录</el-button>
            <el-button type="warning" @click="$router.push('/passwordrest')">密码修改</el-button>
          </el-form>

          <el-checkbox v-model="agree" label="同意"></el-checkbox>
          <el-link style="margin-top: -8px; margin-left: 8px" href="/user-agreement">《服务条款》</el-link>
        </el-tab-pane>
        <!-- <el-tab-pane label="Role" name="third">Role</el-tab-pane>
        <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>-->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  commonajaxWithData,
  getOne,
  postData,
} from "@/js/common_data_operation.js";
import { ElMessage } from "element-plus";
import { mapState, mapMutations } from "vuex";

export default {
  mounted() { },
  computed: {
    ...mapState("user", {
      user: (state) => state.user,
    }),
    sendCodeStr() {
      return this.codeSecond <= 0
        ? "发送验证码"
        : `【${this.codeSecond}】秒后发送`;
    },
  },
  methods: {
    ...mapMutations("user", ["login"]),
    async submitForm(formName, loginType, principal, credentials) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            loginType,
            principal,
            credentials,
          };
          if (loginType == "EMAIL") {
            commonajaxWithData(
              "/auth/anonymous/index/email_login",
              "post",
              {
                email: principal,
                code: credentials,
              },
              true
            ).then((res) => {
              if (res.success) {
                this.$router.push("/");
                this.$store.dispatch("auth/loadDectory")
                this.login(res.token);
              }
            });
          } else if (loginType == "PASSWORD") {
            commonajaxWithData(
              "/auth/anonymous/index/username_login",
              "post",
              {
                username: principal,
                password: credentials,
              },
              true
            ).then((res) => {
              if (res.success) {
                this.$router.push("/");
                this.$store.dispatch("auth/loadDectory")
                this.login(res.token);

              }
            });
          }
          return true;
        } else {
          return false;
        }
      });
    },
    getOne,
    sendCode() {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (this.codeSecond > 0) {
        return;
      }
      if (mailReg.test(this.entity.email)) {
        postData(
          "/auth/anonymous/index/verificationCode/" + this.entity.email,
          null,
          true
        ).then((res) => {
          if (res.success) {
            let that = this;
            let intervalID = 0;
            this.codeSecond = 60;
            intervalID = setInterval(function () {
              that.codeSecond--;
              if (that.codeSecond <= 0) {
                clearInterval(intervalID);
              }
            }, 1000);
          }
        });
      } else {
        ElMessage({
          message: "邮箱格式不正确",
          type: "error",
        });
      }
    },
  },
  data() {
    const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    const usernameReg = /^[a-zA-Z0-9_\.\@]{5,25}$/;
    const passwordReg = /^[a-zA-Z0-9_]{3,17}$/;
    const checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      if (mailReg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的邮箱格式"));
      }
    };
    const checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      }
      if (passwordReg.test(value)) {
        return callback();
      } else {
        callback(
          new Error("以字母开头，长度在5~25之间，只能包含字母、数字和下划线")
        );
      }
    };
    const checkUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      }
      if (usernameReg.test(value)) {
        callback();
      } else {
        callback(
          new Error("长度在5-25之间，不能包括特殊符号，允许邮箱格式的账号")
        );
      }
    };

    return {
      loginType: "email",
      entity: {},
      codeSecond: 0,
      agree: false,
      rules: {
        email: [
          {
            required: true,
            trigger: "blur",
            validator: checkEmail,
          },
        ],
        code: [
          {
            required: true,
            message: "请输入验证码",
          },
        ],
        username: [
          {
            required: true,
            trigger: "blur",
            validator: checkUsername,
          },
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            validator: checkPassword,
          },
        ],
      },
    };
  },
};
</script>

<style lang="sass" scoped>

@import '@/sass/_variables'
.login_container
  width: 100%
  height: 100%
  display: flex
  justify-content: center
  align-items: center
  background: url("@/img/login_sign_background.svg")
.login_box
  text-align: center
  background: $main-color
  box-shadow: $box-shadow
  border-radius: $large-radius
  padding: 20px 40px 60px
  width: 30%
h1
  color: $minor-color
</style>