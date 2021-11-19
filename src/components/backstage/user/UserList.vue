<template>
    <div class="buttons">
        <el-button @click="prepareSave" type="success" size="mini">添加</el-button>
    </div>
    <el-table
            :data="table"
            height="calc( 100% - 101px )"
            style="width: 100%"
            :header-cell-style="{ textAlign: 'center' }"
            :cell-style="{ textAlign: 'center' }"
    >
            <el-table-column prop="uid" label="用户id"></el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="password" label="密码"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column prop="updateTime" label="修改时间"></el-table-column>
            <el-table-column label="状态(1启用/0禁用)" width="80">
                <template #default="scope">
                    <el-switch
                            disabled
                            v-model="scope.row.status"
                            active-color="#13ce66"
                            inactive-color="#ccc"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="nickname" label="昵称"></el-table-column>
            <el-table-column prop="telephone" label="手机号"></el-table-column>
            <el-table-column prop="email" label="电子邮箱"></el-table-column>
            <el-table-column prop="avatar" label="头像"></el-table-column>
            <el-table-column label="操作" fixed="right" width="150">
                <template #default="scope">
                    <el-button size="mini" @click="prepareUpdate(scope.row)" type="warning">修改</el-button>
                    <el-button size="mini" @click="prepareDelete(scope.row)" type="danger">删除</el-button>
                </template>
            </el-table-column>
    </el-table>
    <el-dialog title="添加/修改" v-model="prepareEntity.open">
        <div class="dialog-message">
            <UserAddOrUpdate @reloadData="loadData" :entity="prepareEntity.entity"></UserAddOrUpdate>
        </div>
    </el-dialog>
    <el-pagination
        :hide-on-single-page="hideOnSinglePage"
        @size-change="pageSizeChange"
        @current-change="pageChange"
        :current-page="pageInfo.page"
        :page-sizes="pageInfo.pageSizes"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total">
    </el-pagination>
</template>

<script>
    import {
        getOne,
        update,
        getList,
        deleteById,
        commonajaxWithData,
    } from "@/js/backstage/common/common_data_operation.js";
    import UserAddOrUpdate
        from "@/components/backstage/user/UserAddOrUpdate.vue";

    export default {
        components: {
            UserAddOrUpdate,
        },
        data() {
            return {
                table:[],
                pageInfo:{
                  pageSize:10,
                  page:1,
                  total:0,
                  pageSizes:[10,20,30,50,100]
                },
                prepareEntity: {
                    entity: {},
                    open: false
                },
                hideOnSinglePage:true
            };
        },
        methods: {
            prepareSave() {
                this.prepareEntity.entity = {}
                this.prepareEntity.open = true
            },
            prepareUpdate(entity) {
                this.prepareEntity.entity = entity
                this.prepareEntity.open = true
            },
            async prepareDelete(entity) {
                let result = await deleteById("/auth/user", entity.uid);
                if (result.success) {
                    this.loadData();
                }
            },
            async pageChange(page){
                this.pageInfo.page = page
                this.loadData()
            },
            async pageSizeChange(pageSize){
                this.pageInfo.pageSize = pageSize
                this.loadData()
            },
            async loadData() {
                this.prepareEntity.open = false
                let result =await getList("/auth/user/list",this.pageInfo.page,this.pageInfo.pageSize);
                if(result.success){
                    this.table = result.list;
                    this.pageInfo.pageSize = result.pageSize
                    this.pageInfo.page = result.page
                    this.pageInfo.total = result.total
                }
            }
        },
        mounted() {
            this.loadData()
        }
    };
</script>

<style lang="sass" scoped>
.buttons
    margin: 10px 5px 25px
.dialog-message
    overflow: auto
    height: 55vh
</style>