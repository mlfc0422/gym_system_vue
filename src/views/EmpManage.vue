<script setup lang="ts">

import axios from "axios";
import {onMounted, ref} from "vue";

interface Employee {
  id: number;
  name: string;
  post: string;
  phone: string;
  age: number;
  createTime: string;
  salary: number;
}

const employeeList = ref<Employee[]>([]);
const loading = ref(false);
const showAddEmployeeDialog = ref(false);
const multipleSelection = ref<Employee[]>([]);
const isEdit = ref(false);
const currentEmployee = ref<Partial<Employee>>({});
onMounted(() => {
  getEmployeeList();
});

function handleSelectionChange(val: Employee[]) {
  multipleSelection.value = val;
}

function getEmployeeList() {
  loading.value = true;
  axios.get('/emp/list')
      .then(res => {
        if (res.data.code === 1) {
          employeeList.value = res.data.data;
        } else {
          alert('获取员工列表失败: ' + res.data.msg);
        }
      })
      .catch(error => {
        console.error('请求失败:', error);
      })
      .finally(() => {
        loading.value = false;
      });
}

function addEmployee() {
  axios.post('/emp', currentEmployee.value)
      .then(res => {
        if (res.data.code === 1) {
          getEmployeeList();
          showAddEmployeeDialog.value = false;
          currentEmployee.value = {};
        } else {
          alert('添加员工失败: ' + res.data.msg);
        }
      })
      .catch(error => {
        console.error('添加员工请求失败:', error);
      });
}

function updateEmployee() {
  axios.put('/emp', currentEmployee.value)
      .then(res => {
        if (res.data.code === 1) {
          getEmployeeList();
          showAddEmployeeDialog.value = false;
          currentEmployee.value = {};
          isEdit.value = false;
        } else {
          alert('更新员工失败: ' + res.data.msg);
        }
      })
      .catch(error => {
        console.error('更新员工请求失败:', error);
      });
}

function editEmployee(employee: Employee) {
  isEdit.value = true;
  currentEmployee.value = {...employee};
  showAddEmployeeDialog.value = true;
}

function deleteEmployees() {
  const ids = multipleSelection.value.map(emp => emp.id);
  axios.delete('/emp', {data: ids})
      .then(res => {
        if (res.data.code === 1) {
          getEmployeeList();
        } else {
          alert('删除员工失败: ' + res.data.msg);
        }
      })
      .catch(error => {
        console.error('删除员工请求失败:', error);
      });
}
</script>

<template>
  <div>
    <el-container>
      <el-main class="p-5">
        <!-- 顶部栏，包含标题和新增员工按钮 -->
        <el-row type="flex" justify="space-between" align="middle" style="margin-bottom: 20px;">
          <el-col>
            <h2>员工管理</h2>
          </el-col>
          <el-col>
            <el-button type="primary" @click="showAddEmployeeDialog = true">新增员工</el-button>
            <el-button type="danger" @click="deleteEmployees" :disabled="!multipleSelection.length">批量删除</el-button>
          </el-col>
        </el-row>
        <!-- 分割线 -->
        <hr style="border: 1px solid #dcdfe6; margin: 20px 0;">
        <!-- 员工列表 -->
        <el-table :data="employeeList" v-loading="loading" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="id" label="员工编号" width="120"></el-table-column>
          <el-table-column prop="name" label="姓名" width="150"></el-table-column>
          <el-table-column prop="post" label="职位" width="150"></el-table-column>
          <el-table-column prop="phone" label="电话" width="150"></el-table-column>
          <el-table-column prop="salary" label="薪资" width="150"></el-table-column>
          <el-table-column prop="age" label="年龄" width="100"></el-table-column>
          <el-table-column prop="createTime" label="入职日期" width="200"></el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button @click="editEmployee(scope.row)" type="primary" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 新增/编辑员工对话框 -->
        <el-dialog :title="isEdit ? '编辑员工' : '新增员工'" v-model="showAddEmployeeDialog">
          <el-form :model="currentEmployee">
            <el-form-item label="姓名">
              <el-input v-model="currentEmployee.name"></el-input>
            </el-form-item>
            <el-form-item label="职位">
              <el-input v-model="currentEmployee.post"></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="currentEmployee.phone"></el-input>
            </el-form-item>
            <el-form-item label="年龄">
              <el-input v-model="currentEmployee.age"></el-input>
            </el-form-item>
            <el-form-item label="薪资">
              <el-input v-model="currentEmployee.salary"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="showAddEmployeeDialog = false">取消</el-button>
            <el-button type="primary" @click="isEdit ? updateEmployee() : addEmployee()">{{
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