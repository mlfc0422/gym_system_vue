<script setup lang="ts">
import {onMounted, ref} from "vue";
import axios from "axios";
import * as echarts from 'echarts';

interface CourseData {
  courseName: string;
  courseCount: number;
}

const CourseCountList = ref<CourseData[]>([]);

const fetchData = async () => {
  try {
    const response = await axios.get('course/courseCountList');
    CourseCountList.value = response.data.data;
  } catch (error) {
    console.error('Error fetching course count:', error);
  }
};

const chartRef = ref<HTMLElement | null>(null);

const initChart = () => {
  if (chartRef.value) {
    const myChart = echarts.init(chartRef.value);

    const option = {
      title: {
        text: '热门课程',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: 'category',
        data: CourseCountList.value.map(item => item.courseName),
      },
      series: [
        {
          name: '报名人数',
          type: 'bar',
          data: CourseCountList.value.map(item => item.courseCount),
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    myChart.setOption(option);
  }
};

onMounted(async () => {
  await fetchData();
  initChart();
});
</script>

<template>
  <div>
    <div ref="chartRef" style="width: 800px; height: 700px;"></div>
  </div>
</template>

<style scoped>

</style>