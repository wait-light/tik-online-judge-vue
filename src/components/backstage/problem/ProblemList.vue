<template>
  <div class="menus">
    <el-row class="search" v-if="isShowableInterface('executor:problem:view')">
      <el-col :xs="24" :sm="8">
        <el-input @keypress.enter="loadData" v-model="search" placeholder="请输入问题名">
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
    <el-button v-if="isShowableInterface('executor:problem:add')" @click="prepareSave" type="success" size="mini">添加
    </el-button>
  </div>
  <el-table :data="table" height="calc( 100% - 101px )" style="width: 100%" :header-cell-style="{ textAlign: 'center' }"
    :cell-style="{ textAlign: 'center' }">
    <!-- <el-table-column prop="id" label="id"></el-table-column> -->
    <el-table-column prop="name" label="问题名称"></el-table-column>
    <el-table-column prop="uid" label="上传人ID"></el-table-column>
    <!-- <el-table-column prop="problemDescribe" label="问题描述"></el-table-column> -->
    <!-- <el-table-column prop="input" label="输入"></el-table-column> -->
    <!-- <el-table-column prop="output" label="输出"></el-table-column> -->
    <el-table-column label="创建时间" width="100">
      <template #default="scope">
        <span style="font-size:12px;">{{ new Date(scope.row.createTime).toSimpleString() }}</span>
      </template>
    </el-table-column>
    <el-table-column label="修改时间" width="100">
      <template #default="scope">
        <span style="font-size:12px;">{{ new Date(scope.row.updateTime).toSimpleString() }}</span>
      </template>
    </el-table-column>
    <el-table-column label="状态" width="80">
      <template #default="scope">
        <el-switch disabled v-model="scope.row.status" active-color="#13ce66" inactive-color="#ccc"></el-switch>
      </template>
    </el-table-column>
    <!-- <el-table-column prop="inputDescrible" label="输入描述"></el-table-column> -->
    <!-- <el-table-column prop="outputDescrible" label="输出描述"></el-table-column> -->
    <el-table-column prop="collectionId" label="所属合集"></el-table-column>
    <el-table-column label="是否与其他集合共享" width="80">
      <template #default="scope">
        <el-switch disabled v-model="scope.row.share" active-color="#13ce66" inactive-color="#ccc"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作" fixed="right" width="240">
      <template #default="scope">
        <el-button size="mini" @click="prepareUpdate(scope.row)" type="warning"
          v-if="isShowableInterface('executor:problem:update')">修改</el-button>
        <el-button size="mini" @click="prepareDelete(scope.row)" type="danger"
          v-if="isShowableInterface('executor:problem:delete')">删除</el-button>
        <el-button type="info" size="mini" @click="preDataItem(scope.row.id)"
          v-if="isShowableInterface('executor:problem:dateItemAdd')">数据项</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="添加/修改" v-model="prepareEntity.open" :fullscreen="true">
    <div style="height: calc( 100vh - 200px );">
      <ProblemEdit @add-problem="addProblem" @update-problem="updateProblem" :problemId="prepareEntity.entity.id"
        :secretKey="prepareEntity.entity.secretKey"></ProblemEdit>
    </div>
  </el-dialog>
  <el-dialog v-model="dataItemShow" title="数据项">
    <div class="dialog-message">
      <el-button @click="prepareDataAddOrUpdate()" size="mini" type="primary">新增</el-button>
      <div style="margin-top: 15px">
        <el-tag class="tag-clickable" @click="prepareDataAddOrUpdate(item.id)" @close="deleteById(item.id)"
          style="margin-right: 10px; margin-top: 10px" v-for="(item, index) in dataItems" :key="item.id"
          :type="itemTypeGenerator(index)" closable>数据{{ index + 1 }}</el-tag>
      </div>
    </div>
  </el-dialog>
  <el-dialog @close="getDataItem(problemId)" v-model="dataAddOrUpdateShow" title="数据新增/修改">
    <el-form>
      <el-form-item label="输入">
        <el-input v-model="dataItem.input" :rows="2" type="textarea" placeholder="输入" />
      </el-form-item>
      <el-form-item label="输出">
        <el-input v-model="dataItem.output" :rows="2" style="margin-top: 10px" type="textarea" placeholder="输出" />
      </el-form-item>
      <el-form-item label="分数">
        <el-input v-model="dataItem.scope" style="margin-top: 10px" type="number" min="1" max="100" placeholder="分数" />
      </el-form-item>
      <el-form-item label="时间限制(ms)">
        <el-input v-model="dataItem.timeLimit" style="margin-top: 10px" type="number" min="1" max="60000"
          placeholder="时间限制(ms)" />
      </el-form-item>
      <el-form-item label="内存限制(kb)">
        <el-input v-model="dataItem.memoryLimit" style="margin-top: 10px" type="number" min="1" max="131072"
          placeholder="内存限制(kb)" />
      </el-form-item>
    </el-form>





    <el-button v-if="!dataItem.problemId" size="mini" style="margin-top: 10px" type="success" @click="dataItemAdd">添加
    </el-button>
    <el-button v-if="dataItem.problemId" size="mini" style="margin-top: 10px" type="success" @click="dataItemUpdate">修改
    </el-button>
  </el-dialog>
  <el-pagination :hide-on-single-page="hideOnSinglePage" @size-change="pageSizeChange" @current-change="pageChange"
    :current-page="pageInfo.page" :page-sizes="pageInfo.pageSizes" :page-size="pageInfo.pageSize"
    layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total"></el-pagination>
</template>

<script>
import {
  getOne,
  update,
  getList,
  deleteById,
  commonajaxWithData,
} from "@/js/backstage/common/common_data_operation.js";
import ProblemEdit from "@/components/common/ProblemEdit.vue";
import { Search } from '@element-plus/icons'
import { postData, putData } from '@/js/common_data_operation';
import { useStore } from 'vuex';
import { computed, reactive, ref } from '@vue/reactivity';
export default {
  components: {
    ProblemEdit, Search
  },
  data() {
    return {
      dataAddOrUpdateShow: false,
      dataItem: {
        input: "",
        output: "",
        problemId: 0,
      },
      problemId: 0,
      dataItemShow: false,
      dataItems: [],
      hideOnSinglePage: true,
      itemTypes: ["primary", "success", "info", "warning", "danger"],
    };
  },
  methods: {
    addProblem(problem, clearProlem) {
      postData(`/executor/problem`, problem, true).then(res => {
        if (res.success) {
          this.loadData()
          this.prepareEntity.open = false
          clearProlem()
        }
      })
    },
    updateProblem(problem) {
      putData(`/executor/problem/${problem.id}`, problem, true).then(res => {
        if (res.success) {
          this.loadData()
          this.prepareEntity.open = false
          clearProlem()
        }
      })
    },
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
    opened() {
      this.$refs["editer"].clearProlem()
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
  },
  mounted() {
    this.loadData();
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
    }, (viewAble) => {
      if (viewAble) {
        loadData()
      }
    })
    const loadData = async () => {
      prepareEntity.open = false;
      let result = await getList(
        `/executor/problem/list?search=${search.value}`,
        pageInfo.page,
        pageInfo.pageSize
      );
      if (result.success) {
        table.value = result.list
        pageInfo.page = result.cuttentPage;
        pageInfo.total = result.total;
      }
    }
    return {
      isShowableInterface, loadData, prepareEntity, pageInfo, table, search
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
.tag-clickable
  &:hover
    cursor: pointer
</style>