<template>
    <el-empty description="Ta还为开始" v-if="!problems || problems.length == 0"></el-empty>
    <div v-if="problems && problems.length > 0">
        <h1 class="resolve-problem-header">已解决{{ problems.length }}个问题</h1>
        <el-link
            class="resolve-problem"
            :href="`/problem/${problem.id}?secretKey=${problem.secretKey}`"
            v-for="problem in problems"
            :key="problem.id"
        >{{ problem.name }}</el-link>
    </div>
</template>

<script setup>
import { getData } from "@/js/common_data_operation"
import { ref } from "@vue/reactivity"
import { onMounted, watch } from "@vue/runtime-core"
import { useRoute } from "vue-router"
import { useStore } from "vuex"
const route = useRoute()
const store = useStore()
const props = defineProps({
    uid: [Number, String]
})

const uid = ref(0)
const problems = ref([])
const loadProblem = () => {
    if (uid.value) {
        getData(`/executor/problem/submittedProblem/${uid.value}/ACCEPT`).then(res => {
            if (res.success) {
                problems.value = res.dto
            }
        })
    }
}

const uidChange = (newValue) => {
    if (newValue) {
        uid.value = newValue
    } else {
        uid.value = store.state.user.user.uid
    }
    loadProblem()
}
const storeUidChange = (newValue, oldValue) => {
    if (newValue && !route.params.uid && !props.uid) {
        uid.value = newValue
        loadProblem()
    }
}

uid.value = props.uid || route.params.uid || store.state.user.user.uid
watch(() => props.uid, uidChange)
watch(() => route.params.uid, uidChange)
watch(() => store.state.user.user.uid, storeUidChange)

onMounted(() => {
    loadProblem()
})

</script>

<style lang="sass" scoped>

.resolve-problem-header
    font-size: 18px
.resolve-problem
    margin-right: 20px
</style>