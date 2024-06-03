<script setup lang="ts">
import {onMounted, ref} from "vue";
import axios from "axios";

interface Course {
  id: number;
  week: string;
  time: string;
  name: string;
  booked: number;
  teacherId: number;
  teacherName: string;
  classroom: string;
  total: number;
}

const courseList = ref<Course[]>([]);
const loading = ref(false);
const multipleSelection = ref<Course[]>([]);
const showAddCourseDialog = ref(false);
const currentCourse = ref<Partial<Course>>({});
const isEdit = ref(false);

const weekDays = [
  {label: '周一', value: '周一'},
  {label: '周二', value: '周二'},
  {label: '周三', value: '周三'},
  {label: '周四', value: '周四'},
  {label: '周五', value: '周五'},
  {label: '周六', value: '周六'},
  {label: '周日', value: '周日'}
];

const timeOptions = [
  {label: '08:00:00', value: '08:00:00'},
  {label: '10:00:00', value: '10:00:00'},
  {label: '14:30:00', value: '14:30:00'},
  {label: '16:30:00', value: '16:30:00'},
  {label: '19:30:00', value: '19:30:00'}
];

function handleSelectionChange(val: Course[]) {
  multipleSelection.value = val;
}

onMounted(() => {
  getCourseList();
});

function getCourseList() {
  loading.value = true;
  axios.get('/course/list')
      .then(res => {
        if (res.data.code === 1) {
          courseList.value = res.data.data;
        } else {
          alert('获取课程列表失败: ' + res.data.msg);
        }
      })
      .catch(error => {
        console.error('请求失败:', error);
      })
      .finally(() => {
        loading.value = false;
      });
}

function updateCourse() {
  axios.put(`/course`, currentCourse.value)
      .then(res => {
        if (res.data.code === 1) {
          getCourseList();
          showAddCourseDialog.value = false;
          currentCourse.value = {};
          isEdit.value = false;
        } else {
          alert('更新课程失败: ' + res.data.msg);
        }
      })
      .catch(error => {
        console.error('更新课程请求失败:', error);
      });
}


function addCourse() {
  axios.post('/course', currentCourse.value)
      .then(res => {
        if (res.data.code === 1) {
          getCourseList();
          showAddCourseDialog.value = false;
          currentCourse.value = {};
        } else {
          alert('添加课程失败: ' + res.data.msg);
        }
      })
      .catch(error => {
        console.error('添加课程请求失败:', error);
      });
}

function deleteSelectedCourses() {
  const ids = multipleSelection.value.map(course => course.id);
  axios.delete('/course', {data: ids})
      .then(res => {
        if (res.data.code === 1) {
          getCourseList();
        } else {
          alert('批量删除课程失败: ' + res.data.msg);
        }
      })
      .catch(error => {
        console.error('批量删除课程请求失败:', error);
      });
}

function editCourse(course: Course) {
  isEdit.value = true;
  currentCourse.value = {...course};
  showAddCourseDialog.value = true;
}

function closeCourseDialog() {
  showAddCourseDialog.value = false;
  currentCourse.value = {};
  isEdit.value = false;
}
</script>

<template>
  <div>
    <el-container>
      <el-main class="p-5">
        <!-- 顶部栏，包含标题和新增课程按钮 -->
        <el-row type="flex" justify="space-between" align="middle" style="margin-bottom: 20px;">
          <el-col>
            <h2>课程管理</h2>
          </el-col>
          <el-col>
            <el-button type="primary" @click="showAddCourseDialog = true">新增课程</el-button>
            <el-button type="danger" @click="deleteSelectedCourses" :disabled="!multipleSelection.length">批量删除
            </el-button>
          </el-col>
        </el-row>
        <!-- 分割线 -->
        <hr style="border: 1px solid #dcdfe6; margin: 20px 0;">
        <!-- 课程列表 -->
        <el-table :data="courseList" v-loading="loading" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="id" label="课程编号" width="120"></el-table-column>
          <el-table-column prop="name" label="课程名称" width="120"></el-table-column>
          <el-table-column prop="teacherName" label="授课教师" width="120"></el-table-column>
          <el-table-column prop="teacherId" label="教师编号" width="120"></el-table-column>
          <el-table-column prop="classroom" label="上课教室" width="120"></el-table-column>
          <el-table-column prop="week" label="上课日期" width="100"></el-table-column>
          <el-table-column prop="time" label="上课时间" width="150"></el-table-column>
          <el-table-column prop="booked" label="已预约人数" width="100"></el-table-column>
          <el-table-column prop="total" label="总人数" width="100"></el-table-column>

          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button @click="editCourse(scope.row)" type="primary" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog :title="isEdit ? '编辑课程' : '新增课程'" v-model="showAddCourseDialog">
          <el-form :model="currentCourse">
            <el-form-item label="课程名称">
              <el-input v-model="currentCourse.name"></el-input>
            </el-form-item>
            <el-form-item label="教师编号">
              <el-input v-model="currentCourse.teacherId"></el-input>
            </el-form-item>
            <el-form-item label="上课日期">
              <el-select v-model="currentCourse.week" placeholder="请选择上课日期">
                <el-option v-for="day in weekDays" :key="day.value" :label="day.label" :value="day.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上课时间">
              <el-select v-model="currentCourse.time" placeholder="请选择上课时间">
                <el-option v-for="time in timeOptions" :key="time.value" :label="time.label"
                           :value="time.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上课教室">
              <el-input v-model="currentCourse.classroom"></el-input>
            </el-form-item>
            <el-form-item label="总人数">
              <el-input v-model="currentCourse.total"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeCourseDialog">取消</el-button>
            <el-button type="primary" @click="isEdit ? updateCourse() : addCourse()">{{
                isEdit ? '保存' : '添加'
              }}
            </el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>

</style>