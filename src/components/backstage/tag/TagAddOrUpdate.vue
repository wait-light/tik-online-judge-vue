<template>
    <el-form v-model="newEntity" label-position="right" label-width="80px">
            <el-form-item label="标签名">
                <el-input v-model="newEntity.name"></el-input>
            </el-form-item>
            <el-form-item label="创建人id">
                <el-input v-model="newEntity.createUserId"></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker v-model="newEntity.createTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
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
                let result = await save("/executor/tag",this.newEntity)
                if(result.success){
                    this.$emit("reloadData");
                }
            },
            async prepareUpdate(){
                let result = await update("/executor/tag",this.newEntity.id,this.newEntity)
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
