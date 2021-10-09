<template>
    <el-form v-model="newEntity" label-position="right" label-width="80px">
            <el-form-item label="问题id">
                <el-input v-model="newEntity.problemId"></el-input>
            </el-form-item>
            <el-form-item label="输入">
                <el-input v-model="newEntity.input"></el-input>
            </el-form-item>
            <el-form-item label="输出">
                <el-input v-model="newEntity.output"></el-input>
            </el-form-item>
            <el-form-item label="数据提供者">
                <el-input v-model="newEntity.createUserId"></el-input>
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
                let result = await save("/executor/problem-data",this.newEntity)
                if(result.success){
                    this.$emit("reloadData");
                }
            },
            async prepareUpdate(){
                let result = await update("/executor/problem-data",this.newEntity.id,this.newEntity)
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
