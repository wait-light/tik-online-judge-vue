<template>
    <div>
        <h1>文章共{{ pageInfo.total }}篇</h1>
    </div>
    <!-- v-infinite-scroll="load" :infinite-scroll-disabled="!pageInfo.hasNext" -->
    <div class="post-list">
        <div class="post-box" @click="goPost(post.id)" v-for="post in solutions" :key="post.id">
            <div class="post-header">
                <span class="post-user">{{ post.username }}</span>
                <span class="division"></span>
                <span class="post-time">{{ timeStr(post.createTime) }}</span>
            </div>
            <div class="post-title">{{ post.title }}</div>
            <div class="post-content">{{ post.content }}</div>
            <div class="post-info">
                <div class="post-info-item">
                    <el-icon>
                        <View />
                    </el-icon>
                    <span>{{ post.view }}</span>
                </div>
            </div>
        </div>
    </div>
    <el-pagination
        :hide-on-single-page="true"
        @size-change="pageSizeChange"
        @current-change="pageChange"
        :current-page="pageInfo.page"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total"
    ></el-pagination>
</template>

<script setup>
import { View } from "@element-plus/icons";
import { getData, getList } from "@/js/common_data_operation";
import { computed, reactive, ref } from "@vue/reactivity";
import { onMounted, watch } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { timeStr } from "@/js/DateUtil"
const props = defineProps({
    uid: Number, String
})
const store = useStore();
const route = useRoute()
const pageInfo = ref({
    page: 1,
    pageSize: 3,
    hasNext: false,
    total: 0
})
const solutions = ref([])
const uid = ref(0)
// const user = computed(() => store.state.user.uid);
const uidChange = (newValue) => {
    if (newValue) {
        uid.value = newValue
    }
    getSolutions()
}
if (props.uid) {
    uid.value = props.uid
    watch(() => props.uid, uidChange)
}
if (route.params.uid) {
    uid.value = route.params.uid
    watch(() => route.params.uid, uidChange)
} else {
    uid.value = store.state.user.user.uid
    watch(() => store.state.user.user.uid, uidChange)
}

const pageSizeChange = (size) => {
    pageInfo.value.pageSize = size
    getSolutions()
}
const pageChange = (page) => {
    pageInfo.value.page = page
    getSolutions()
}
const getSolutions = () => {
    if (uid.value) {
        getList(`/social/solution/user-solution/${uid.value}`, pageInfo.value.page, pageInfo.value.pageSize).then(res => {
            if (res.success) {
                pageInfo.value.hasNext = res.hasNextPage
                pageInfo.value.page = res.currentPage
                pageInfo.value.total = res.total
                solutions.value = res.list
            }
        })
    }
}
const goPost = (id) => {
    window.open(`/post/${id}`, '_blank');
}
onMounted(() => {


    getSolutions()
})
</script>

<style lang="sass" scoped>

@import "@/sass/_variables.sass"
.post-list
    background: #fff
    border-bottom: $slim-border
    .post-box
        padding: 15px
        border-bottom: $slim-border
        &:hover
            cursor: pointer
        .post-header
            font-size: 14px
            display: flex
            .post-user,.post-time
                margin-right: 10px
                color: #666
            .division
                margin-right: 10px
                position: relative
                top: 5px
        .post-title
            color: #444
            font-weight: 700
            // line-height: 24px
            text-overflow: ellipsis
            font-size: 16px
            margin: 8px 0px
        .post-content
            font-size: 13px
            color: #86909c
        .post-info
            margin-top: 5px
            .post-info-item
                color: #888
                font-size: 15px
                span
                    position: relative
                    bottom: 2px
                    left: 3px
                    font-size: 10px
</style>