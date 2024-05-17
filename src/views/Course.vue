<script setup lang="ts">

import {onMounted, ref} from "vue";
import axios from "axios";

// 定义行数据的接口
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

const courseList = ref<Course[]>([]);
const keyword = ref();
const filteredCourseList = ref<Course[]>([]);

onMounted(() => {
  getCourseList(); // 组件挂载时获取课程列表数据
});

function getCourseList() {
  axios.get('course/list')
      .then(res => {
        courseList.value = res.data.data;
        filteredCourseList.value = res.data.data;
      })
      .catch(err => {
        console.log(err);
      });
}

// 为 handleReservation 函数添加类型注解
function handleReservation(row: Course) {
  axios.put('course/reserve', row)
      .then(res => {
        if (res.data.code === 1) {
          alert('预约成功');
          const index = courseList.value.findIndex(course => course.courseId === row.courseId);
          if (index !== -1) {
            courseList.value[index].booked++;
            filteredCourseList.value[index].booked++;
          }
        } else {
          alert('预约失败:'+res.data.msg);
        }
      })
      .catch(err => {
        console.log(err);
      });
}

function handleSearch() {
  // 过滤课程列表
  filteredCourseList.value = courseList.value.filter((course) => {
    console.log("key的值"+keyword.value);
    return course.courseName.includes(keyword.value) || course.teacherName.includes(keyword.value)|| course.week.includes(keyword.value) || course.time.includes(keyword.value);
  });
}
</script>

<template>
  <div id="course">
    <el-input v-model="keyword" @input="handleSearch" placeholder="输入关键字搜索课程" clearable></el-input>
    <el-table :data="filteredCourseList" height="100%" style="width: 100%">
      <el-table-column prop="courseName" label="课程名称" width="180"/>
      <el-table-column prop="teacherName" label="教师姓名" width="180"/>
      <el-table-column prop="week" label="日期" width="180"/>
      <el-table-column prop="time" label="时间" width="180"/>
      <el-table-column prop="classroom" label="教室" width="180"/>
      <el-table-column prop="booked" label="已预订人数" width="180"/>
      <el-table-column prop="total" label="总人数" width="100"/>
      <el-table-column label="操作" width="100">
        <!-- 在这里添加预约按钮 -->
        <template v-slot="{ row }">
          <el-button type="primary" @click="handleReservation(row)">预约</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
#course {
  width: 100%;
}
</style>