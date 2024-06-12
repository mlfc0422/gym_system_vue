<script setup lang="ts">
import {nextTick, onMounted, ref} from "vue";
import axios from "axios";
import * as echarts from 'echarts';

interface Course {
  name: string;
  courseCount: number;
  teacherName: string;
}

interface TimeSlot {
  time: string;
  courseCount: number;
}

const courseList = ref<Course[]>([]);
const timeSlotList = ref<TimeSlot[]>([]);
const courseChartInstance = ref<echarts.ECharts | null>(null);
const timeSlotChartInstance = ref<echarts.ECharts | null>(null);

onMounted(() => {
  Promise.all([getCourseList(), getTimeSlotList()]).then(() => {
    nextTick(() => {
      initCourseChart();
      initTimeSlotChart();
    });
  });
});

function getCourseList() {
  return axios.get('course/courseCountList')
      .then(res => {
        courseList.value = res.data.data;
      })
      .catch(err => {
        console.log(err);
      });
}

function getTimeSlotList() {
  return axios.get('course/timeCount')
      .then(res => {
        timeSlotList.value = res.data.data;
      })
      .catch(err => {
        console.log(err);
      });
}

function initCourseChart() {
  const chartDom = document.getElementById('course-chart')!;
  courseChartInstance.value = echarts.init(chartDom);

  const option = {
    xAxis: {
      type: 'category',
      data: courseList.value.map(course => `${course.name} - ${course.teacherName}`),
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: courseList.value.map(course => course.courseCount),
        type: 'bar',
      }
    ]
  };

  courseChartInstance.value.setOption(option);
}

function initTimeSlotChart() {
  const chartDom = document.getElementById('time-slot-chart')!;
  timeSlotChartInstance.value = echarts.init(chartDom);

  const option = {
    xAxis: {
      type: 'category',
      data: timeSlotList.value.map(slot => slot.time),
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: timeSlotList.value.map(slot => slot.courseCount),
        type: 'bar',
      }
    ]
  };

  timeSlotChartInstance.value.setOption(option);
}
</script>

<template>
  <div id="admin-dashboard">
    <h2>课程预订人数统计</h2>
    <div id="course-chart" style="width: 900px; height: 400px;"></div>
    <h2>时间段预订统计</h2>
    <div id="time-slot-chart" style="width: 900px; height: 400px;"></div>
  </div>
</template>

<style scoped>
#course-chart, #time-slot-chart {
  width: 100%;
  height: 100%;
}
</style>
