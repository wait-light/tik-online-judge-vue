<template>
    <el-form v-model="newEntity" label-position="right" label-width="80px">
            <el-form-item label="问题名称">
                <el-input v-model="newEntity.name"></el-input>
            </el-form-item>
            <el-form-item label="上传人">
                <el-input v-model="newEntity.uid"></el-input>
            </el-form-item>
            <el-form-item label="问题描述">
                <el-input v-model="newEntity.problemDescribe"></el-input>
            </el-form-item>
            <el-form-item label="输入">
                <el-input v-model="newEntity.input"></el-input>
            </el-form-item>
            <el-form-item label="输出">
                <el-input v-model="newEntity.output"></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker v-model="newEntity.createTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="修改时间">
                <el-date-picker v-model="newEntity.updateTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="状态">
                <el-switch v-model="newEntity.status" active-color="#13ce66" inactive-color="#ccc"></el-switch>
            </el-form-item>
            <el-form-item label="">
                <el-input v-model="newEntity.inputDescrible"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-input v-model="newEntity.outputDescrible"></el-input>
            </el-form-item>
            <el-form-item label="所属合集">
                <el-input v-model="newEntity.collectionId"></el-input>
            </el-form-item>
            <el-form-item label="是否与其他集合共享">
                <el-switch v-model="newEntity.share" active-color="#13ce66" inactive-color="#ccc"></el-switch>
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
                let result = await save("/executor/problem",this.newEntity)
                if(result.success){
                    this.$emit("reloadData");
                }
            },
            async prepareUpdate(){
                let result = await update("/executor/problem",this.newEntity.id,this.newEntity)
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
