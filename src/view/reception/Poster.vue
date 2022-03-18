<template>
    <div v-loading="loading" element-loading-text="正在载入文章">
        <div class="title-box">
            <input placeholder="请输入文章标题..." max="64" v-model="post.title" />
            <div style="width:130px; margin:auto 10px;">
                <el-dropdown>
                    <el-button size="mini" type="primary" @click="doPost">
                        {{ res }}
                        <el-icon class="el-icon--right">
                            <ArrowDown />
                        </el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item
                                @click="router.push({ path: '/redirect', query: { path: '' } })"
                            >返回首页</el-dropdown-item>
                            <el-dropdown-item
                                @click="goWhere('https://www.runoob.com/markdown/md-tutorial.html')"
                            >Markdown教程</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <md-editor :historyLength="20" class="editor" v-model="post.content" />
    </div>
</template>

<script setup>
import MdEditor from "@/components/common/TikMdEditor.vue"
import { computed, ref } from "@vue/reactivity"
import { ElMessage } from "element-plus"
import { getData, postData, putData } from "@/js/common_data_operation"
import { useRoute, useRouter } from "vue-router"
import { ArrowDown } from "@element-plus/icons"
import { onMounted } from "@vue/runtime-core"
const post = ref({
    content: "",
    title: ""
})
const loading = ref(false)
const route = useRoute();
const res = computed(() => {
    if (route.params.posterId) {
        getPost()
        return "修改"
    } else {
        return "发布"
    }
})
const router = useRouter()
const goWhere = (url) => {
    window.open(url, "_blank")
}
const getPost = () => {
    loading.value = true
    getData(`/social/post/${route.params.posterId}`).then(res => {
        if (res.success) {
            post.value = res.dto
        } else {
            ElMessage.error(res.msg)
        }
        loading.value = false
    }).catch((err) => {
        loading.value = false
    })
}
const doPost = () => {
    if (!post.value.title) {
        ElMessage.warning("标题不能为空")
        return
    }
    if (!post.value.content) {
        ElMessage.warning("内容不能为空")
        return
    }
    //新增
    if (!post.value.id) {
        postData(`/social/post`, post.value, true)
            .then(res => {
                if (res.success) {
                    router.push(`/post/${res.id}`)
                }
            })
        //修改
    } else {
        putData(`/social/post`, post.value, true)
            .then(res => {
                if (res.success) {
                    router.push(`/post/${post.value.id}`)
                }
            })
    }

}
document.title = "Tik Online Judge"
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
        display: flex
        margin: 0 20px
        align-self: center
        width: fit-content
        // background: black
.box
    padding: 20px 50px
.editor
    height: calc( 100vh - 62px )
</style>