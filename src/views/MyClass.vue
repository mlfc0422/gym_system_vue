<script setup lang="ts">

// 定义行数据的接口
import {onMounted, ref} from "vue";
import axios from "axios";

interface Course {
  courseId: number;
  courseName: string;
  teacherName: string;
  week: string;
  time: string;
  classroom: string;
  booked: number;
  total: number;
  teacherId: number;
}

const myCourseList = ref<Course[]>([]);

onMounted(() => {
  getMyCourseList(); // 组件挂载时获取课程列表数据
});

function getMyCourseList() {
  axios.get('course/myCourse')
      .then(res => {
        myCourseList.value = res.data.data;
      })
      .catch(err => {
        console.log(err);
      });
}
</script>

<template>
  <div id="myCourse">
    <el-table :data="myCourseList" height="100%" style="width: 100%">
      <el-table-column prop="courseName" label="课程名称" width="260"/>
      <el-table-column prop="teacherName" label="教师姓名" width="260"/>
      <el-table-column prop="week" label="日期" width="260"/>
      <el-table-column prop="time" label="时间" width="260"/>
      <el-table-column prop="classroom" label="教室" width="260"/>
    </el-table>

    <el-calendar/>
  </div>
</template>

<style scoped>

</style>