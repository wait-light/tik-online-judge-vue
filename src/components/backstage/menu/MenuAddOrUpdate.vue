<template>
  <el-form v-model="menu" label-position="right" label-width="80px">
    <el-form-item label="上级菜单">
      <!-- <Edit  /> -->
      <el-cascader
        @change="handleParentChange"
        v-model="newMenu.parentId"
        placeholder="选择上级菜单"
        :options="menus"
        :props="props"
      ></el-cascader>
    </el-form-item>
    <el-form-item label="类型">
      <el-radio-group v-model="newMenu.type">
        <el-radio :label="0">目录</el-radio>
        <el-radio :label="1">菜单</el-radio>
        <el-radio :label="2">按钮</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="名称">
      <el-input placeholder="请输入名称" v-model="newMenu.name" clearable></el-input>
    </el-form-item>
    <el-form-item label="排序">
      <el-input-number v-model="newMenu.order" :min="1" :max="100" label="请输入排序"></el-input-number>
    </el-form-item>
    <el-form-item label="权限标识">
      <el-input placeholder="请输入权限标识" v-model="newMenu.perms" clearable></el-input>
    </el-form-item>
    <el-form-item label="路由地址" v-if="newMenu.type != 2">
      <el-input placeholder="请输入路由地址" v-model="newMenu.url" clearable></el-input>
    </el-form-item>
    <el-form-item label="图标" v-if="newMenu.type != 2">
      <el-popover
        placement="top-start"
        width="40vw"
        v-model:visible="iconBoxVisible"
        trigger="click"
        value
        title="图标"
      >
        <template #reference>
          <el-input placeholder="请选择图标" v-model="newMenu.icon" clearable>
            <template #prefix>
              <component
                v-if="newMenu.icon"
                style="width: 1.5em; height: 1.5em; margin-right: 8px; margin-top: 8px"
                :is="newMenu.icon"
              ></component>
            </template>
          </el-input>
        </template>
        <div style="overflow: auto; height: 200px">
          <component
            @click="chooseMenuIcon(item.name)"
            v-for="item in $options.components"
            :key="item.name"
            style="width: 2em; height: 2em; margin-right: 8px"
            :is="item.name"
          ></component>
        </div>
      </el-popover>
    </el-form-item>
    <el-form-item>
      <el-button @click="prepareSave" v-if="!newMenu.id || newMenu.id == 0" type="success">保存</el-button>
      <el-button @click="prepareUpdate" v-if="newMenu.id && newMenu.id != 0" type="success">修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import * as ELIcon from "@element-plus/icons";
import {
  getOne,
  update,
  save,
  deleteById,
  commonajaxWithData,
} from "@/js/backstage/common/common_data_operation.js";
const out = {
  components: ELIcon,
  props: {
    menu: Object,
  },
  data() {
    return {
      newMenu: {
        type: 0,
        parentId: 0
      },
      value: [],
      menus: [],
      props: {
        children: "children",
        label: "name",
        checkStrictly: true,
      },
      iconBoxVisible: false,
      currentView: "apple",
    };
  },
  watch: {
    menu(newValue, oldValue) {
      this.newMenu = newValue;
    },
  },
  async mounted() {
    this.getMenus();
    this.newMenu = this.menu;
  },
  methods: {
    handleParentChange(nodes) {
      this.newMenu.parentId = nodes[nodes.length - 1]
    },
    async getMenus() {
      let result = await commonajaxWithData("/auth/menu/tree/");
      if (result.success) {
        let rootMenu = [
          {
            id: 0,
            name: "根目录",
            children: [],
          },
        ];
        rootMenu[0].children = this.processChildren(result.dto);
        this.menus = rootMenu;
      }
    },
    //用于处理children为空数组的情况
    processChildren(menus) {
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].children && menus[i].children.length == 0) {
          menus[i].children = undefined;
        } else if (menus[i].children) {
          this.processChildren(menus[i].children);
        }
      }
      return menus;
    },
    chooseMenuIcon(icon) {
      this.newMenu.icon = icon;
      this.iconBoxVisible = false;
    },
    prepareMenu() {
      delete this.newMenu.children;
      //由于parentId应该为一个整数，但是由于cascader组件导致其变成数组
      if (this.newMenu.parentId instanceof Array) {
        this.newMenu.parentId = this.newMenu.parentId[0];
      }
    },
    async prepareUpdate() {
      this.prepareMenu();
      console.log(this.newMenu);
      console.log();
      let result = await update("/auth/menu", this.newMenu.id, this.newMenu);
      if (result.success) {
        this.$emit("updateMenus");
      }
    },
    async prepareSave() {
      this.prepareMenu();

      let result = await save("/auth/menu/", this.newMenu, true);
      if (result.success) {
        this.$emit("updateMenus");
      }
    },
  },
};
export default out;
</script>

<style></style>
