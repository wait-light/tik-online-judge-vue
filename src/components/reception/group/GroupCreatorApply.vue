<template>
  <el-form
    ref="submitForm"
    :model="creatorApply"
    label-position="right"
    label-width="80px"
    :rules="rules"
  >
    <el-form-item label="地址" prop="address">
      <el-input v-model="creatorApply.address"></el-input>
    </el-form-item>
    <el-form-item label="申请原因" prop="reason">
      <el-input
        type="textarea"
        placeholder="请输入申请原因（不超过255个字符）"
        v-model="creatorApply.reason"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="prepareSave" v-if="creatorApply" type="success"
        >保存</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { postData } from "@/js/common_data_operation";
const creatorApply = ref({ address: "", reason: "" });
const rules = {
  address: [
    {
      trigger: "blur",
      required: true,
      message: "地址不能为空",
    },
  ],
  reason: [
    {
      trigger: "blur",
      required: true,
      message: "原因不能为空",
    },
  ],
};
const submitForm = ref(null);
const prepareSave = () => {
  submitForm.value.validate((valid) => {
    if (valid) {
      postData("/social/group-creator-apply/apply", creatorApply.value, true);
    }
  });
};
</script>