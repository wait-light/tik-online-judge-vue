<template>
    <md-editor v-loading="loading" @upload-img="onUploadImg" class="editor" v-model="value" />
</template>

<script setup>
import "md-editor-v3/lib/style.css";
import MdEditor from "md-editor-v3";
import { getData, multipartForm } from "@/js/common_data_operation";
import { ref } from "@vue/reactivity";
import uuid from "@/js/uuid";
defineProps({
    value: String
})
const loading = ref(false)
const onUploadImg = async (files, callback) => {
    let file = files[0]
    loading.value = true
    getData("/thirdpart/oss/postPolicy").then(res => {
        if (res.success) {
            let upload = new FormData();
            upload.set("OSSAccessKeyId", res.accessid);
            upload.set("Signature", res.signature);
            upload.set("policy", res.policy);
            upload.set("key", `${res.dir}${uuid()}_${file.name}`);
            upload.set("success_action_status", 201);
            upload.set("file", file);
            return multipartForm(res.host, upload)
        }
    }).then(res => {
        if (res.status == 201) {
            let parser = new DOMParser();
            let doc = parser.parseFromString(res.data, "text/xml");
            let child = doc.childNodes;
            let url = child[0].childNodes[3].textContent;
            loading.value = false
            callback([url])
        } else {
            loading.value = false
            callback(["上传失败"])
        }
    }).catch(err => {
        loading.value = false
        callback(["上传失败"])
    })
}
</script>

<style lang="sass" scoped>

</style>