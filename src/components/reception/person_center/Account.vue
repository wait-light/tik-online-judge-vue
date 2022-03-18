<template>
  <h1 class="title">账号</h1>
  <el-dialog v-model="avatar.edit" title="修改头像" width="300px">
    <div style="text-align: center">
      <uploder ref="uploderRef" @uploadCallback="uploadCallback"></uploder>
      <el-button style="margin-top: 10px" type="primary" @click="updateAvatar">确认</el-button>
    </div>
  </el-dialog>
  <el-form
    :inline="true"
    class="person_form"
    label-position="left"
    :model="account"
    label-width="120px"
  >
    <el-form-item label="头像">
      <user-title
        :class="isSelf ? 'avatar' : ''"
        @click="avatar.edit = isSelf"
        :uid="uid"
        :showName="false"
      ></user-title>
    </el-form-item>
  </el-form>
  <el-form
    :inline="true"
    class="person_form"
    label-position="left"
    :model="account"
    label-width="120px"
  >
    <el-form-item label="昵称">
      <span v-if="!account.nickname.edit">{{ account.nickname.value }}</span>
      <el-input v-else size="medium" v-model="account.nickname.tempValue"></el-input>
    </el-form-item>
    <el-button v-if="isSelf" size="mini" type="primary" @click="prepareUpdateNickname">
      {{
        account.nickname.edit ? "保存" : "修改"
      }}
    </el-button>
    <el-button
      v-if="account.nickname.edit"
      size="mini"
      type="info"
      @click="account.nickname.edit = false"
    >取消</el-button>
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
    <el-button v-if="isSelf" @click="email.open = true" size="mini" type="primary">
      {{
        account.email ? "修改邮箱" : "添加邮箱"
      }}
    </el-button>
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
  </el-form>-->
  <el-dialog v-model="email.open" title="邮箱">
    <el-form
      ref="emailRef"
      label-position="left"
      :model="email"
      :rules="emailRule"
      label-width="120px"
    >
      <el-form-item label="邮箱" prop="value">
        <el-input size="medium" placeholder="新邮箱地址" type="email" v-model="email.value"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <div style="display: flex">
          <el-input size="medium" placeholder="邮箱验证码" v-model="email.code"></el-input>
          <el-button
            size="mini"
            :disabled="!email.canSend"
            type="primary"
            @click="getEmail"
          >{{ codeCountDown }}</el-button>
        </div>
      </el-form-item>
      <el-form-item label="密码">
        <el-input size="medium" placeholder="无密码可留空" type="password" v-model="email.password"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-button size="mini" type="success" @click="updateEmail">更新</el-button>
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
  </el-dialog>-->
</template>

<script setup>
import UserTitle from "@/components/common/UserTitle.vue";
import uploder from "@/components/common/ImgUploader.vue";
import { putData, getData, postData } from "@/js/common_data_operation";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { computed, ref } from '@vue/reactivity';
import { onMounted, watch } from '@vue/runtime-core';
import { useRoute } from "vue-router";

const emailReg = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;
const store = useStore()
const uploderRef = ref(null)
const emailRef = ref(null)
const props = defineProps(["uid"])
const route = useRoute()
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
const uid = ref(0)
const avatar = ref({
  edit: false,
  src: ""
})
const account = ref({
  nickname: {
    value: "",
    tempValue: "",
    edit: false,
  },
  email: "",
})
const email = ref({
  open: false,
  code: "",
  password: "",
  value: "",
  canSend: true,
  countDown: 0,
})

const password = {
  open: false,
  oldPassowrd: "",
  newPassword: "",
  repeatPassword: "",
}
const emailRule = {
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
}
const user = computed(() => store.state.user.user)
const nickname = computed(() => {
  if (account.value.email) {
    return account.value.email;
  }
  return "空";
})
const codeCountDown = computed(() => {
  if (email.value.countDown <= 0) {
    return "获取验证码";
  } else {
    return `【${email.value.countDown}】秒后重新获取`;
  }
})
const isSelf = computed(() => {
  if (uid.value == store.state.user.user.uid) {
    return true
  }
  return false
})

function uploadCallback(url) {
  if (url) {
    putData(
      "/auth/verified/avatar",
      {
        avatar: url,
      },
      true
    ).then((res) => {
      if (res.success) {
        location.reload();
      }
    });
  }
}
function updateAvatar() {
  uploderRef.value.submitUpload();
}
function accountMessage() {
  if (uid.value) {
    getData(`/auth/verified/accountMessage/${uid.value}`).then((res) => {
      if (res.success) {
        account.value.nickname.value = res.nickname;
        account.value.email = res.email;
      } else {
        ElMessage.error("获取信息失败");
      }
    });
  }
}
function prepareUpdateNickname() {
  if (account.value.nickname.edit) {
    saveNickname();
  } else {
    account.value.nickname.tempValue = account.value.nickname.value;
    account.value.nickname.edit = true;
  }
}
function prepareUpdatePassword() {
  password.value.open = true;
}
function saveNickname() {
  putData(
    "/auth/verified/nickname",
    {
      nickname: account.value.nickname.tempValue,
    },
    true
  ).then((result) => {
    if (result.success) {
      account.value.nickname.value = account.value.nickname.tempValue;
      account.value.nickname.edit = false;
    }
  });
}
function getEmail() {
  if (!email.value.canSend) {
    return;
  }
  if (emailReg.test(email.value.value)) {
    postData(
      `/auth/anonymous/index/verificationCode/${email.value.value}`,
      null,
      true
    ).then((res) => {
      if (res.success) {
        let intervalID = 0;
        email.value.countDown = 60;
        email.value.canSend = false;
        intervalID = setInterval(function () {
          email.value.countDown--;
          if (email.value.countDown <= 0) {
            email.value.canSend = true;
            clearInterval(intervalID);
          }
        }, 1000);
      }
    });
  }
}
function updateEmail() {
  emailRef.value.validate((validate) => {
    if (validate) {
      putData(
        "/auth/verified/email",
        {
          email: email.value.value,
          code: email.value.code,
          password: email.value.password,
        },
        true
      ).then((res) => {
        if (res.success) {
          email.value.open = false;
          account.value.email = email.value.value;
        }
      });
      return true;
    } else {
      return false;
    }
  });
}
const uidChange = (newValue) => {
  if (newValue) {
    uid.value = newValue
  } else {
    uid.value = store.state.user.user.uid
  }
  accountMessage()
}
const storeUidChange = (newValue, oldValue) => {
  if (newValue && !route.params.uid && !props.uid) {
    uid.value = newValue
    accountMessage()
  }
}

uid.value = props.uid || route.params.uid || store.state.user.user.uid
watch(() => props.uid, uidChange)
watch(() => route.params.uid, uidChange)
watch(() => store.state.user.user.uid, storeUidChange)

onMounted(() => {
  accountMessage()
})
</script>
<style lang="sass" scoped>

@import "@/sass/_variables.sass"
.title
  margin: 0 0 25px 0
  font-size: 20px
.person_form
    // margin-top: 10px
.avatar:hover
  cursor: pointer
  &::after
    content: "修改"
    font-size: 5px
    color: $secondary-color
</style>