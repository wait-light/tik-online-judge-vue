<template>
  <el-form :rules="rules" v-model="role" label-position="right" label-width="80px">
    <el-form-item label="名称">
      <el-input v-model="newRole.name"></el-input>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="newRole.remark"></el-input>
    </el-form-item>
    <el-form-item label="授权">
      <el-tree
        node-key="id"
        :default-checked-keys="roleMenus"
        :props="props"
        :data="menuTree"
        ref="tree"
        show-checkbox
      >
      </el-tree>
    </el-form-item>
    <el-form-item>
      <el-button @click="prepareSave" v-if="!newRole.id" type="success">保存</el-button>
      <el-button
        @click="prepareUpdate"
        v-if="newRole.id && newRole.id != 0"
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
    role: Object,
  },
  data() {
    return {
      menuTree: [],
      rules: {
        name: {
          required: true,
        },
      },
      props: {
        children: "children",
        label: "name",
      },
      count: 1,
      newRole: {},
      roleMenus: [],
    };
  },
  methods: {
    async getMenuTree() {
      let result = await commonajaxWithData("/user/menu/tree/");
      if (result.success) {
        this.menuTree = result.dto;
      }
    },
    async prepareSave() {
      this.newRole.roleMenus = this.$refs.tree.getCheckedKeys();
      let result = await save("/user/role", this.newRole);
      if (result.success) {
        this.$emit("reloadRoles");
      }
    },
    async prepareUpdate() {
      this.newRole.roleMenus = this.$refs.tree.getCheckedKeys();
      let result = await update("/user/role", this.newRole.id, this.newRole);
      if (result.success) {
        this.$emit("reloadRoles");
      }
    },
    async getRoleMenus(){
      if (this.newRole && this.newRole.id && this.newRole.id != 0) {
        let result = await commonajaxWithData(`/user/role-menu/menu/${this.newRole.id}`);
        if (result.success) {
          this.roleMenus = result.dto;
        }
      }
    }
  },
  watch: {
    async role(newValue, oldValue) {
      this.newRole = newValue;
      //说明是要修改一个角色，因此先查出对应的权限
      this.getRoleMenus()
    },
  },
  mounted() {
    this.newRole = this.role
    this.getRoleMenus()
    this.getMenuTree();
  },
};
</script>

<style></style>
