<template>
    <div>
        <problem-edit @afterProblemAddSuccess="afterProblemUpdateSuccess"></problem-edit>
    </div>
</template>

<script setup>
import ProblemEdit from '@/components/common/ProblemEdit.vue';
function afterProblemUpdateSuccess(){
    console.log("添加成功");
}
</script>

<style lang="sass" scoped>
</style>