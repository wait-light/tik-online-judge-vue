<template>
    <div class="box">
        <el-table :data="submissions" empty-text="无任何提交">
            <el-table-column label="用户"></el-table-column>
            <el-table-column label="题目"></el-table-column>
            <el-table-column label="状态"></el-table-column>
            <el-table-column label="分数"></el-table-column>
            <el-table-column label="语言"></el-table-column>
            <el-table-column label="耗时"></el-table-column>
            <el-table-column label="内存"></el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
const submissions = ref([])

</script>

<style lang="sass" scoped>
.box
    margin: 10px 20px
</style>