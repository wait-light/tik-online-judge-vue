<template>
    <div class="menus">
        <el-row class="search">
            <el-col :xs="24" :sm="8">
                <el-input @keypress.enter="loadData" v-model="search" placeholder="请输入用户名">
                    <template #append>
                        <el-button @click="loadData">
                            <el-icon class="el-icon--right">
                                <Search />
                            </el-icon>
                        </el-button>
                    </template>
                </el-input>
            </el-col>
        </el-row>
        <el-button @click="prepareSave" type="success" size="mini">添加</el-button>
    </div>
    <el-table
        :data="table"
        height="calc( 100% - 101px )"
        style="width: 100%"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
    >
        <!-- <el-table-column prop="uid" label="用户id"></el-table-column> -->
        <el-table-column prop="username" label="用户名">
            <template #default="scope">
                <span style="font-size:12px;">{{ scope.row.username }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="avatar" label="头像" width="60">
            <template #default="scope">
                <el-avatar :size="44" :src="scope.row.avatar"></el-avatar>
            </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="150">
            <template #default="scope">
                <span style="font-size:12px;">{{ new Date(scope.row.createTime).toTypecalString() }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="修改时间" width="150">
            <template #default="scope">
                <span style="font-size:12px;">{{ new Date(scope.row.updateTime).toTypecalString() }}</span>
            </template>
        </el-table-column>

        <el-table-column label="状态" width="50">
            <template #default="scope">
                <el-switch
                    disabled
                    v-model="scope.row.status"
                    active-color="#13ce66"
                    inactive-color="#ccc"
                ></el-switch>
            </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称">
            <template #default="scope">
                <span style="font-size:12px;">{{ scope.row.nickname }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="telephone" label="手机号" width="110">
            <template #default="scope">
                <span style="font-size:12px;">{{ scope.row.telephone ? scope.row.telephone : "无" }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="email" label="电子邮箱">
            <template #default="scope">
                <span style="font-size:12px;">{{ scope.row.email ? scope.row.email : "无" }}</span>
            </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="120">
            <template #default="scope">
                <div class="button-box">
                    <div>
                        <el-button size="mini" @click="prepareUpdate(scope.row)" type="warning">修改</el-button>
                    </div>
                    <div>
                        <el-button
                            size="mini"
                            @click="prepareResetPassword(scope.row.uid)"
                            type="danger"
                        >重置密码</el-button>
                    </div>

                    <div>
                        <el-button size="mini" @click="preUserRoles(scope.row)" type="primary">角色管理</el-button>
                    </div>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog title="添加/修改" v-model="prepareEntity.open">
        <div class="dialog-message">
            <UserAddOrUpdate
                @reloadData="loadData"
                :isNew="prepareEntity.newOne"
                :entity="prepareEntity.entity"
            ></UserAddOrUpdate>
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
        :total="pageInfo.total"
    ></el-pagination>
    <el-dialog v-model="role.show" :title="roleTitle" width="30%">
        <div>
            <el-button size="mini" @click="prepareLoadUnLoad()">添加</el-button>
        </div>
        <el-empty description="没有任何角色" v-if="!role.roles || role.roles.length == 0"></el-empty>
        <el-tag
            class="role-tags"
            @close="removeRole(r.id)"
            closable
            v-for="r in role.roles"
            :key="r.id"
        >{{ r.name }}</el-tag>
    </el-dialog>
    <el-dialog v-model="userRole.show" @close="loadUserRoles(userRole.uid)">
        <p>点击标签添加，悬停查看介绍</p>
        <el-tag
            class="role-tags"
            v-for="r in userRole.roles"
            :key="r.id"
            :title="r.remark"
            @click="addUserRole(r.id)"
        >{{ r.name }}</el-tag>
    </el-dialog>
</template>

<script>
import {
    getOne,
    update,
    getList,
    deleteById,
    commonajaxWithData,
    getData,
    postData,
    deleteData,
} from "@/js/common_data_operation.js";
import { Search } from '@element-plus/icons'
import { ElMessageBox } from 'element-plus'
import UserAddOrUpdate
    from "@/components/backstage/user/UserAddOrUpdate.vue";
import { putData } from '@/js/common_data_operation';

export default {
    components: {
        UserAddOrUpdate, ElMessageBox, Search
    },
    data() {
        return {
            table: [],
            pageInfo: {
                pageSize: 10,
                page: 1,
                total: 0,
                pageSizes: [10, 20, 30, 50, 100]
            },
            prepareEntity: {
                entity: {},
                open: false,
                newOne: false
            },
            hideOnSinglePage: true,
            role: {
                show: false,
                username: "",
                roles: []
            },
            userRole: {
                show: false,
                roles: [],
                uid: 0
            },
            search: ""
        };
    },
    computed: {
        roleTitle() {
            return `【${this.role.username}】角色列表`
        }
    },
    methods: {
        prepareSave() {
            this.prepareEntity.entity = {}
            this.prepareEntity.open = true
            this.prepareEntity.newOne = true
        },
        prepareUpdate(entity) {
            this.prepareEntity.newOne = false
            this.prepareEntity.entity = entity
            this.prepareEntity.open = true

        },
        async prepareResetPassword(id) {
            ElMessageBox.confirm('确认重置密码?',
                'Warning',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    putData("/auth/user/resetPassword/" + id, null, true)
                })
        },
        async pageChange(page) {
            this.pageInfo.page = page
            this.loadData()
        },
        async pageSizeChange(pageSize) {
            this.pageInfoprepareSave.pageSize = pageSize
            this.loadData()
        },
        async loadData() {
            this.prepareEntity.open = false
            let result = await getList(`/auth/user/list?search=${this.search}`, this.pageInfo.page, this.pageInfo.pageSize);
            if (result.success) {
                this.table = result.list
                this.pageInfo.page = result.currentPage
                this.pageInfo.total = result.total
            }
        },
        preUserRoles(user) {
            this.role.username = user.username
            this.loadUserRoles(user.uid)
            this.userRole.uid = user.uid
            this.role.show = true
        },
        loadUserRoles(uid) {
            getData(`/auth/role/user/${uid}/roles`).then(res => {
                if (res.success) {
                    this.role.roles = res.dto
                }
            })
        },
        prepareLoadUnLoad() {
            this.userRole.show = true
            this.userRole.roles = []
            this.unroled(this.userRole.uid)
        },
        unroled(uid) {
            getData(`/auth/user-role/unroled/${uid}`).then(res => {
                if (res.success) {
                    this.userRole.roles = res.dto
                }
            })
        },
        addUserRole(id) {
            let data = {
                uid: this.userRole.uid,
                roleId: id
            }
            postData(`/auth/user-role`, data, true).then(res => {
                if (res.success) {
                    this.unroled(this.userRole.uid)
                }
            })
        },
        removeRole(id) {
            deleteData(`/auth/user-role/${this.userRole.uid}/${id}`, null, true).then((res) => {
                if (res.success) {
                    this.loadUserRoles(this.userRole.uid)
                }
            })
        }
    },
    mounted() {
        this.loadData()
    }
};
</script>

<style lang="sass" scoped>

.role-tags
    margin-top: 10px
    margin-right: 10px
    cursor: pointer
.menus
    margin: 10px 5px 25px
    display: flex
    .search
        width: 100%
.dialog-message
    overflow: auto
    height: 55vh
.button-box
    display: flex
    flex-direction: column
    div
        margin: 2.5px 0
</style>