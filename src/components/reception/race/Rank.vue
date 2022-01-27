<template>
    <div class="box">
        <el-table class="submissions" :data="rank" empty-text="无任何提交">
            <el-table-column align="center" label="排名" prop="rank" width="100"></el-table-column>
            <el-table-column align="center" label="用户" prop="userNickname" min-width="150"></el-table-column>
            <el-table-column align="center" label="总分" prop="score" width="100"></el-table-column>
            <el-table-column align="center" label="罚时" prop="penalty" width="100"></el-table-column>
            <el-table-column
                align="center"
                v-for="item of problems"
                :key="item[0]"
                :label="`${item[0]}. ${item[1]}`"
                min-width="100"
            >
                <template
                    #default="scope"
                >{{ scope.row.problemScores[item[0]] ? scope.row.problemScores[item[0]] : 0 }}</template>
            </el-table-column>
            <!-- <el-table-column label="提交时间" prop="createTime" width="160">
                <template #default="scope">{{ new Date(scope.row.createTime).toTypecalString() }}</template>
            </el-table-column>-->
        </el-table>
    </div>
</template>

<script setup>import { onMounted, ref } from 'vue';
import { getData, getList } from '@/js/common_data_operation';
import { useRoute } from 'vue-router';

const pageInfo = ref({
    page: 1,
    pageSize: 50,
    hasNextPage: false,
    hasPrePage: false
})
const problems = ref([])
const rank = ref([])
const route = useRoute()
const getRank = () => {
    getList(`/executor/task-rank/${route.params.raceId}`).then(res => {
        if (res.success) {
            rank.value = res.list
        }
        console.log(res);
    })
}
const getProblems = () => {
    getData(`/executor/task-rank/${route.params.raceId}/problems`).then(res => {
        console.log(res);
        if (res.success) {
            problems.value = Object.entries(res.dto)
        }
    })
}
onMounted(() => {
    getRank()
    getProblems()
})
</script>

<style lang="sass" scoped>

.box
    margin: 10px 20px
    -moz-user-select: none
    -webkit-user-select: none
    -ms-user-select: none
    -khtml-user-select: none
    -o-user-select: none
    user-select: none
</style>