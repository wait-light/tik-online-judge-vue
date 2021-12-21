<template>
    <div class="title-box">
        <input placeholder="请输入文章标题..." max="64" v-model="post.title" />
        <div class="operation">
            <el-button type="primary" @click="doPost">发布</el-button>
        </div>
    </div>

    <md-editor class="editor" v-model="post.content" />
</template>

<script setup>
import MdEditor from "@/components/common/TikMdEditor.vue"
import { ref } from "@vue/reactivity"
import { ElMessage } from "element-plus"
import { postData } from "@/js/common_data_operation"
import { useRouter } from "vue-router"
const post = ref({
    content: "",
    title: ""
})
const router = useRouter()
const doPost = () => {
    if (!post.value.title) {
        ElMessage.warning("标题不能为空")
        return
    }
    if (!post.value.content) {
        ElMessage.warning("内容不能为空")
        return
    }
    postData(`/social/post`, post.value, true)
        .then(res => {
            if (res.success) {
                router.push(`/post/${res.id}`)
            }
        })
}
</script>

<style lang="sass" scoped>

.title-box
    display: flex
    box-sizing: border-box
    input
        width: 100%
        height: 60px
        text-indent: 30px
        font-size: 25px
        color: #333
        outline: none
        border: 0
    .operation
        margin: 0 20px
        align-self: center
        width: fit-content
        // background: black
.box
    padding: 20px 50px
.editor
    height: calc( 100vh - 62px )
</style>