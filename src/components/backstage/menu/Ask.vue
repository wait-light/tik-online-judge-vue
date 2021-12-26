<template>
    <div>
        <email v-for="item in 10" :key="item" :style="{'margin-right':'30px'}" :width="500" :height="300" :bottom="200">
            <div class="content-box">
                <h6 class="title">管理员：</h6>
                <p class="title-role">我想申请：【阿萨德】</p>
                <p class="content">{{ content }}</p>
                <h6 class="sign">
                    <span class="name">某个用户</span>
                    {{ new Date().toChineseDateShortString() }}
                </h6>
            </div>
            <div class="operate">
                <el-button type="danger" size="mini">拒绝</el-button>
                <el-button style="margin-right: 10px;" type="success" size="mini">通过</el-button>
            </div>
        </email>
    </div>
</template>

<script setup>
import Email from "@/components/common/Email.vue"
import { ref } from "@vue/reactivity"
let a = "a"
for (let i = 0; i < 256; i++) {
    a += "a";
}
const content = ref(a)

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