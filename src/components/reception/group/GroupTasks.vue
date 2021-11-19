<template>
  <div class="demo-collapse">
    <el-collapse v-model="activeName">
      <el-collapse-item title="进行中" name="1">
        <div v-if="tasking && tasking.length > 0">
          <router-link
            :to="`/group/${$route.params.groupId}/task/${item.id}`"
            v-for="item in tasking"
            :key="item.id"
          >
            <div class="task-item">
              <span class="cicle">任务</span>
              <!-- <el-image
              style="width: 50px; height: 50px"
              src="https://w.wallhaven.cc/full/k7/wallhaven-k7lpe6.png"
              fit="cover"
            ></el-image> -->
              <p>{{ item.name }}</p>
              <div>
                <span class="task-item-time">
                  开始时间：{{ item.endTime.toLocaleString() }}
                </span>
                <br />
                <span class="task-item-time">
                  结束时间：{{ item.endTime.toLocaleString() }}
                </span>
              </div>
            </div>
          </router-link>
        </div>
         <el-empty v-else description="什么任务也没有"></el-empty>
      </el-collapse-item>
      <el-collapse-item title="未开始" name="3">
        <div v-if="notStart && notStart.length > 0">
          <router-link
            :to="`/group/${$route.params.groupId}/task/${item.id}`"
            v-for="item in notStart"
            :key="item.id"
          >
            <div class="task-item">
              <span class="cicle">任务</span>
              <!-- <el-image
              style="width: 50px; height: 50px"
              src="https://w.wallhaven.cc/full/k7/wallhaven-k7lpe6.png"
              fit="cover"
            ></el-image> -->
              <p>{{ item.name }}</p>
              <div>
                <span class="task-item-time">
                  开始时间：{{ item.endTime.toLocaleString() }}
                </span>
                <br />
                <span class="task-item-time">
                  结束时间：{{ item.endTime.toLocaleString() }}
                </span>
              </div>
            </div>
          </router-link>
        </div>
        <el-empty v-else description="什么任务也没有"></el-empty>
      </el-collapse-item>
      <el-collapse-item title="已过期" name="2">
        <div v-if="expiredTask && expiredTask.length > 0">
          <router-link
            :to="`/group/${$route.params.groupId}/task/${item.id}`"
            v-for="item in expiredTask"
            :key="item.id"
          >
            <div class="task-item">
              <span class="cicle">任务</span>
              <!-- <el-image
              style="width: 50px; height: 50px"
              src="https://w.wallhaven.cc/full/k7/wallhaven-k7lpe6.png"
              fit="cover"
            ></el-image> -->
              <p>{{ item.name }}</p>
              <div>
                <span class="task-item-time">
                  开始时间：{{ new Date(item.endTime).toLocaleString() }}
                </span>
                <br />
                <span class="task-item-time">
                  结束时间：{{ item.endTime.toLocaleString() }}
                </span>
              </div>
            </div>
          </router-link>
        </div>
        <el-empty v-else description="什么任务也没有"></el-empty>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { getData } from "@/js/common_data_operation";
export default {
  data() {
    return {
      activeName: "1",
      expiredTask: [],
      notStart: [],
      tasking: [],
    };
  },
  methods: {
    loadData() {
      getData(`/social/task/group/${this.$route.params.groupId}/tasks`).then(
        (res) => {
          if (res.success) {
            let now = new Date();
            for (let index = 0; index < res.dto.length; index++) {
              const element = res.dto[index];
              element.endTime = new Date(element.endTime);
              element.beginTime = new Date(element.beginTime);
              if (element.endTime < now) {
                this.expiredTask.push(element);
              } else if (element.beginTime <= now <= element.endTime) {
                this.tasking.push(element);
              } else if (this.beginTime < now) {
                this.notStart.push(element);
              }
            }
          }
        }
      );
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>
<style lang="sass" scoped>
@import "@/sass/_variables"
a
  text-decoration-line: none
.task-item
  border-radius: $small-radius
  box-sizing: border-box
  display: flex
  padding: 15px 20px
  width: 100%
  height: 80px
  justify-content: space-between
  text-decoration-line: none
  border-bottom: 1px solid var(--el-border-color-base)
  &:hover
    background: $auxiliary-color
    cursor: pointer
  p
    font-size: 1.45em
    color: $minor-color
    line-height: 50px
    padding: 0
    margin: 0
.cicle
  display: inline-block
  text-align: center
  background: var(--el-border-color-base)
  line-height: 50px
  color: black
  height: 50px
  width: 50px
  border-radius: 100%
.task-item-time
  font-size: 12px
  color: $secondary-color
  align-self: center
</style>
