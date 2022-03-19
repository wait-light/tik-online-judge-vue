<template>
  <el-form :rules="rules" v-model="role" label-position="right" label-width="80px">
    <el-form-item label="名称">
      <el-input v-model="newRole.name"></el-input>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="newRole.remark"></el-input>
    </el-form-item>
    <el-form-item label="授权">
      <el-tree node-key="id" :props="props" :data="menuTree" ref="tree" show-checkbox></el-tree>
    </el-form-item>
    <el-form-item>
      <el-button @click="prepareSave" v-if="!newRole.id" type="success">保存</el-button>
      <el-button @click="prepareUpdate" v-if="newRole.id && newRole.id != 0" type="warning">修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  update,
  save,
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
      let result = await commonajaxWithData("/auth/menu/tree/");
      if (result.success) {
        this.menuTree = result.dto;
        this.getRoleMenus()
      }
    },
    async prepareSave() {
      this.newRole.menus = this.getSelectNodeIds()
      let result = await save("/auth/role", this.newRole);
      if (result.success) {
        this.$emit("reloadRoles");
      }
    },
    async prepareUpdate() {
      this.newRole.menus = this.getSelectNodeIds()
      let result = await update("/auth/role", this.newRole.id, this.newRole);
      if (result.success) {
        this.$emit("reloadRoles");
      }
    },
    getSelectNodeIds() {
      let result = []
      let checkMenus = this.$refs.tree.getCheckedNodes(false, true)
      for (let index = 0; index < checkMenus.length; index++) {
        const element = checkMenus[index];
        result.push(element.id)
      }
      return result;
    },
    async getRoleMenus() {
      if (this.newRole && this.newRole.id && this.newRole.id != 0) {
        let result = await commonajaxWithData(`/auth/role-menu/menu/${this.newRole.id}`);
        if (result.success) {
          let checkKeys = this.getCanCheckKeys(result.dto)
          this.$refs.tree.setCheckedKeys(checkKeys)
        }
      }
    },
    //是否可以选中，因为不是叶节点，选中会导致其叶节点全部选中
    getCanCheckKeys(keys) {
      let canCheckKeys = []
      for (let index = 0; index < keys.length; index++) {
        const element = keys[index];
        if (this.$refs.tree.getNode(element).isLeaf) {
          canCheckKeys.push(element)
        }
      }
      return canCheckKeys;
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
    this.getMenuTree();
  },
};
</script>

<style></style>
