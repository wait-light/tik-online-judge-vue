<template>
  <el-form
    ref="groupForm"
    :model="newEntity"
    label-position="right"
    label-width="80px"
    :rules="rules"
  >
    <el-form-item label="群组名称" prop="name">
      <el-input v-model="newEntity.name"></el-input>
    </el-form-item>
    <el-form-item label="封面">
      <img-uploader
        ref="uploder"
        @uploadCallback="uploadCallBack"
      ></img-uploader>
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
import { update, postData } from "@/js/common_data_operation.js";
import ImgUploader from "@/components/common/ImgUploader.vue";
import { ElMessage } from "element-plus";
export default {
  components: {
    ImgUploader,
  },
  props: {
    entity: Object,
  },
  data() {
    const nameReg = /^[\u0391-\uFFE5a-zA-Z0-9\\(\\)]{2,50}$/;
    const checkName = (rule, value, callback) => {
      if (!this.newEntity.name) {
        callback(new Error("群名不能为空"));
      }
      if (!nameReg.test(this.newEntity.name)) {
        callback(new Error("群名长度应为2-50,可使用中文英文数字和括号"));
      } else {
        callback();
      }
    };
    return {
      newEntity: {},
      rules: {
        name: [
          {
            validator: checkName,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    uploadCallBack(url) {
      if (url) {
        this.newEntity.avatar = url;
        postData("/social/user-group", this.newEntity, true).then((res) => {
          if (res.success) {
            this.$router.push(`/group/${res.groupId}`);
          }
        }, true);
      } else {
        ElMessage({
          message: "图片上传有误",
          type: "error",
        });
      }
    },
    async prepareSave() {
      this.$refs.groupForm.validate((valid) => {
        if (!valid) {
          return;
        }
        this.$refs.uploder.submitUpload();
      });
    },
    async prepareUpdate() {
      let result = await update(
        "/social/group",
        this.newEntity.id,
        this.newEntity
      );
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
