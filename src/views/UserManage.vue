<script setup lang="ts">
import {onMounted, ref} from "vue";
import axios from "axios";

// 定义行数据的接口
interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  phone: string;
  height: number;
  weight: number;
  age: number;
  createTime: string;
  updateTime: string;
}

const userList = ref<User[]>([]);
const selectedUsers = ref<User[]>([]);
const loading = ref(false); // 定义 loading 状态

onMounted(() => {
  getUserList();
});

function getUserList() {
  loading.value = true; // 开始加载
  axios.get('/user/list')
      .then(res => {
        if (res.data.code === 1) {
          userList.value = res.data.data;
        } else {
          alert('获取用户列表失败:' + res.data.msg);
        }
      })
      .catch(error => {
        console.error('请求失败:', error);
      })
      .finally(() => {
        loading.value = false; // 结束加载
      });
}

function deleteUserList() {
  const ids = selectedUsers.value.map(user => user.id);
  if (ids.length === 0) {
    alert("请选择要删除的用户");
    return;
  }

  const confirmMsg = `确定要删除选中的${ids.length}个用户吗？`;
  v
  if (confirm(confirmMsg)) {
    loading.value = true;
    axios.delete(`/user`, {data: ids})
        .then(res => {
          if (res.data.code === 1) {
            // 删除成功，重新获取用户列表
            getUserList();
            selectedUsers.value = [];
          } else {
            alert('批量删除用户失败:' + res.data.msg);
          }
        })
        .catch(error => {
          console.error('批量删除用户请求失败:', error);
        })
        .finally(() => {
          loading.value = false;
        });
  }
}
</script>

<template>
  <div>
    <el-container>
      <!-- 主体内容 -->
      <el-main class="p-5">
        <!-- 顶部栏，包含标题和批量删除按钮 -->
        <el-row type="flex" justify="space-between" align="middle" style="margin-bottom: 20px;">
          <el-col>
            <h2>用户管理</h2>
          </el-col>
          <el-col>
            <el-button type="danger" @click="deleteUserList">批量删除</el-button>
          </el-col>
        </el-row>
        <!-- 分割线 -->
        <hr style="border: 1px solid #dcdfe6; margin: 20px 0;">
        <!-- 用户列表 -->
        <el-table :data="userList" v-loading="loading" @selection-change="selectedUsers = $event">
          <el-table-column type="selection" width="30"></el-table-column>
          <el-table-column prop="id" label="ID" width="200"></el-table-column>
          <el-table-column prop="username" label="用户名" width="220"></el-table-column>
          <el-table-column prop="name" label="姓名" width="160"></el-table-column>
          <el-table-column prop="phone" label="手机号" width="200"></el-table-column>
          <el-table-column prop="age" label="年龄" width="160"></el-table-column>
          <el-table-column prop="createTime" label="注册时间" width="220"></el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
/* 可以在这里添加您的样式 */
</style>
