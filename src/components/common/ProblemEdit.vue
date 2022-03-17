<template>
    <div style="height:100%;">
        <el-row style="height:100%">
            <el-col :xs="3" :sm="3" style="height:100%">
                <el-steps direction="vertical" :active="active">
                    <el-step title="基础信息"></el-step>
                    <el-step title="问题描述"></el-step>
                    <el-step title="输入描述"></el-step>
                    <el-step title="输出描述"></el-step>
                    <el-step finish-status="finish" title="样例"></el-step>
                </el-steps>
            </el-col>
            <el-col style="height:100%" :push="1" :xs="18" :sm="20">
                <el-carousel
                    height="calc( 100vh - 200px )"
                    ref="stepContent"
                    direction="vertical"
                    class="step-container"
                    @change="change"
                    :loop="false"
                    :autoplay="false"
                    indicator-position="none"
                    arrow="never"
                >
                    <el-carousel-item class="step-box">
                        <div class="step-box-item">
                            <el-form :rules="rules" :model="problem" label-width="80px">
                                <el-form-item label="标题">
                                    <el-input placeholder="标题" v-model="problem.name" />
                                </el-form-item>
                                <el-form-item label="共享" title="是否共享给其他题集">
                                    <el-switch v-model="problem.share"></el-switch>
                                </el-form-item>
                                <el-form-item label="立即启用" title="是否立即开启使用">
                                    <el-switch v-model="problem.status"></el-switch>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-carousel-item>
                    <el-carousel-item class="step-box">
                        <md-editor style="height: 100%;" v-model="problem.problemDescribe" />
                    </el-carousel-item>
                    <el-carousel-item class="step-box">
                        <md-editor style="height: 100%;" v-model="problem.inputDescrible" />
                    </el-carousel-item>
                    <el-carousel-item class="step-box">
                        <md-editor style="height: 100%;" v-model="problem.outputDescrible" />
                    </el-carousel-item>
                    <el-carousel-item class="step-box">
                        <el-form label-width="80px" style="width: 100%;">
                            <el-form-item label="输入样例">
                                <el-input rows="9" type="textarea" v-model="problem.input"></el-input>
                            </el-form-item>
                            <el-form-item label="输出样例">
                                <el-input rows="9" type="textarea" v-model="problem.output"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-carousel-item>
                </el-carousel>
                <div style="float:right;margin-top:10px">
                    <el-form
                        :rules="rules"
                        class="container"
                        ref="problemForm"
                        :model="problem"
                        label-width="80px"
                    >
                        <el-form-item prop="name"></el-form-item>
                        <el-form-item prop="problemDescribe"></el-form-item>
                    </el-form>
                    <el-button size="mini" v-if="hasPre" @click="preStep">上一步</el-button>
                    <el-button size="mini" v-if="hasNext" @click="nextStep">下一步</el-button>
                    <el-button v-if="!problem.id" size="mini" type="primary" @click="addProblem">添加</el-button>
                    <el-button
                        v-if="problem.id"
                        size="mini"
                        type="warning"
                        @click="updateProblem"
                    >修改</el-button>
                </div>
            </el-col>
        </el-row>
    </div>

    <!-- <h4 style="text-align: center">{{ typeDescribe }}</h4> -->
</template>


<script setup>
import { computed, ref, toRef } from "@vue/reactivity";
import "md-editor-v3/lib/style.css";
import MdEditor from "@/components/common/TikMdEditor.vue"
import { onMounted, watch, watchEffect } from "@vue/runtime-core";
import { getData, postData, putData } from "@/js/common_data_operation";
import { ElMessage } from 'element-plus';
import { Watch } from "@element-plus/icons";

const rules = {
    name: [
        {
            required: true,
            trigger: "blur",
            message: "标题不能为空"
        },
    ],
    problemDescribe: [
        {
            required: true,
            trigger: "blur",
            message: "问题描述不能为空"
        },
    ]
}

const active = ref(0)
const stepContent = ref(null)
const problemForm = ref(null)
const problem = ref({})
const props = defineProps(["secretKey", "problemId"])
const emit = defineEmits(["add-problem", "update-problem"])
const problemId = toRef(props, 'problemId')
const change = (now, old) => {
    active.value = now
}

const loadProblem = () => {
    if (problem.value.id) {
        getData(`/executor/problem/${problem.value.id}?secretKey=${props.secretKey}`)
            .then(res => {
                if (res.success) {
                    problem.value = res.dto
                }
            })
    }
}
const clearProblem = () => {
    problem.value = {}
}
const addProblem = () => {
    problemForm.value.validate((valid, err) => {
        if (valid) {
            emit("add-problem", problem.value, clearProblem)
        } else {
            let keys = Object.keys(err)
            let message = ""
            let index = 1
            for (let key of keys) {
                let value = err[key]
                for (let v of value) {
                    message += index + ". " + v.message + "\n"
                    index++
                }
            }
            ElMessage.error(message)
        }
        return valid
    })
}
const updateProblem = () => {
    problemForm.value.validate((valid, err) => {
        if (valid) {
            emit("update-problem", problem.value, clearProblem)
        } else {
            let keys = Object.keys(err)
            let message = ""
            let index = 1
            for (let key of keys) {
                let value = err[key]
                for (let v of value) {
                    message += index + ". " + v.message + "\n"
                    index++
                }
            }
            ElMessage.error(message)
        }
        return valid
    })
}
const preStep = () => {
    stepContent.value.prev()
}
const nextStep = () => {
    stepContent.value.next()
}

const hasNext = computed(() => {
    return active.value < 4
})
const hasPre = computed(() => {
    return active.value != 0
})

watch(problemId, (newValue) => {
    active.value = 0
    stepContent.value.setActiveItem(0)
    if (newValue) {
        problem.value.id = newValue
        loadProblem()
    } else {
        problem.value = {}
    }
})
onMounted(() => {
    if (problemId.value) {
        problem.value.id = problemId.value
    }
    loadProblem()
})
</script>

<style lang="sass" scoped>

.step-box
  // text-align: center
    margin: 0 auto
    display: flex
    height: 100%
    width: 100%
    justify-content: center
.step-box-item
    display: block
    // text-align: center
    width: 80%
    margin: auto 0
.container
    display: none
</style>