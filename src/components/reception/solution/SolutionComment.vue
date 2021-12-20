<template>
    <div class="comment-box">
        <el-empty v-if="commentList.length == 0" description="什么评论也没有"></el-empty>
        <div v-for="floor in commentList" :key="floor[0].id">
            <div class="floor-comment" v-for="(comment,index) in floor">
                <div class="comment-title">
                    <user-title size="small" :uid="comment.uid"></user-title>
                    <span
                        class="title-info"
                    >评论时间：{{ new Date(comment.createTime).toSimpleString() }}</span>
                </div>

                <p style="padding-left:38px;">{{ comment.content }}</p>
                <div class="comment-operation-box">
                    <span class="comment-reply" @click="prepareReply(comment.id)">
                        <el-icon>
                            <comment />
                        </el-icon>
                        <span class="comment-reply-tip">{{ replying(comment.id) }}</span>
                    </span>
                </div>
                <div
                    v-if="currentReply == comment.id"
                    class="make-comment-box"
                    style="margin-left:50px;margin-bottom:20px"
                >
                    <el-input
                        v-model="replyComment"
                        placeholder="留下你的观点吧！"
                        rows="3"
                        type="textarea"
                    ></el-input>
                    <el-button
                        @click="reply(comment.id, comment.floorId, replyComment)"
                        type="primary"
                        size="small"
                        class="publish"
                    >发布</el-button>
                </div>
            </div>

            <el-divider></el-divider>
        </div>

        <div class="make-comment-box">
            <el-input v-model="commentStr" placeholder="留下你的观点吧！" rows="3" type="textarea"></el-input>
            <el-button
                type="primary"
                size="small"
                class="publish"
                @click="reply(null, null, commentStr)"
            >发布</el-button>
        </div>
    </div>
</template>

<script setup>
import { Comment } from "@element-plus/icons"
import UserTitle from "@/components/common/UserTitle.vue"
import { postData, getData } from "@/js/common_data_operation"
import { ref } from "@vue/reactivity"
import { onMounted } from "vue"
import { useRoute } from "vue-router"
import { ElMessage } from "element-plus"
const commentList = ref([])
const replying = (id) => {
    if (id == currentReply.value) {
        return "取消回复"
    }
    return "回复"
}
const commentStr = ref("")
const replyComment = ref("")
const currentReply = ref(0)
const prepareReply = (id) => {
    if (currentReply.value == id) {
        currentReply.value = 0
    } else {
        currentReply.value = id
    }

    replyComment.value = ""
}
const route = useRoute()
const load = () => {
    getData(`/social/solution/comment/${route.params.solutionId}/floor`).then(res => {
        commentList.value = res.dto
    })
}
const reply = (commentId, floorId, content) => {
    if (!content) {
        ElMessage({
            message: '内容不能为空',
            type: 'warning',
        })
        return
    }
    postData(`/social/solution/comment/${route.params.solutionId}`, {
        parentId: commentId,
        floorId: floorId,
        content: content
    }, true)
        .then(res => {
            if (res.success) {
                if (commentId) {
                    replyComment.value = ""
                } else {
                    commentStr.value = ""
                }
                load()
                currentReply.value = 0
            }
        })
}
onMounted(() => {
    load()
})

</script>

<style lang="sass" scoped>

@import "@/sass/_variables.sass"
.floor-comment
    border-radius: $small-radius
    // margin: 20px 0px
    &:not(:first-child)
        margin-left: 30px
        margin-right: 5px
        background: #fcfcfc
        padding: 10px
    &:first-child
        margin-bottom: 10px
.make-comment-box
    margin: 10px 5px 10px 15px
    position: relative
    text-align: right
    .publish
        font-size: 10px
        position: relative
        top: 10px
.comment-operation-box
    position: relative
    margin-left: 52px
    margin-top: 10px
    margin-bottom: -15px
    padding-bottom: 12px
    .comment-reply-tip
        font-size: 5px
        color: $secondary-color
        position: relative
        top: -2px
.comment-reply
    color: $secondary-color
    &:hover
        cursor: pointer
.comment-title
    position: relative
.comment-box
    background: $division-color
    padding: 15px 10px 10px 0px
    border-radius: $small-radius
    p
        margin: 5px 15px
        font-size: 14px
        padding: 0
        // font-size: 18px
.title-info
    margin: 0 15px
    font-size: 10px
    color: $secondary-color
</style>