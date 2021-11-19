<template>
  <div class="buttons">
    <el-button @click="addRole" type="success" size="mini">添加</el-button>
  </div>
  <el-table
    :data="roles"
    height="calc( 100% - 63px )"
    style="width: 100%"
    :header-cell-style="{ textAlign: 'center' }"
    :cell-style="{ textAlign: 'center' }"
  >
    <el-table-column prop="name" label="角色名"></el-table-column>
    <el-table-column label="创建时间" width="120">
      <template #default="scope">
        <!-- <i class="el-icon-time"></i> -->
        <span style="margin-left: 10px">{{
          StringToSimpleDateString(scope.row.createTime)
        }}</span>
      </template>
    </el-table-column>
    <el-table-column label="修改时间" width="120">
      <template #default="scope">
        <!-- <i class="el-icon-time"></i> -->
        <span style="margin-left: 10px">{{
          StringToSimpleDateString(scope.row.updateTime)
        }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="createUserId" label="创建人" width="120"></el-table-column>
    <el-table-column label="状态" width="80">
      <template #default="scope">
        <el-switch
          v-model="scope.row.status"
          active-color="#13ce66"
          inactive-color="#ccc"
        ></el-switch>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作">
      <template #default="scope">
        <el-button type="info" size="mini" @click="chanegeRoleMenu(scope.row)"
          >角色权限</el-button
        >
        <el-button type="danger" size="mini" @click="prepareDelete(scope.row.id)"
          >删除</el-button
        >
      </template>
    </el-table-column>
    <el-table-column type="expand" width="80" label="展开">
      <template #default="props">
        <p class="extand-message">
          备注信息： <span>{{ props.row.remark }}</span>
        </p>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="角色权限" v-model="roleMenu.open">
    <div class="dialog-message">
      <role-add-or-update
        @reloadRoles="reloadRoles"
        :role="roleMenu.role"
      ></role-add-or-update>
    </div>
  </el-dialog>
</template>

<script>
import RoleAddOrUpdate from "@/components/backstage/role/RoleAddOrUpdate.vue";
import {
  deleteById,
  getList,
  getOne,
  update,
} from "@/js/backstage/common/common_data_operation";
export default {
  components: {
    RoleAddOrUpdate,
  },
  data() {
    return {
      roles: [
        {
          id: 1,
          name: "数据加载中",
          createTime: new Date(),
          updateTime: new Date(),
          remark: "数据加载中",
          createUserId: 0,
          status: true,
        },
      ],
      pageInfo: {
        pageSize: 10,
        page: 0,
        total: 0,
      },
      roleMenu: {
        role: {
          id: 1,
          name: "数据加载中",
          createTime: new Date(),
          updateTime: new Date(),
          remark: "数据加载中",
          createUserId: 0,
          status: true,
        },
        open: false,
      },
    };
  },
  methods: {
    deleteRole(id) {},
    StringToSimpleDateString(str) {
      return new Date(str).toSimpleString();
    },
    deleteById,
    chanegeRoleMenu(role) {
      this.roleMenu.role = role;
      this.roleMenu.open = true;
    },
    addRole() {
      this.roleMenu.role = {};
      this.roleMenu.open = true;
    },
    reloadRoles() {
      this.loadData();
      this.roleMenu.open = false;
    },
    async prepareDelete(id) {
      let result = await deleteById("/auth/role", id);
      if (result.success) {
        this.loadData();
      }
    },

    async loadData() {
      let result = await getList("/auth/role/list");
      if (result.success) {
        this.roles = result.list;
      }
    },
  },
  async mounted() {
    this.loadData();
  },
};
</script>

<style lang="sass" scoped>
.extand-message
  margin: 0 20px
  font-weight: 800
  span
    font-weight: 200
.dialog-message
  overflow: auto
  height: 55vh
.buttons
  margin: 10px 5px 25px
</style>
