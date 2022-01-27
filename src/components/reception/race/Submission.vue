<template>
    <div class="box">
        <el-table class="submissions" :data="submissions" empty-text="无任何提交">
            <el-table-column label="用户" prop="userName"></el-table-column>
            <el-table-column label="题目" prop="problemName"></el-table-column>
            <el-table-column label="状态" prop="status">
                <template #default="scope">
                    <el-tag
                        size="mini"
                        :type="statusType(scope.row.status)"
                    >{{ scope.row.status ? scope.row.status : "WAITTING_JUDGE" }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="分数" prop="score"></el-table-column>
            <el-table-column label="语言" prop="languageType"></el-table-column>
            <el-table-column label="耗时(ms)" prop="runtime"></el-table-column>
            <el-table-column label="内存(kb)" prop="runtimeMemory"></el-table-column>
            <el-table-column label="提交时间" prop="createTime" width="160">
                <template #default="scope">{{ new Date(scope.row.createTime).toTypecalString() }}</template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { getList } from "@/js/common_data_operation";
import { ref } from "@vue/reactivity";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
const submissions = ref([])
const pageInfo = ref({
    page: 1,
    pageSize: 10,
    hasNextPage: false,
    hasPreviousPage: false
})
const route = useRoute()
const loadSubmission = () => {
    getList(`/executor/task-submit/${route.params.raceId}/list`, pageInfo.value.page, pageInfo.value.pageSize, "create_time desc").then(res => {
        if (res.success) {
            submissions.value = res.list
            pageInfo.value.page = res.currentPage
            pageInfo.value.hasNextPage = res.hasNextPage
            pageInfo.value.hasPreviousPage = res.hasPreviousPage
        }
    })
}
const statusType = (status) => {
    switch (status) {
        case "JUDGING": return "";
        case "ACCEPT": return "success"
        case "COMPILE_ERROR": return "danger"
        case "RUNTIME_ERROR": return "danger"
        case "TIME_LIME_EXCEEDED": return "danger"
        case "SYSTEM_ERROR": return "danger"
        case "PRESENTATION_ERROR": return "warning"
        case "WRONG_ANSWER": return "danger"
        case "MEMORY_LIMIT_EXCEEDED": return "danger"
        case "PART_ACCEPT": return "warning"
        default: return "info"
    }
}
onMounted(loadSubmission)
</script>

<style lang="sass" scoped>
.box
    margin: 10px 20px
.submissions
    -moz-user-select: none
    -webkit-user-select: none
    -ms-user-select: none
    -khtml-user-select: none
    -o-user-select: none
    user-select: none
</style>