<template>
  <div class="menus">
    <el-row class="search" v-if="isShowableInterface('executor:problem-collection:view')">
      <el-col :xs="24" :sm="8">
        <el-input @keypress.enter="loadData" v-model="search" placeholder="请输入问题集名">
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
    <el-button
      @click="prepareSave"
      type="success"
      size="mini"
      v-if="isShowableInterface('executor:problem-collection:add')"
    >添加</el-button>
  </div>
  <el-table
    :data="table"
    height="calc( 100% - 101px )"
    style="width: 100%"
    :header-cell-style="{ textAlign: 'center' }"
    :cell-style="{ textAlign: 'center' }"
  >
    <!-- <el-table-column prop="id" label></el-table-column> -->
    <el-table-column prop="name" label="名称">
      <template #default="scope">
        <span style="font-size:12px;">{{ scope.row.name }}</span>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" width="100">
      <template #default="scope">
        <span style="font-size:12px;">{{ new Date(scope.row.createTime).toSimpleString() }}</span>
      </template>
    </el-table-column>
    <el-table-column label="更新时间" width="100">
      <template #default="scope">
        <span style="font-size:12px;">{{ new Date(scope.row.updateTime).toSimpleString() }}</span>
      </template>
    </el-table-column>
    <el-table-column label="是否启用" width="80">
      <template #default="scope">
        <el-switch disabled v-model="scope.row.status" active-color="#13ce66" inactive-color="#ccc"></el-switch>
      </template>
    </el-table-column>
    <!-- <el-table-column prop="createUserId" label="创建人"></el-table-column> -->
    <el-table-column label="是否公开集" width="80">
      <template #default="scope">
        <el-switch
          disabled
          v-model="scope.row.publicCollection"
          active-color="#13ce66"
          inactive-color="#ccc"
        ></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="开启时间" width="155">
      <template #default="scope">
        <span style="font-size:12px;">{{ new Date(scope.row.beginTime).toLocaleString() }}</span>
      </template>
    </el-table-column>
    <el-table-column label="结束时间" width="155">
      <template #default="scope">
        <span style="font-size:12px;">{{ new Date(scope.row.endTime).toLocaleString() }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" fixed="right" width="250">
      <template #default="scope">
        <el-button
          size="mini"
          @click="prepareUpdate(scope.row)"
          type="warning"
          v-if="isShowableInterface('executor:problem-collection:update')"
        >修改</el-button>
        <el-button
          size="mini"
          @click="prepareDelete(scope.row)"
          type="danger"
          v-if="isShowableInterface('executor:problem-collection:delete')"
        >删除</el-button>
        <el-button
          size="mini"
          @click="prepareLoadCollectionItem(scope.row.id)"
          type="info"
          v-if="isShowableInterface('executor:problem-collection:itemAdd')"
        >问题项</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="添加/修改" v-model="prepareEntity.open">
    <div class="dialog-message">
      <ProblemCollectionAddOrUpdate @reloadData="loadData" :entity="prepareEntity.entity"></ProblemCollectionAddOrUpdate>
    </div>
  </el-dialog>
  <el-dialog v-model="collectionItemShow" title="问题项">
    <div class="dialog-message">
      <el-button @click="prepareProblemAdd()" size="mini" type="primary">新增</el-button>
      <el-button size="mini" type="success" @click="availableProblem">添加</el-button>
      <div style="margin-top: 15px" v-loading="itemloading">
        <el-tag
          style="margin-right: 10px; margin-top: 10px"
          v-for="(item, index) in collectionItem"
          :key="item.id"
          @close="deleteItem(item.id)"
          :type="itemTypeGenerator(index)"
          closable
        >{{ item.name }}</el-tag>
      </div>
    </div>
  </el-dialog>
  <el-dialog v-model="collectionItemAvailable.show" @close="loadCollectionItem(collectionId)">
    <el-table
      :data="collectionItemAvailable.list"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
    >
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column label="操作" fixed="right" width="250">
        <template #default="scope">
          <el-button size="mini" @click="addItem(scope.row.id)" type="warning">添加</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :hide-on-single-page="hideOnSinglePage"
      @size-change="availableProblem"
      @current-change="availableProblem"
      :current-page="collectionItemAvailable.page"
      :page-sizes="collectionItemAvailable.pageSizes"
      :page-size="collectionItemAvailable.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="collectionItemAvailable.total"
    ></el-pagination>
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

  <el-dialog title="添加/修改" v-model="problemAddDialog" :fullscreen="true">
    <div style="height: calc( 100vh - 200px );">
      <ProblemEdit @addProblem="addProblem" @updateProblem="updateProblem"></ProblemEdit>
    </div>
  </el-dialog>
</template>

<script>
import {
  getOne,
  update,
  getList,
  deleteById,
  commonajaxWithData,
} from "@/js/backstage/common/common_data_operation.js";
import ProblemCollectionAddOrUpdate from "@/components/backstage/problemcollection/ProblemCollectionAddOrUpdate.vue";
import { ElMessageBox } from "element-plus";
import { Search } from '@element-plus/icons'
import { getData, postData, putData } from '@/js/common_data_operation';
import ProblemEdit from "@/components/common/ProblemEdit.vue";
import { useStore } from 'vuex';
import { computed, reactive, ref } from '@vue/reactivity';
import { onMounted, watch } from '@vue/runtime-core';
export default {
  components: {
    ProblemCollectionAddOrUpdate, Search, ProblemEdit
  },
  data() {
    return {
      collectionItemShow: false,
      itemloading: false,
      collectionItem: [],
      collectionId: 0,

      hideOnSinglePage: true,
      itemTypes: ["primary", "success", "info", "warning", "danger"],
      collectionItemAvailable: {
        list: [],
        page: 1,
        pageSize: 10,
        total: 0,
        hasNext: false,
        show: false,
        pageSizes: [10, 20, 30, 50, 100],
      },
      problemAddDialog: false
    };
  },
  methods: {
    addProblem(problem, clearProlem) {
      postData(
        `/executor/problem-collection/problem/${this.collectionId}`,
        problem
      ).then((result) => {
        if (result.success) {
          this.problemAddDialog = false
          this.loadCollectionItem(this.collectionId)
          clearProlem()
        }
      });
    },
    updateProblem(problem) {
      putData(
        `/executor/problem/${this.collectionId}`,
        problem
      ).then((result) => {
        if (result.success) {
          this.problemAddDialog = false
          this.loadCollectionItem(this.collectionId)
          clearProlem()
        }
      });
    },
    addItem(problemId) {
      commonajaxWithData(
        `/executor/problem-collection-item/${this.collectionId}/${problemId}`,
        "post",
        null,
        true
      ).then((res) => {
        if (res.success) {
          this.availableProblem();
        }
      });
    },
    deleteItem(problemId) {
      ElMessageBox.confirm("将此问题移该合集, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          commonajaxWithData(
            `/executor/problem-collection-item/${this.collectionId}/${problemId}`,
            "delete",
            null,
            true
          ).then((res) => {
            if (res.success) {
              this.loadCollectionItem(this.collectionId);
            }
          });
        })
        .catch(() => {
          return {
            code: 500,
            msg: "删除取消",
          };
        });
    },
    availableProblem() {
      this.collectionItemAvailable.show = true;
      getList(`/executor/problem/availableProblem/${this.collectionId}`).then(
        (result) => {
          if (result.success) {
            this.collectionItemAvailable.list = result.list;
            this.collectionItemAvailable.page = result.currentPage;
            this.collectionItemAvailable.total = result.total;
          }
        }
      );
    },
    itemTypeGenerator(index) {
      return this.itemTypes[index % this.itemTypes.length];
    },
    prepareLoadCollectionItem(collectionId) {
      this.collectionId = collectionId;
      this.collectionItemShow = true;
      this.loadCollectionItem(collectionId);
    },
    loadCollectionItem(collectionId) {
      this.itemloading = true;
      getOne("/executor/problem-collection/all/" + collectionId)
        .then((res) => {
          if (res.success) {
            this.collectionItem = res.dto;
          }
          this.itemloading = false;
        })
        .catch((err) => {
          this.itemloading = false;
        });
    },
    prepareProblemAdd() {
      this.problemAddDialog = true
    },
    prepareSave() {
      this.prepareEntity.entity = {};
      this.prepareEntity.open = true;
    },
    prepareUpdate(entity) {
      this.prepareEntity.entity = entity;
      this.prepareEntity.open = true;
    },
    async prepareDelete(entity) {
      let result = await deleteById("/executor/problem-collection", entity.id);
      if (result.success) {
        this.loadData();
      }
    },
    async pageChange(page) {
      this.pageInfo.page = page;
      this.loadData();
    },
    async pageSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.loadData();
    },
  },
  setup() {
    const store = useStore()
    const prepareEntity = reactive({
      entity: {},
      open: false,
    })
    const pageInfo = reactive({
      pageSize: 10,
      page: 1,
      total: 0,
      pageSizes: [10, 20, 30, 50, 100],
    })
    const table = ref([])
    const search = ref("")
    const isShowableInterface = computed(() => {
      return store.getters["auth/isShowableInterface"]
    })
    const needLoad = ref(true)
    watch(() => {
      return isShowableInterface.value("executor:problem-collection:view")
    }, (viewAble) => {
      if (viewAble) {
        needLoad.value = false
        loadData()
      }
    })
    const loadData = async () => {
      prepareEntity.open = false;
      let result = await getList(
        `/executor/problem-collection/list?search=${search.value}`,
        pageInfo.page,
        pageInfo.pageSize
      );
      if (result.success) {
        table.value = result.list
        pageInfo.page = result.currentPage;
        pageInfo.total = result.total
      }
    }
    onMounted(() => {
      if (needLoad.value) {
        loadData()
      }
    })
    return {
      prepareEntity, pageInfo, table, search, isShowableInterface, loadData
    }
  }
};
</script>

<style lang="sass" scoped>

.menus
  margin: 10px 5px 25px
  display: flex
  .search
    width: 100%
.buttons
  margin: 10px 5px 25px
.dialog-message
  overflow: auto
  height: 55vh
</style>