<template>
  <div class="buttons">
    <el-button @click="addMenu" type="success" size="mini" v-if="isShowableInterface(`auth:menu:add`)">添加</el-button>
  </div>
  <el-table
    border
    :data="menus"
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    :header-cell-style="{ textAlign: 'center' }"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <el-table-column prop="name" label="菜单名称" sortable width="200"></el-table-column>
    <el-table-column prop="icon" label="图标" sortable width="50" #default="scope">
      <component v-if="scope.row.icon" :is="scope.row.icon" style="width:2em;"></component>
    </el-table-column>
    <el-table-column prop="perms" label="权限标识"></el-table-column>
    <el-table-column prop="url" label="地址"></el-table-column>
    <el-table-column prop="requestMethod" label="请求方法"></el-table-column>
    <el-table-column prop="order" label="排序"></el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="mini" @click="prepareEditMenu(scope.row)" type="warning" v-if="isShowableInterface(`auth:menu:update`)">修改</el-button>
        <el-button size="mini" @click="deleteMenu(scope.row.id)" type="danger" v-if="isShowableInterface(`auth:menu:delete`)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog title="权限" v-model="prepareMenu.open">
    <div class="dialog-message">
      <menu-add-or-add-update @updateMenus="reloadDate" :menu="prepareMenu.menu"></menu-add-or-add-update>
    </div>
  </el-dialog>
</template>

<script>
import MenuAddOrAddUpdate from "@/components/backstage/menu/MenuAddOrUpdate.vue";
import * as Icons from "@element-plus/icons-vue"
import { mapGetters, useStore } from "vuex"
let components = Object.assign({}, Icons, { MenuAddOrAddUpdate: MenuAddOrAddUpdate })
import {
  deleteById,
  commonajaxWithData,
} from "@/js/backstage/common/common_data_operation.js";
import { watch } from '@vue/runtime-core';
import { ref } from "vue";
export default {
  components: components,
  data() {
    return {
      prepareMenu: {
        open: false,
        menu: {
          id: 0,
          name: "加载中",
          perms: "loading:loading:loading",
          type: 1,
          url: "/loading",
          icon: "",
          order: 0,
          parentId: 0,
          children: [],
        },
      },
    };
  },
  setup() {
    const store = useStore()
    const menus = ref([
      {
        id: 0,
        name: "加载中",
        perms: "loading:loading:loading",
        type: 1,
        url: "/loading",
        icon: "",
        order: 0,
        parentId: 0,
        children: [],
      },
    ])
    const getMenu = async () => {
      let result = await commonajaxWithData("/auth/menu/tree/");
      if (result.success) {
        menus.value = result.dto;
      }
    }
    watch(() => {
      return store.getters["auth/isShowableInterface"]("auth:menu:view")
    }, (view) => {
      if (view) {
        getMenu()
      }
    })
    return {
      getMenu, menus
    }
  },
  async mounted() {
    this.getMenu();
  },
  computed: {
    ...mapGetters("auth", ['isShowableInterface'])
  },
  methods: {
    addMenu() {
      this.prepareMenu.menu = {};
      this.prepareMenu.open = true;
    },
    prepareEditMenu(menu) {
      this.prepareMenu.menu = menu;
      this.prepareMenu.open = true;
    },
    async deleteMenu(id) {
      let result = await deleteById("/auth/menu", id);
      if (result.success) {
        this.reloadDate();
      }
    },
    reloadDate() {
      this.getMenu();
      this.prepareMenu.open = false;
    },
    deleteById,
  },
};
</script>

<style lang="sass" scoped>

.dialog-message
  overflow: auto
  height: 55vh
.buttons
  margin: 10px 5px 25px
</style>
