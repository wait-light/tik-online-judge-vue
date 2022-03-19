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
        <el-radio :label="1">接口</el-radio>
        <el-radio :label="2">权限归纳</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="name">
      <el-input :placeholder="`请输入${name}`" v-model="newMenu.name" clearable></el-input>
    </el-form-item>
    <el-form-item label="排序">
      <el-input-number v-model="newMenu.order" :min="0" :max="100" label="请输入排序"></el-input-number>
    </el-form-item>
    <el-form-item label="权限标识" v-if="newMenu.type == 1">
      <el-input placeholder="请输入唯一权限标识" v-model="newMenu.perms" clearable></el-input>
    </el-form-item>
    <el-form-item :label="pathName" v-if="newMenu.type != 2">
      <el-input :placeholder="`请输入${pathName}`" v-model="newMenu.url" clearable></el-input>
    </el-form-item>
    <el-form-item label="图标" v-if="newMenu.type == 0 || newMenu.type == 2">
      <el-popover
        placement="top-start"
        width="40vw"
        v-model:visible="iconBoxVisible"
        trigger="click"
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
            v-for="item in Icons"
            :key="item.name"
            style="width: 2em; height: 2em; margin-right: 8px"
            :is="Icons[item.name]"
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

<script setup>
// import * as ELIcon from "@element-plus/icons";
// import "@element-plus/icons";
import * as Icons from "@element-plus/icons-vue"
import {
  update,
  save,
  commonajaxWithData,
} from "@/js/backstage/common/common_data_operation.js";
import { ref } from "@vue/reactivity";
import { onMounted, watch } from "@vue/runtime-core";
import { computed } from "vue";
const emit = defineEmits(["updateMenus"])
const prop = defineProps({
  menu: Object
})
const newMenu = ref({
  type: 0,
  parentId: 0,
  order: 0
})
const value = ref([])
const menus = ref([])
const props = ref({
  children: "children",
  label: "name",
  value: "id",
  checkStrictly: true,
})
const iconBoxVisible = ref(false)
const currentView = ref("apple")
function handleParentChange(nodes) {
  if (nodes.length > 0) {
    console.log(newMenu.value);
    newMenu.value.parentId = nodes[nodes.length - 1]
  }
}
async function getMenus() {
  let result = await commonajaxWithData("/auth/menu/tree/");
  if (result.success) {
    let rootMenu = [
      {
        id: 0,
        name: "根目录",
        children: [],
      },
    ];
    rootMenu[0].children = processChildren(result.dto, false);
    menus.value = rootMenu;
    console.log(menus.value);
  }
}
//用于处理children为空数组的情况
function processChildren(menus, disabled) {
  for (let i = 0; i < menus.length; i++) {
    menus[i].disabled = disabled
    if (menus[i].id == newMenu.value.id) {
      menus[i].disabled = true
      menus[i].children = undefined;
      continue
    }
    if (menus[i].children && menus[i].children.length == 0) {
      menus[i].children = undefined;
    } else if (menus[i].children) {
      processChildren(menus[i].children, disabled);
    }
  }
  return menus;
}
function chooseMenuIcon(icon) {
  newMenu.value.icon = icon;
  iconBoxVisible.value = false;
}

function prepareMenu() {
  delete newMenu.value.children;
  //由于parentId应该为一个整数，但是由于cascader组件导致其变成数组
  if (newMenu.value.parentId instanceof Array) {
    newMenu.value.parentId = newMenu.value.parentId[0];
  }
}

async function prepareUpdate() {
  prepareMenu();
  let result = await update("/auth/menu", newMenu.value.id, newMenu.value);
  if (result.success) {
    emit("updateMenus");
  }
}
function prepareSave() {
  prepareMenu();
  save("/auth/menu/", newMenu.value, true).then(result => {
    if (result.success) {
      emit("updateMenus");
    }
  });
}
function iconName(name) {
  return `Icons.${name}`
}
const pathName = computed(() => {
  if (newMenu.value.type == 0) {
    return "目录路径"
  } else if (newMenu.value.type == 1) {
    return "接口路径"
  }
  return ""
})
const name = computed(() => {
  if (newMenu.value.type == 0) {
    return "目录名"
  } else if (newMenu.value.type == 1) {
    return "接口名"
  } else if (newMenu.value.type == 2) {
    return "分类名"
  }
  return ""
})
watch(() => prop.menu.id, () => {
  newMenu.value = prop.menu
  getMenus()
})
onMounted(() => {
  getMenus()
  newMenu.value = prop.menu
})
</script>
<style lang="sass" scoped>

</style>
