<template>
  <div class="buttons">
    <el-button @click="prepareSave" type="success" size="mini">添加</el-button>
  </div>
  <el-table
    :data="table"
    height="calc( 100% - 101px )"
    border
    style="width: 100%"
    :header-cell-style="{ textAlign: 'center' }"
    :cell-style="{ textAlign: 'center' }"
  >
    <el-table-column prop="id" label="id"></el-table-column>
    <el-table-column prop="name" label="问题名称"></el-table-column>
    <el-table-column prop="uid" label="上传人ID"></el-table-column>
    <!-- <el-table-column prop="problemDescribe" label="问题描述"></el-table-column> -->
    <!-- <el-table-column prop="input" label="输入"></el-table-column> -->
    <!-- <el-table-column prop="output" label="输出"></el-table-column> -->
    <el-table-column label="创建时间">
      <template #default="scope">
        {{ new Date(scope.row.createTime).toSimpleString() }}
      </template>
    </el-table-column>
    <el-table-column label="修改时间">
      <template #default="scope">
        {{ new Date(scope.row.updateTime).toSimpleString() }}
      </template>
    </el-table-column>
    <el-table-column label="状态" width="80">
      <template #default="scope">
        <el-switch
          disabled
          v-model="scope.row.status"
          active-color="#13ce66"
          inactive-color="#ccc"
        ></el-switch>
      </template>
    </el-table-column>
    <!-- <el-table-column prop="inputDescrible" label="输入描述"></el-table-column> -->
    <!-- <el-table-column prop="outputDescrible" label="输出描述"></el-table-column> -->
    <el-table-column prop="collectionId" label="所属合集"></el-table-column>
    <el-table-column label="是否与其他集合共享" width="80">
      <template #default="scope">
        <el-switch
          disabled
          v-model="scope.row.share"
          active-color="#13ce66"
          inactive-color="#ccc"
        ></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作" fixed="right" width="240">
      <template #default="scope">
        <el-button
          size="mini"
          @click="$router.push('/problemDetail/update/' + scope.row.id)"
          type="warning"
          >修改</el-button
        >
        <el-button size="mini" @click="prepareDelete(scope.row)" type="danger"
          >删除</el-button
        >
        <el-button type="info" size="mini" @click="preDataItem(scope.row.id)"
          >数据项</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="添加/修改" v-model="prepareEntity.open">
    <div class="dialog-message">
      <ProblemAddOrUpdate
        @reloadData="loadData"
        :entity="prepareEntity.entity"
      ></ProblemAddOrUpdate>
    </div>
  </el-dialog>
  <el-dialog v-model="dataItemShow" title="数据项">
    <div class="dialog-message">
      <el-button @click="prepareDataAddOrUpdate()" size="mini" type="primary"
        >新增</el-button
      >
      <div style="margin-top: 15px">
        <el-tag
          @click="prepareDataAddOrUpdate(item.id)"
          @close="deleteById(item.id)"
          style="margin-right: 10px; margin-top: 10px"
          v-for="(item, index) in dataItems"
          :key="item.id"
          :type="itemTypeGenerator(index)"
          closable
        >
          数据{{ index + 1 }}
        </el-tag>
      </div>
    </div>
  </el-dialog>
  <el-dialog
    @close="getDataItem(problemId)"
    v-model="dataAddOrUpdateShow"
    title="数据新增/修改"
  >
    <el-input
      v-model="dataItem.input"
      :rows="2"
      type="textarea"
      placeholder="输入"
    />
    <el-input
      v-model="dataItem.output"
      :rows="2"
      style="margin-top: 10px"
      type="textarea"
      placeholder="输出"
    />
    <el-button
      v-if="!dataItem.problemId"
      size="mini"
      style="margin-top: 10px"
      type="success"
      @click="dataItemAdd"
      >添加</el-button
    >
    <el-button
      v-if="dataItem.problemId"
      size="mini"
      style="margin-top: 10px"
      type="success"
      @click="dataItemUpdate"
      >修改</el-button
    >
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
  >
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
import ProblemAddOrUpdate from "@/components/backstage/problem/ProblemAddOrUpdate.vue";

export default {
  components: {
    ProblemAddOrUpdate,
  },
  data() {
    return {
      table: [],
      dataAddOrUpdateShow: false,
      dataItem: {
        input: "",
        output: "",
        problemId: 0,
      },
      problemId: 0,
      dataItemShow: false,
      dataItems: [],
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
    };
  },
  methods: {
    deleteById(id) {
      deleteById("/executor/problem-data", id).then((res) => {
        if (res.success) {
          this.getDataItem(this.problemId);
        }
      });
    },
    async prepareDataAddOrUpdate(id) {
      if (id && id > 0) {
        commonajaxWithData(
          "/executor/problem-data/" + id,
          "get",
          null,
          false
        ).then((res) => {
          if (res.success) {
            this.dataItem = res.dto;
          }
        });
      } else {
        this.dataItem = {};
      }
      this.dataAddOrUpdateShow = true;
    },
    dataItemAdd() {
      this.dataItem.problemId = this.problemId;
      commonajaxWithData(
        "/executor/problem-data",
        "post",
        this.dataItem,
        true
      ).then((res) => {
        if (res.success) {
          this.dataAddOrUpdateShow = false;
        }
      });
    },
    dataItemUpdate() {
      commonajaxWithData(
        "/executor/problem-data/" + this.dataItem.id,
        "put",
        this.dataItem,
        true
      ).then((res) => {
        if (res.success) {
          this.dataAddOrUpdateShow = false;
        }
      });
    },
    preDataItem(problemID) {
      this.dataItemShow = true;
      this.problemId = problemID;
      this.getDataItem(problemID);
    },
    itemTypeGenerator(index) {
      return this.itemTypes[index % this.itemTypes.length];
    },
    getDataItem(problemID) {
      commonajaxWithData(
        "/executor/problem-data/problem/" + problemID,
        "get",
        null,
        false
      ).then((res) => {
        this.dataItems = res.dto;
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
      let result = await deleteById("/executor/problem", entity.id);
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
        "/executor/problem/list",
        this.pageInfo.page,
        this.pageInfo.pageSize
      );
      if (result.success) {
        this.table = result.list;
        this.pageInfo.pageSize = result.pageSize;
        this.pageInfo.page = result.cuttentPage;
        this.pageInfo.total = result.total;
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