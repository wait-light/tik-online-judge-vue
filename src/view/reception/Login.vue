<template>
  <div class="login_container">
    <div class="login_box">
      <h1>登录</h1>
      <el-tabs type="card" v-model="loginType">
        <el-tab-pane label="验证码" name="email">
          <el-form
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
                  <el-button type="success">发送验证码</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-button style="margin-right: 10px" type="primary"
              >登录/注册</el-button
            >
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="密码" name="password">
          <el-form
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
            <el-button style="margin-right: 10px" type="primary"
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
import TikLogo from "@/components/common/TikLogo.vue";
export default {
  components: { TikLogo },
  //   methods: {

  //   },
  data() {
    const checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      console.log("asdasd");
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱格式"));
        }
      }, 100);
    };
    return {
      loginType: "email",
      entity: {
        email: "",
        code: "",
      },
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
            message: "请输入用户名",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
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
	// background: #ddd
	box-shadow: $box-shadow
	border-radius: $large-radius
	padding: 20px 40px 60px
	width: 30%
	h1
		color: $minor-color
</style>