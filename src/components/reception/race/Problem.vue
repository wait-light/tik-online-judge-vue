<template>
    <div class="box">
        <problem-detail :problemId="route.params.problemId"></problem-detail>
        <div class="code-editor">
            <tik-code-editor v-model="codeInfo" :height="'80vh'"></tik-code-editor>
        </div>
    </div>
    <div class="banner">
        <div>
            <el-button v-loading="submitting" type="primary" size="small" @click="submit">提交</el-button>
        </div>
    </div>
</template>

<script setup>
import ProblemDetail from "@/components/reception/problem/ProblemDetail.vue"
import TikCodeEditor from "@/components/common/TikCodeEditor.vue";
import { useRoute } from "vue-router"
import { ref } from "@vue/reactivity";
import { postData } from "@/js/common_data_operation";
const route = useRoute()
const codeInfo = ref({})
const submitting = ref(false)
const submit = () => {
    submitting.value = true
    postData(`/executor/task-submit/${route.params.raceId}`, {
        languageType: codeInfo.value.language,
        content: codeInfo.value.code,
        problemId: route.params.problemId
    }, true).then(res => {
        submitting.value = false
    }).catch(err => {
        submitting.value = false
    })
}
</script>

<style lang="sass" scoped>

@import '@/sass/_variables'
.box
    margin: 10px 20px
.code-editor
    margin: 30px 0 50px
.banner
    z-index: 5
    position: fixed
    display: flex
    left: 0
    bottom: 0
    width: 100vw
    margin: 0
    background: $main-color
    height: 50px
    box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.12)
    justify-content: center
    align-items: center
    // margin-left: -50vw   
</style>