<template>
    <el-row>
        <el-col :xs="0" :sm="4">
            <ul>
                <router-link
                    :to="`/race/${$route.params.raceId}/survey`"
                    custom
                    v-slot="{ href, isActive, navigate }"
                >
                    <li :class="[isActive && 'active-class', 'navigation']" @click="navigate">
                        <el-icon>
                            <notebook />
                        </el-icon>
                        <a :href="href">概况</a>
                    </li>
                </router-link>
                <router-link
                    :to="`/race/${$route.params.raceId}/problems`"
                    custom
                    v-slot="{ href, navigate }"
                >
                    <li
                        :class="[$route.path.indexOf('problem') != -1 && 'active-class', 'navigation']"
                        @click="navigate"
                    >
                        <el-icon>
                            <list />
                        </el-icon>
                        <a :href="href">题目列表</a>
                    </li>
                </router-link>
                <router-link
                    :to="`/race/${$route.params.raceId}/submission`"
                    custom
                    v-slot="{ href, isActive, navigate }"
                >
                    <li :class="[isActive && 'active-class', 'navigation']" @click="navigate">
                        <el-icon>
                            <operation />
                        </el-icon>
                        <a :href="href">提交列表</a>
                    </li>
                </router-link>
                <router-link
                    :to="`/race/${$route.params.raceId}/rank`"
                    custom
                    v-slot="{ href, isActive, navigate }"
                >
                    <li :class="[isActive && 'active-class', 'navigation']" @click="navigate">
                        <el-icon>
                            <histogram />
                        </el-icon>
                        <a :href="href">排名</a>
                    </li>
                </router-link>
            </ul>
            <!-- <el-divider></el-divider> -->
        </el-col>
        <el-col :xs="24" :sm="20">
            <router-view></router-view>
        </el-col>
    </el-row>
</template>

<script setup>
import { Notebook, List, Histogram, Operation } from '@element-plus/icons';
import { onMounted } from '@vue/runtime-core';
onMounted(()=>{
    document.title = "Tik Online Judge"
})
</script>

<style lang="sass" scoped>

@import "@/sass/_variables"
ul
    margin: 0
    padding: 0
    list-style: none
.active-class
    background: $auxiliary-color
.navigation
    padding: 12px
    margin: 10px 0
    border-top-right-radius: 10px
    border-bottom-right-radius: 10px
    a
        font-size: 16px
        margin-left: 10px
    &:hover
        cursor: pointer
        background: $auxiliary-color
    &:last-child
        margin: 10px 0 -15px 0
</style>