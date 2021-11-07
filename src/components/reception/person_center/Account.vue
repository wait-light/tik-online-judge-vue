<template>
  <h1 class="title">账号</h1>
  <el-form
    :inline="true"
    class="person_form"
    label-position="left"
    :model="account"
    label-width="120px"
  >
    <el-form-item label="昵称">
      <span v-if="!account.nickname.edit">{{ account.nickname.value }}</span>
      <el-input
        v-else
        size="medium"
        v-model="account.nickname.tempValue"
      ></el-input>
    </el-form-item>
    <el-button size="mini" type="primary" @click="prepareUpdateNickname">{{
      account.nickname.edit ? "保存" : "修改"
    }}</el-button>
    <el-button
      v-if="account.nickname.edit"
      size="mini"
      type="info"
      @click="account.nickname.edit = false"
      >取消</el-button
    >
  </el-form>
  <el-form
    :inline="true"
    class="person_form"
    label-position="left"
    :model="account"
    label-width="120px"
  >
    <el-form-item label="邮箱">
      <span>{{ nickname }}</span>
    </el-form-item>
    <el-button @click="email.open = true" size="mini" type="primary">{{
      account.email ? "修改邮箱" : "添加邮箱"
    }}</el-button>
  </el-form>
  <!-- <el-form
    :inline="true"
    class="person_form"
    label-position="left"
    :model="account"
    label-width="120px"
  >
    <el-form-item label="密码">
      <el-input size="medium" v-model="account.nickname.value"></el-input>
      <el-button size="mini" type="danger" @click="prepareUpdatePassword"
        >修改密码</el-button
      >
    </el-form-item>
  </el-form> -->
  <el-dialog v-model="email.open" title="邮箱">
    <el-form
      ref="email"
      label-position="left"
      :model="email"
      :rules="emailRule"
      label-width="120px"
    >
      <el-form-item label="邮箱" prop="value">
        <el-input
          size="medium"
          placeholder="新邮箱地址"
          type="email"
          v-model="email.value"
        ></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <div style="display: flex">
          <el-input
            size="medium"
            placeholder="邮箱验证码"
            v-model="email.code"
          ></el-input>
          <el-button
            size="mini"
            :disabled="!email.canSend"
            type="primary"
            @click="getEmail"
            >{{ codeCountDown }}</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          size="medium"
          placeholder="无密码可留空"
          type="password"
          v-model="email.password"
        ></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button size="mini" type="success" @click="updateEmail"
          >更新</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
  <!-- <el-dialog v-model="password.open" title="密码">
    <el-form
      ref="password"
      label-position="left"
      :model="password"
      label-width="120px"
    >
      <el-form-item label="旧密码" prop="value">
        <el-input
          size="medium"
          placeholder="旧密码/若无可为空"
          type="email"
          v-model="password.oldPassowrd"
        ></el-input>
      </el-form-item>
    </el-form>
  </el-dialog> -->
</template>

<script>
import { putData, getData, postData } from "@/js/common_data_operation";
import { ElMessage } from "element-plus";
const emailReg = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;
export default {
  data() {
    const checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      if (emailReg.test(value)) {
        return callback();
      } else {
        return callback("邮箱不合规");
      }
    };
    return {
      account: {
        nickname: {
          value: "asdasdasd",
          tempValue: "asdasdasd",
          edit: false,
        },
        email: "",
      },
      email: {
        open: false,
        code: "",
        password: "",
        value: "",
        canSend: true,
        countDown: 0,
      },
      password: {
        open: false,
        oldPassowrd: "",
        newPassword: "",
        repeatPassword: "",
      },
      emailRule: {
        value: [
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "验证码不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    nickname() {
      if (this.account.email) {
        return this.account.email;
      }
      return "空";
    },
    codeCountDown() {
      if (this.email.countDown <= 0) {
        return "获取验证码";
      } else {
        return `【${this.email.countDown}】秒后重新获取`;
      }
    },
  },
  mounted() {
    this.accountMessage();
  },
  methods: {
    accountMessage() {
      getData("/auth/verified/nickname").then((res) => {
        if (res.success) {
          this.account.nickname.value = res.nickname;
          this.account.email = res.email;
        } else {
          ElMessage.error("获取信息失败");
        }
      });
    },
    prepareUpdateNickname() {
      if (this.account.nickname.edit) {
        this.saveNickname();
      } else {
        this.account.nickname.tempValue = this.account.nickname.value;
        this.account.nickname.edit = true;
      }
    },
    prepareUpdatePassword() {
      this.password.open = true;
    },
    saveNickname() {
      putData(
        "/auth/verified/nickname",
        {
          nickname: this.account.nickname.tempValue,
        },
        true
      ).then((result) => {
        if (result.success) {
          this.account.nickname.value = this.account.nickname.tempValue;
          this.account.nickname.edit = false;
        }
      });
    },
    getEmail() {
      if (!this.email.canSend) {
        return;
      }
      if (emailReg.test(this.email.value)) {
        postData(
          `/auth/anonymous/index/verificationCode/${this.email.value}`,
          null,
          true
        ).then((res) => {
          if (res.success) {
            let that = this;
            let intervalID = 0;
            this.email.countDown = 60;
            this.email.canSend = false;
            intervalID = setInterval(function () {
              that.email.countDown--;
              if (that.email.countDown <= 0) {
                that.email.canSend = true;
                clearInterval(intervalID);
              }
            }, 1000);
          }
        });
      }
    },
    updateEmail() {
      this.$refs.email.validate((validate) => {
        if (validate) {
          putData(
            "/auth/verified/email",
            {
              email: this.email.value,
              code: this.email.code,
              password: this.email.password,
            },
            true
          ).then((res) => {
            if (res.success) {
              this.email.open = false;
              this.account.email = this.email.value;
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
.title
    margin: 0 0 25px 0
    font-size: 20px
.person_form
    // margin-top: 10px
</style>