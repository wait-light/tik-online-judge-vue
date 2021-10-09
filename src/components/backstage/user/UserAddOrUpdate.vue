<template>
    <el-form v-model="newEntity" label-position="right" label-width="80px">
            <el-form-item label="用户id">
                <el-input v-model="newEntity.uid"></el-input>
            </el-form-item>
            <el-form-item label="用户名">
                <el-input v-model="newEntity.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="newEntity.password"></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker v-model="newEntity.createTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="修改时间">
                <el-date-picker v-model="newEntity.updateTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="状态(1启用/0禁用)">
                <el-switch v-model="newEntity.status" active-color="#13ce66" inactive-color="#ccc"></el-switch>
            </el-form-item>
            <el-form-item label="昵称">
                <el-input v-model="newEntity.nickname"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="newEntity.telephone"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱">
                <el-input v-model="newEntity.email"></el-input>
            </el-form-item>
            <el-form-item label="头像">
                <el-input v-model="newEntity.avatar"></el-input>
            </el-form-item>
        <el-form-item>
            <el-button @click="prepareSave" v-if="!newEntity.uid" type="success">保存</el-button>
            <el-button
                    @click="prepareUpdate"
                    v-if="newEntity.uid && newEntity.uid != 0"
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
                let result = await save("/user/user",this.newEntity)
                if(result.success){
                    this.$emit("reloadData");
                }
            },
            async prepareUpdate(){
                let result = await update("/user/user",this.newEntity.uid,this.newEntity)
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
