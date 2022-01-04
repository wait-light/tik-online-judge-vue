<template>
  <el-form
    ref="submitForm"
    :model="creatorApply"
    label-position="right"
    label-width="80px"
    :rules="rules"
  >
    <el-form-item label="申请原因" prop="reason">
      <el-input type="textarea" placeholder="请输入申请原因（不超过255个字符）" v-model="creatorApply.reason"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="prepareSave" v-if="creatorApply" type="success">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { postData } from "@/js/common_data_operation";
import { inject } from "@vue/runtime-core";
const groupCreatorApply = inject("groupCreatorApply")
const creatorApply = ref({ reason: "", name: "group-creator" });
const rules = {
  reason: [
    {
      trigger: "blur",
      required: true,
      message: "原因不能为空",
    },
  ],
};
const submitForm = ref(null);
//提交申请
const prepareSave = () => {
  submitForm.value.validate((valid) => {
    if (valid) {
      postData("/auth/role-ask/ask", creatorApply.value, true).then(res => {
        //取消显示
        groupCreatorApply.open = false
      });
    }
  });
};
</script>