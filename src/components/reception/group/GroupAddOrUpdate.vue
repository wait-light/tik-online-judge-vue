<template>
  <el-form v-model="newEntity" label-position="right" label-width="80px">
    <el-form-item label="群组名称">
      <el-input v-model="newEntity.name"></el-input>
    </el-form-item>
    <el-form-item label="图片">
      <el-upload
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="newEntity.avatar" :src="newEntity.avatar" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button @click="prepareSave" v-if="!newEntity.id" type="success"
        >保存</el-button
      >
      <el-button
        @click="prepareUpdate"
        v-if="newEntity.id && newEntity.id != 0"
        type="warning"
        >修改</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import { Plus } from "@element-plus/icons";
import { update, postData } from "@/js/common_data_operation.js";
export default {
  components: {
    Plus,
  },
  props: {
    entity: Object,
  },
  data() {
    return {
      newEntity: {},
    };
  },
  methods: {
    async prepareSave() {
      let result = await postData("/social/group", this.newEntity, true);
    },
    async prepareUpdate() {
      let result = await update(
        "/social/group",
        this.newEntity.id,
        this.newEntity
      );
    },
    handleAvatarSuccess(res, file) {
      this.newEntity.avatar = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("图片格式不符合要求");
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过2MB!");
      }
      return isJPG && isLt2M;
    },
  },
  watch: {
    async entity(newValue, oldValue) {
      this.newEntity = newValue;
    },
  },
  mounted() {},
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.avatar-uploader-icon svg {
  margin-top: 74px; /* (178px - 28px) / 2 - 1px */
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
