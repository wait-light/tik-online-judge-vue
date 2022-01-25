<template>
    <div class="box">
        <el-card class="task-describe">
            <h1>{{ task.name }}</h1>
            <span class="time">开始时间：{{ new Date(task.beginTime).toLocaleString() }}</span>
            <span class="time">截止时间： {{ new Date(task.endTime).toLocaleString() }}</span>

            <el-divider></el-divider>
            <user-title :uid="task.createUserId"></user-title>
            <span
                class="time"
                style="display: inline;"
            >发布时间：{{ new Date(task.createTime).toLocaleString() }}</span>
            <div>
                <p style="word-wrap: break-word">{{ task.taskIntroduce }}</p>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import UserTitle from "@/components/common/UserTitle.vue";
import { getData } from '@/js/common_data_operation';
import { useRoute } from 'vue-router';
const route = useRoute()
const task = ref({
    name: "加载中",
    createUserId: 0,
    createTime: new Date(),
    endTime: new Date(),
    beginTime: new Date(),
    taskIntroduce: "加载中。。。"
})

const loadData = () => {
    getData(`/social/race/survey/${route.params.raceId}`).then((res) => {
        if (res.success) {
            console.log(res);
            task.value = res.race
        }
    })
}
onMounted(() => {
    loadData()
})
</script>

<style lang="sass" scoped>
@import "@/sass/_variables"
.task-describe
    h1
        font-size: 18px
.time
    color: $secondary-color
    font-size: 8px
    display: block
.box
    margin-top: 10px
    padding-left: 1.5%
</style>