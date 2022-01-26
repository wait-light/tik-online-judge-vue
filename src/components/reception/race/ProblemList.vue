<template>
    <div class="box">
        <el-table
            :data="problems"
            stripe
            :header-cell-style="{ textAlign: 'center' }"
            :cell-style="{ textAlign: 'center' }"
        >
            <el-table-column prop="id" label="编号" width="100"></el-table-column>
            <el-table-column prop="name" label="问题">
                <template #default="scope">
                    <el-link
                        :href="`/race/${route.params.raceId}/problem/${scope.row.id}?secretKey=${scope.row.secretKey}`"
                        type="primary"
                    >
                        {{
                            scope.row.name
                        }}
                    </el-link>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="ratio" label="Ratio(AC/Submit)" width="180">
            </el-table-column>-->
            <el-table-column prop="updateTime" label="时间" width="100">
                <template #default="scope">{{ new Date(scope.row.updateTime).toSimpleString() }}</template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref } from '@vue/reactivity';
import TikProblemList from "@/components/reception/TikProblemList.vue";
import { getData } from '@/js/common_data_operation';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
const route = useRoute()
const problems = ref([])
const loadProblems = () => {
    getData(`/social/race/problems/${route.params.raceId}`).then(res => {
        problems.value = res.problems
    })
}
onMounted(loadProblems)
</script>

<style lang="sass" scoped>
.box
    margin: 10px 30px
</style>