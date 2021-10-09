<template>
    <el-form v-model="newEntity" label-position="right" label-width="80px">
            <el-form-item label="用户id">
                <el-input v-model="newEntity.uid"></el-input>
            </el-form-item>
            <el-form-item label="语言类型">
                <el-input v-model="newEntity.languageType"></el-input>
            </el-form-item>
            <el-form-item label="内容(编码内容)">
                <el-input v-model="newEntity.content"></el-input>
            </el-form-item>
            <el-form-item label="提交时间">
                <el-date-picker v-model="newEntity.createTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="运行结果">
                <el-input v-model="newEntity.status"></el-input>
            </el-form-item>
            <el-form-item label="提交的问题">
                <el-input v-model="newEntity.problemId"></el-input>
            </el-form-item>
        <el-form-item>
            <el-button @click="prepareSave" v-if="!newEntity.id" type="success">保存</el-button>
            <el-button
                    @click="prepareUpdate"
                    v-if="newEntity.id && newEntity.id != 0"
                    type="warning"
            >修改</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {
        getOne,
        update,
        save,
        deleteById,
        commonajaxWithData,
    } from "@/js/backstage/common/common_data_operation.js";
    export default {
        props: {
            entity: Object,
        },
        data() {
            return {
                newEntity:{

                }
            };
        },
        methods: {
            async prepareSave(){
                let result = await save("/executor/submit",this.newEntity)
                if(result.success){
                    this.$emit("reloadData");
                }
            },
            async prepareUpdate(){
                let result = await update("/executor/submit",this.newEntity.id,this.newEntity)
                if(result.success){
                    this.$emit("reloadData");
                }
            }
        },
        watch: {
            async entity(newValue, oldValue) {
                this.newEntity = newValue;
            },
        },
        mounted() {
            this.newEntity = this.entity
        },
    };
</script>

<style></style>
