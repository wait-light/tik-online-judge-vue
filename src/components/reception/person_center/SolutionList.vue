<template>
    <div style="display:flex; align-items:center;justify-content:space-between">
        <h1 v-if="pageInfo.total" >文章共{{ pageInfo.total }}篇</h1>
        <el-button
            v-if="isSelf"
            type="success"
            @click="router.push('/poster')"
            size="mini"
            style="height:10px"
        >新增</el-button>
    </div>
    <!-- v-infinite-scroll="load" :infinite-scroll-disabled="!pageInfo.hasNext" -->
    <div class="post-list">
        <el-empty v-if="!pageInfo.total" description="未发布任何文章"></el-empty>
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
            <div class="operate-box">
                <el-button
                    size="mini"
                    type="primary"
                    @click.stop="router.push(`/poster/${post.id}`)"
                >修改</el-button>
                <el-button size="mini" type="danger" @click.stop="deletePost(post.id)">删除</el-button>
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
import { deleteData, getData, getList } from "@/js/common_data_operation";
import { computed, reactive, ref } from "@vue/reactivity";
import { onMounted, watch } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { timeStr } from "@/js/DateUtil"
const props = defineProps({
    uid: [Number, String]
})
const store = useStore();
const route = useRoute()
const router = useRouter()
const pageInfo = ref({
    page: 1,
    pageSize: 3,
    hasNext: false,
    total: 0
})
const solutions = ref([])
const uid = ref(0)
// const user = computed(() => store.state.user.uid);

const isSelf = computed(() => {
    if (uid.value == store.state.user.user.uid) {
        return true
    }
    return false
})
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
const deletePost = (id) => {
    deleteData(`/social/post/${id}`, null, null, "确认删除该文章？").then(res => {
        getSolutions()
    })
}


const uidChange = (newValue) => {
  if (newValue) {
    uid.value = newValue
  } else {
    uid.value = store.state.user.user.uid
  }
  getSolutions()
}

const storeUidChange = (newValue, oldValue) => {
  if (newValue && !route.params.uid && !props.uid) {
    uid.value = newValue
    getSolutions()
  }
}

uid.value = props.uid || route.params.uid || store.state.user.user.uid
watch(() => props.uid, uidChange)
watch(() => route.params.uid, uidChange)
watch(() => store.state.user.user.uid, storeUidChange)

onMounted(() => {
    getSolutions()
})
</script>

<style lang="sass" scoped>

@import "@/sass/_variables.sass"
.operate-box
    display: none
    padding: 10px
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04)
    position: absolute
    right: 0
    top: 50%
    transform: translateY(-50%)
.post-list
    background: #fff
    border-bottom: $slim-border
    .post-box
        position: relative
        padding: 15px
        border-bottom: $slim-border
        &:hover
            cursor: pointer
            .operate-box
                display: block
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