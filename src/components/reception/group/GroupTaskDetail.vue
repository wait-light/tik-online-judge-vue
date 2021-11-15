<template>
  <el-card class="task-describe">
    <h1>形势与政策2021年秋天</h1>
    <el-divider></el-divider>
    <div class="avatar-container">
      <el-avatar size="medium"></el-avatar>
      <span>某某老师</span>
    </div>
    <span class="time">{{ new Date().toLocaleString() }}</span>
    <div>
      <p style="word-wrap: break-word">
        今天下午在规定时间内完成考试，一定要提交试卷，没提交试卷就没有成绩！考试只能选用一种工具：要么用电脑要么用手机，否则造成考试数据丟失后果自负。相互转告！
      </p>
    </div>
  </el-card>
  <el-card class="task-detail">
    <router-link
      class="task-item"
      v-for="item in 10"
      :key="item"
      to="/problem/1"
    >
      <cicle-success v-if="item % 2"></cicle-success>
      <cicle-wrong v-else></cicle-wrong>
      <!-- <el-avatar
        src="https://mooc2-ans.chaoxing.com/images/courselist/icon_yiwanc.png"
        size="small"
      ></el-avatar> -->
      <p>{{ item * 411 + "" + item + item + item }}</p>
    </router-link>
  </el-card>
</template>

<script>
import CicleSuccess from "@/components/common/CicleSuccess.vue";
import CicleWrong from "@/components/common/CicleWrong.vue";
export default {
  components: {
    CicleSuccess,
    CicleWrong,
  },
};
</script>

<style lang="sass" scoped>
@import "@/sass/_variables"
.task-describe
  h1
    font-size: 18px
.task-detail
  margin-top: 20px
.avatar-container
  width: 200px
  display: inline-block
  // height: 36px
  span
    margin-left: 10px
    font-size: 12px
    vertical-align: middle
.time
  color: $secondary-color
  font-size: 10px
.task-item
  padding: 10px
  border-radius: $large-radius
  border-bottom: 1px solid var(--el-border-color-base)
  display: flex
  p
    margin: 0 0 0 20px
    text-align: center
    line-height: 28px
    color: $minor-color
  &:hover
    background: $auxiliary-color
    cursor: pointer
  // display: flex
  // justify-content: space-between
</style>