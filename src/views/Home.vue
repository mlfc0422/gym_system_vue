<template>
  <div id="home">
    <el-descriptions
        title="个人信息"
        direction="vertical"
        :column="3"
        border

    >
      <el-descriptions-item label="用户名">{{ userData.username }}</el-descriptions-item>
      <el-descriptions-item label="姓名">{{ userData.name }}</el-descriptions-item>
      <el-descriptions-item label="电话">{{ userData.phone }}</el-descriptions-item>
      <el-descriptions-item label="年龄">{{ userData.age }}</el-descriptions-item>
      <el-descriptions-item label="身高">{{ userData.height }}</el-descriptions-item>
      <el-descriptions-item label="体重">{{ userData.weight }}</el-descriptions-item>

      <el-descriptions-item label="操作" style="text-align: center;">
        <el-button plain @click="dialogFormVisible = true">修改个人信息</el-button>
      </el-descriptions-item>
    </el-descriptions>

    <el-dialog v-model="dialogFormVisible" title="个人信息" width="500">
      <el-form :model="userData">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="userData.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="userData.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth">
          <el-input v-model="userData.age" autocomplete="off" />
        </el-form-item>
        <el-form-item label="身高" :label-width="formLabelWidth">
          <el-input v-model="userData.height" autocomplete="off" />
        </el-form-item>
        <el-form-item label="体重" :label-width="formLabelWidth">
          <el-input v-model="userData.weight" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <div ref="chartRef" style="width: 400px; height: 400px;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import * as echarts from 'echarts';

const userData = ref({
  username: '',
  password: '',
  name: '',
  phone: '',
  age: '',
  height: '',
  weight: '',
});

const CourseCount = ref([]);

const formLabelWidth = '140px';
const dialogFormVisible = ref(false);
const chartRef = ref<HTMLElement | null>(null);

const fetchData = async () => {
  try {
    const res = await axios.get('user');
    userData.value = res.data.data;
  } catch (err) {
    console.log(err);
  }
};

const initChart = () => {
  if (chartRef.value) {
    const myChart = echarts.init(chartRef.value);
    const option = {
      title: {
        text: '课程分析',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '数据',
          type: 'pie',
          radius: '50%',
          data: CourseCount.value.map(item => ({ value: item.courseCount, name: item.courseName })),
          emphasis: {
            itemStyle: {
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

const myCourseCount = async () => {
  try {
    const res = await axios.get('course/myCourseCount');
    CourseCount.value = res.data.data;
  } catch (err) {
    console.log(err);
  }
};

const handleConfirm = async () => {
  try {
    const res = await axios.put('user', userData.value);
    if (res.data.code === 1) {
      alert('修改成功');
    } else {
      alert('修改失败');
    }
  } catch (err) {
    console.log(err);
  }
  dialogFormVisible.value = false;
};

onMounted(async () => {
  await fetchData();
  await myCourseCount();
  initChart();
});

</script>

<style scoped>
#home {
  width: 100%;
}

</style>