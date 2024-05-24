<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 定义行数据的接口
interface Message {
  id: number;
  name: String;
  content: String;
  createTime: String;
}

// 定义状态
const newAnnouncement = ref('');
const announcementList = ref<Message[]>([]);
const messageList = ref<Message[]>([]);

// 获取公告列表
const getAnnouncements = async () => {
  try {
    const response = await axios.get('/message/rootList');
    announcementList.value = response.data.data;
  } catch (error) {
    console.error('Error fetching announcements:', error);
  }
};


// 获取留言列表
const getMessages = async () => {
  try {
    const response = await axios.get('message/userList');
    messageList.value = response.data.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};

const deleteAnnouncement = async (index: number) => {
  try {
    const response = await axios.delete(`/message/root/${announcementList.value[index].id}`);
    if (response.data.code === 1) {
      alert('删除成功');
      announcementList.value.splice(index, 1);
    } else {
      alert('删除失败:'+response.data.msg)
    }
  } catch (error) {
    console.error('Error deleting announcement:', error);
  }
};

const addAnnouncement = async () => {
  try {
    const response = await axios.post('/message/root', { content: newAnnouncement.value });
    if (response.data.code === 1) {
      alert('新增成功');
      await getAnnouncements();
    } else {
      alert('新增失败:'+response.data.msg)
    }
  } catch (error) {
    console.error('Error adding announcement:', error);
  }
};

const deleteMessage = async (index: number) => {
  try {
    const response = await axios.delete(`/message/user/${messageList.value[index].id}`);
    if (response.data.code === 1) {
      alert('删除成功');
      messageList.value.splice(index, 1);
    } else {
      alert('删除失败:'+response.data.msg)
    }
  } catch (error) {
    console.error('Error deleting message:', error);
  }
};


// 在组件挂载时调用获取公告和留言的方法
onMounted(() => {
  getAnnouncements();
  getMessages();
});
</script>


<template>
  <div class="container mt-4">
    <!-- 公告管理 -->
    <div class="mb-4">
      <h2>公告管理</h2>
      <el-input v-model="newAnnouncement" placeholder="请输入公告内容" class="mb-2"></el-input>
      <el-button type="primary" @click="addAnnouncement">新增公告</el-button>

      <el-table :data="announcementList" class="mt-4">
        <el-table-column prop="name" label="发布人"></el-table-column>
        <el-table-column prop="content" label="公告内容"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="danger" @click="deleteAnnouncement(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <hr />

    <!-- 留言管理 -->
    <div class="mb-4">
      <h2>留言管理</h2>
      <el-table :data="messageList" class="mt-4">
        <el-table-column prop="name" label="用户名"></el-table-column>
        <el-table-column prop="content" label="留言内容"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="danger" @click="deleteMessage(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
</style>