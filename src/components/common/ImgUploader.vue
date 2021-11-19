<template>
  <el-upload
    v-loading="uploading"
    ref="upload"
    class="avatar-uploader"
    :action="oss.host"
    accept="image/png,image/jpeg"
    :show-file-list="false"
    :auto-upload="false"
    :before-upload="beforeUpload"
    :on-change="imageChange"
    :http-request="upload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
  </el-upload>
</template>
<script>
import { Plus } from "@element-plus/icons";
import { getData, multipartForm } from "@/js/common_data_operation";
import uuid from "@/js/uuid";
export default {
  components: {
    Plus,
  },
  emits: ["uploadCallback"],
  data() {
    return {
      // https://w.wallhaven.cc/full/pk/wallhaven-pkgkkp.png
      imageUrl: "",
      oss: {
        policy: "",
        signature: "",
        key: "",
        ossaccessKeyId: "",
        dir: "",
        host: "",
        // host: "oss-cn-guangzhou.aliyuncs.com",
      },
      url: "",
      uploading: false,
    };
  },
  methods: {
    submitUpload() {
      return this.$refs.upload.submit();
    },
    async beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("图片大小不能超过2MB!");
        return false;
      }
      let response = await getData("/thirdpart/oss/postPolicy");
      this.oss.policy = response.policy;
      this.oss.signature = response.signature;
      this.oss.ossaccessKeyId = response.accessid;
      this.oss.key = response.dir + uuid() + `_${file.name}`;
      this.oss.dir = response.dir;
      this.oss.host = response.host;
      if (response.success) return true;
      return false;
    },
    async upload(uploadInfo) {
      let upload = new FormData();
      upload.set("OSSAccessKeyId", this.oss.ossaccessKeyId);
      upload.set("Signature", this.oss.signature);
      upload.set("policy", this.oss.policy);
      upload.set("key", this.oss.key);
      upload.set("success_action_status", 201);
      upload.set("file", uploadInfo.file);
      this.uploading = true;
      return multipartForm(this.oss.host, upload)
        .then((result) => {
          let url;
          if (result.status == 201) {
            let parser = new DOMParser();
            let doc = parser.parseFromString(result.data, "text/xml");
            let child = doc.childNodes;
            url = child[0].childNodes[3].textContent;
          }
          this.uploading = false;
          this.$emit("uploadCallback", url);
        })
        .catch((err) => {
          this.uploading = false;
        });
    },
    imageChange(file) {
      let imageUrl = URL.createObjectURL(file.raw);
      this.imageUrl = imageUrl;
    },
  },
};
</script>
<style lang="sass" scoped>
.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  text-align: center
  border: 2px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  &:hover
    border-color: #409eff
.avatar-uploader-icon svg
  margin-top: 74px
.avatar
  width: 178px
  height: 178px
  height: 178px
  display: block
</style>
