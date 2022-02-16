<template>
    <div>
        <el-empty description="未收到任何申请" v-if="!messages || messages.length == 0"></el-empty>
        <email
            v-for="(item, index) in messages"
            :key="item"
            :style="{ 'margin-right': '30px' }"
            :width="500"
            :height="300"
            :bottom="200"
        >
            <div class="content-box">
                <h6 class="title">管理员：</h6>
                <p class="title-role">我想申请：【 {{ item.name }} 】</p>
                <p class="content">{{ item.reason }}</p>
                <h6 class="sign">
                    <span class="name">{{ item.nickname }}</span>
                    {{ new Date(item.createTime).toChineseDateShortString() }}
                </h6>
            </div>
            <div class="operate">
                <el-button type="danger" size="mini" @click="examine(index, 'FAIL')">拒绝</el-button>
                <el-button
                    style="margin-right: 10px;"
                    type="success"
                    size="mini"
                    @click="examine(index, 'ADOPT')"
                >通过</el-button>
            </div>
        </email>
    </div>
</template>

<script setup>
import Email from "@/components/common/Email.vue"
import { getData, putData } from "@/js/common_data_operation";
import { ref } from "@vue/reactivity"
import { onMounted } from "vue";
const pageInfo = ref({
    page: 1,
    pageSize: 10,
    hasNext: false
})
const messages = ref([])
const examine = (index, status) => {
    putData(`/auth/role-ask-admin/${messages.value[index].id}/${status}`, null, true).then(res => {
        if (res.success) {
            messages.value.splice(index, 1)
        }
    })
}
const loadData = () => {
    getData(`/auth/role-ask-admin/list?pageSize=${pageInfo.value.pageSize}&page=${pageInfo.value.page}`).then(res => {
        if (res.success) {
            pageInfo.value.hasNext = res.hasNextPage
            pageInfo.value.page++
            pageInfo.value.pageSize = res.pageSize
            messages.value = res.list
        }
    })
}
onMounted(() => {
    loadData()
})
</script>

<style lang="sass" scoped>
.content-box
    padding: 10px
    h6
        margin: 0
.content
    font-size: 8px
    overflow-wrap: break-word
.sign
    float: right
    .name
        margin-right: 10px
.title-role
    font-size: 8px
.operate
    display: flex
    width: 100%
    margin-top: 50px
    flex-direction: row-reverse
</style>