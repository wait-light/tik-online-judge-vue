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
                  <el-input v-model="entity.code"></el-input>
                </el-col>
                <el-col :xs="24" :sm="6">
                  <el-button type="success" @click="sendCode"
                    >发送验证码</el-button
                  >
                </el-col>
              </el-row>
            </el-form-item>
            <el-button
              style="margin-right: 10px"
              type="primary"
              @click="
                submitForm(
                  'passwordform',
                  'EMAIL',
                  this.entity.email,
                  this.entity.code
                )
              "
              >登录/注册</el-button
            >
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
              <el-input v-model="entity.password"></el-input>
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
              >登录</el-button
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
import { commonajaxWithData, getOne } from "@/js/common_data_operation.js";
import { ElMessage } from 'element-plus'
export default {
  methods: {
    submitForm(formName, loginType, principal, credentials) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          commonajaxWithData("/");
        } else {
          return false;
        }
      });
    },
    getOne,
    sendCode() {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (mailReg.test(this.entity.email)) {
        this.getOne("/user/index/code/" + this.entity.email).then((res) => {
          if (res.success) {
            ElMessage({
              message: res.msg,
              type: "success",
            });
          } else {
            ElMessage({
              message: res.msg,
              type: "error",
            });
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
    const usernameReg = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
    const passwordReg = /^[a-zA-Z]w{5,17}$/;
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
        callback();
      } else {
        callback(
          new Error("以字母开头，长度在6~18之间，只能包含字母、数字和下划线")
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
        callback(new Error("字母开头，长度在5-16之间，允许字母数字下划线"));
      }
    };

    return {
      loginType: "email",
      entity: {},
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