<template>
    <div class="content-box">
        <el-row class="content-box" justify="center">
            <el-col :lg="12" :md="16">
                <div class="sort-header">
                    <nav>
                        <router-link custom to="/posts?type=1" v-slot="{ navigate }">
                            <a
                                @click="navigate"
                                href="/posts?type=1"
                                :class="route.query.type == 1 || !route.query.type ? 'type-active' : ''"
                            >
                                <ul>热门</ul>
                            </a>
                        </router-link>
                        <span class="division"></span>
                        <router-link to="/posts?type=2" custom v-slot="{ navigate }">
                            <a
                                @click="navigate"
                                href="/posts?type=2"
                                :class="(route.query.type == 2 ? 'type-active' : '')"
                            >
                                <ul>最新</ul>
                            </a>
                        </router-link>
                        <span class="division"></span>
                        <router-link to="/posts?type=3" custom v-slot="{ navigate }">
                            <a
                                @click="navigate"
                                href="/posts?type=3"
                                :class="route.query.type == 3 ? 'type-active' : ''"
                            >
                                <ul>随机</ul>
                            </a>
                        </router-link>
                    </nav>
                </div>
                <el-empty v-if="posts.length == 0" description="什么都没有"></el-empty>
                <div
                    class="post-list"
                    v-infinite-scroll="load"
                    :infinite-scroll-disabled="!pageInfo.hasNext"
                >
                    <div
                        class="post-box"
                        @click="goPost(post.id)"
                        v-for="post in posts"
                        :key="post.id"
                    >
                        <div class="post-header">
                            <span class="post-user">{{ post.title }}</span>
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
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { View } from "@element-plus/icons";
import { onMounted, watch, watchEffect } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import router from "@/router";
import { getData } from "@/js/common_data_operation";
const pageInfo = ref({
    page: 1,
    hasNext: true,
    orderBy: "create_time desc"
})
const type = ref(2)
const posts = ref([])
onMounted(() => {
    if (!route.query.type) {
        route.query.type = 1
    }
})
const load = () => {
    return getData(`/social/post/list?pageSize=10&page=${pageInfo.value.page}&type=${type.value}&${pageInfo.value.orderBy}`, false)
        .then(res => {
            if (res.success) {
                for (let index = 0; index < res.list.length; index++) {
                    const element = res.list[index];
                    element.createTime = new Date(element.createTime)
                    element.content += "...";
                    posts.value.push(element)
                }
                pageInfo.value.page++
                pageInfo.value.hasNext = res.hasNextPage
            }
        })

}
const route = useRoute()
watch(route, () => {
    if (route.query.type) {
        type.value = route.query.type
    }
    if (type.value == 1) {
        pageInfo.value.orderBy = "orderBy=orderBy view desc"
    } else if (type.value == 2) {
        pageInfo.value.orderBy = "orderBy=orderBy create_time desc"
    } else {
        pageInfo.value.orderBy = ""
    }
    pageInfo.value.hasNext = true
    pageInfo.value.page = 1
    posts.value.splice(0, posts.value.length)
})
const goPost = (id) => {
    window.open(`/post/${id}`, '_blank');
}
const timeStr = (time) => {
    let now = new Date().valueOf()
    let target = time.valueOf()
    let distance = (now - target) / 1000 / 60
    if (distance < 1) {
        return "刚刚"
    } else if (distance < 60) {
        return `${Math.floor(distance)}分钟前`
    } else if (distance < 1440) {
        return `${Math.floor(distance / 60)}小时前`
    } else if (distance < 43200) {
        return `${Math.floor(distance / 1440)}天前`
    } else if (distance < 518400) {
        return `${Math.floor(distance / 43200)}月前`
    } else {
        return `${Math.floor(distance / 518400)}年前`
    }
}
</script>

<style lang="sass" scoped>
@import "@/sass/_variables.sass"
.type-active
    ul
        color: $minor-color !important
.content-box
    background: #f9f9f9
    height: fit-content
    padding: 10px 0
.division
    display: inline-block
    font-size: 10px
    vertical-align: middle
    color: $secondary-color
    &:after
        content: "|"
.post-list,.sort-header
    background: white
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

.sort-header
    border: $slim-border
    padding: 8px
    nav
        display: flex
        ul
            padding: 0
            color: $secondary-color
            margin: 3px 5px
        span
            position: relative
            top: 8px
</style>