<template>
    <el-form v-model="newEntity" label-position="right" label-width="80px">
        <el-form-item label="状态">
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
            <el-avatar class="avatar" :src="newEntity.avatar" @click="avatar.edit = true"></el-avatar>
            <!-- <el-input v-model="newEntity.avatar"></el-input> -->
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
    <el-dialog v-model="avatar.edit" title="修改头像" width="300px">
        <div style="text-align: center">
            <uploder ref="uploder" @uploadCallback="uploadCallback"></uploder>
            <el-button style="margin-top: 10px" type="primary" @click="submitAvatar">确认</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {
    getOne,
    update,
    save,
    deleteById,
    commonajaxWithData,
} from "@/js/backstage/common/common_data_operation.js";
import uploder from "@/components/common/ImgUploader.vue"
export default {
    components: { uploder },
    emits: ["reloadData"],
    props: {
        entity: Object,
    },
    data() {
        return {
            avatar: {
                edit: false
            },
            newEntity: {

            }
        };
    },
    methods: {
        uploadCallback(url) {
            if (url) {
                this.newEntity.avatar = url
                this.avatar.edit = false
            }
        },
        async prepareAvatar() {

        },
        async prepareSave() {
            let result = await save("/auth/user", this.newEntity)
            if (result.success) {
                this.$emit("reloadData");
            }
        },
        async prepareUpdate() {
            let result = await update("/auth/user", this.newEntity.uid, this.newEntity)
            if (result.success) {
                this.$emit("reloadData");
            }
        },
        submitAvatar() {
            this.$refs.uploder.submitUpload();

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

<style lang="sass" scoped>
.avatar
    &:hover
        cursor: pointer
</style>
