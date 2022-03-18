<template>
  <div class="login_container">
    <div class="login_box">
      <h1>密码修改</h1>
      <el-tabs type="card" v-model="loginType">
        <el-tab-pane label="邮箱验证" name="email">
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
                  <el-input v-model="entity.code"></el-input>
                </el-col>
                <el-col :xs="24" :sm="6">
                  <el-button
                    size="mini"
                    type="success"
                    :disabled="codeSecond <= 0 ? false : true"
                    @click="sendCode"
                    >{{ sendCodeStr }}</el-button
                  >
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input show-password v-model="entity.newPassword"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="repeatPassword">
              <el-input
                show-password
                v-model="entity.repeatPassword"
              ></el-input>
            </el-form-item>
            <el-button
              style="margin-right: 10px"
              type="primary"
              @click="updatePasswordByEmail"
              >修改</el-button
            >
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="密码验证" name="password">
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
              <el-input v-model="entity.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input show-password v-model="entity.newPassword"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="repeatPassword">
              <el-input
                show-password
                v-model="entity.repeatPassword"
              ></el-input>
            </el-form-item>
            <el-button
              style="margin-right: 10px"
              type="primary"
              @click="updatePasswordByUsername"
              >修改</el-button
            >
          </el-form>
        </el-tab-pane>
        <!-- <el-tab-pane label="Role" name="third">Role</el-tab-pane>
        <el-tab-pane label="Task" name="fourth">Task</el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  commonajaxWithData,
  getOne,
  postData,
  putData,
} from "@/js/common_data_operation.js";
import { ElMessage } from "element-plus";
import { mapState, mapMutations } from "vuex";

export default {
  mounted() {},
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
    updatePasswordByEmail() {
      this.$refs["emailform"].validate((valid) => {
        if (!valid) {
          return false;
        }
        putData(
          "/auth/anonymous/index/password/email",
          {
            email: this.entity.email,
            code: this.entity.code,
            newPassword: this.entity.newPassword,
          },
          true
        ).then((res) => {
          if (res.success) {
            this.$router.push("/login");
          }
        });
      });
    },
    updatePasswordByUsername() {
      this.$refs["passwordform"].validate((valid) => {
        if (!valid) {
          return false;
        }
        console.log("asd");
        putData(
          "/auth/anonymous/index/password/username",
          {
            username: this.entity.username,
            password: this.entity.password,
            newPassword: this.entity.newPassword,
          },
          true
        ).then((res) => {
          if (res.success) {
            this.$router.push("/login");
          }
        });
      });
    },
  },
  data() {
    const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    const usernameReg = /^[a-zA-Z0-9_@\.]{2,50}$/;
    // const passwordReg = /^[a-zA-Z]w{5,17}$/;
    const passwordReg = /^[a-zA-Z0-9_@]{0,50}$/;
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
          new Error("以字母开头，长度在2~50之间，只能包含字母、数字和下划线")
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
        callback(new Error("字母开头，长度在2-50之间，允许字母数字、@和下划线"));
      }
    };
    const repeatPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("重复密码不能为空"));
      }
      if (value != this.entity.newPassword) {
        return callback(new Error("重复密码不一致"));
      }
      callback();
    };

    return {
      loginType: "email",
      entity: {},
      codeSecond: 0,
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
        newPassword: [
          {
            required: true,
            trigger: "blur",
            validator: checkPassword,
          },
        ],
        repeatPassword: [
          {
            required: true,
            trigger: "blur",
            validator: repeatPassword,
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