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
    <el-table-column prop="id" label></el-table-column>
    <el-table-column prop="name" label="名称"></el-table-column>
    <el-table-column label="创建时间">
      <template #default="scope">{{ new Date(scope.row.createTime).toSimpleString() }}</template>
    </el-table-column>
    <el-table-column label="更新时间">
      <template #default="scope">{{ new Date(scope.row.updateTime).toSimpleString() }}</template>
    </el-table-column>
    <el-table-column label="是否启用" width="80">
      <template #default="scope">
        <el-switch disabled v-model="scope.row.status" active-color="#13ce66" inactive-color="#ccc"></el-switch>
      </template>
    </el-table-column>
    <el-table-column prop="createUserId" label="创建人"></el-table-column>
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
      <template #default="scope">{{ new Date(scope.row.beginTime).toLocaleString() }}</template>
    </el-table-column>
    <el-table-column label="结束时间" width="155">
      <template #default="scope">{{ new Date(scope.row.endTime).toLocaleString() }}</template>
    </el-table-column>
    <el-table-column label="操作" fixed="right" width="250">
      <template #default="scope">
        <el-button size="mini" @click="prepareUpdate(scope.row)" type="warning">修改</el-button>
        <el-button size="mini" @click="prepareDelete(scope.row)" type="danger">删除</el-button>
        <!-- @click="$router.push(`/problemDetail/${scope.row.id}`)" -->
        <el-button size="mini" @click="prepareLoadCollectionItem(scope.row.id)" type="info">问题项</el-button>
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
      <el-button
        @click="$router.push(`/problemDetail/${collectionId}`)"
        size="mini"
        type="primary"
      >新增</el-button>
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
export default {
  components: {
    ProblemCollectionAddOrUpdate,
  },
  data() {
    return {
      collectionItemShow: false,
      itemloading: false,
      collectionItem: [],
      collectionId: 0,
      table: [],
      pageInfo: {
        pageSize: 10,
        page: 1,
        total: 0,
        pageSizes: [10, 20, 30, 50, 100],
      },
      prepareEntity: {
        entity: {},
        open: false,
      },
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
    };
  },
  methods: {
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
    async loadData() {
      this.prepareEntity.open = false;
      let result = await getList(
        "/executor/problem-collection/list",
        this.pageInfo.page,
        this.pageInfo.pageSize
      );
      if (result.success) {
        this.table = result.list
        this.pageInfo.page = result.currentPage;
        this.pageInfo.total = result.total
        console.log(result);
      }
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style lang="sass" scoped>
.buttons
  margin: 10px 5px 25px
.dialog-message
  overflow: auto
  height: 55vh
</style>