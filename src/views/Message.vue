<script setup lang="ts">

import { ref, onMounted } from 'vue';
import axios from 'axios';

// 定义行数据的接口
interface Message {
  name: String;
  content: String;
  createTime: String;
}

const userContentList = ref<Message[]>([]);
const newMessage = ref('');
const currentAnnouncement = ref<Message>();
const rootContentList = ref<Message[]>([]);
const showAnnouncementList = ref(false);

onMounted(() => {
  getUserContentList();
  getRootContentList();
  getAnnouncement();
});

function getUserContentList() {
  axios.get('message/userList')
      .then(res => {
        userContentList.value = res.data.data;
      })
      .catch(err => {
        console.log(err);
      });
}

function getRootContentList() {
  axios.get('message/rootList')
      .then(res => {
        rootContentList.value = res.data.data;
      })
      .catch(err => {
        console.log(err);
      });
}

function getAnnouncement() {
  axios.get('message/announcement')
      .then(res => {
        currentAnnouncement.value = res.data.data;
      })
      .catch(err => {
        console.log(err);
      });
}

function sendMessage() {
  axios.post('message/user', { content: newMessage.value })
      .then(res => {
        if (res.data.code === 1) {
          alert('发送成功');
          getUserContentList();
        } else {
          alert('留言失败: ' + res.data.msg);
        }
      })
      .catch(err => {
        console.log(err);
      });
  newMessage.value = '';
}

function toggleAnnouncementList() {
  showAnnouncementList.value = !showAnnouncementList.value;
}
</script>

<template>
  <div id="message" class="container mt-4">
    <!-- 公告和历史公告按钮 -->
    <div class="announcement-section d-flex align-items-center mb-3">
      <button class="btn btn-primary me-3" @click="toggleAnnouncementList">历史公告</button>
      <div class="current-announcement flex-grow-1">
        <strong>公告：</strong>{{ currentAnnouncement?.content}}
      </div>
    </div>

    <!-- 历史公告列表 -->
    <div v-if="showAnnouncementList" class="announcement-list mb-3 p-3 border bg-light">
      <div class="section-title">历史公告</div>
      <div v-for="(announcement, index) in rootContentList" :key="index" class="announcement-item mb-2">
        <div class="data-row d-flex mb-2">
          <div class="data-value me-3"><strong>{{ announcement.name }}</strong></div>
          <div class="data-value time text-muted">{{ announcement.createTime }}</div>
        </div>
        <div class="data-row">
          <div class="data-value">{{ announcement.content }}</div>
        </div>
      </div>
    </div>

    <!-- 分界线 -->
    <hr class="my-4">

    <!-- 留言内容列表 -->
    <div class="section-title mb-3">用户留言</div>
    <div v-for="(item, index) in userContentList" :key="index" class="data-container mb-3 p-3 border bg-light">
      <!-- 留言信息 -->
      <div class="data-row d-flex mb-2">
        <div class="data-value me-3"><strong>{{ item.name }}</strong></div>
        <div class="data-value time text-muted">{{ item.createTime }}</div>
      </div>
      <div class="data-row">
        <div class="data-value">{{ item.content }}</div>
      </div>
    </div>

    <!-- 留言输入框 -->
    <div class="message-input mt-3">
      <textarea class="form-control mb-2" v-model="newMessage" placeholder="请输入留言内容"></textarea>
      <button class="btn btn-success" @click="sendMessage">发送</button>
    </div>
  </div>
</template>




<style scoped>
.message-input {
  display: flex;
  position: absolute;
  bottom: 20px;
  padding: 15px; /* 可以根据需要调整留言框的内边距 */
  background-color: #f9f9f9; /* 可以根据需要设置留言框的背景色 */
  width: 1335px;
}

.message-input textarea {
  width: calc(100% - 70px); /* 调整留言框的宽度，使其留出发送按钮的空间 */
  height: 60px; /* 可以根据需要设置留言框的高度 */
  resize: none; /* 防止留言框被用户调整大小 */
  border: none;
  padding: 5px;
  margin-right: 10px;
}

.message-input button {
  width: 60px;
  height: 60px;
  background-color: #007bff; /* 可以根据需要设置发送按钮的背景色 */
  color: #fff; /* 可以根据需要设置发送按钮的文字颜色 */
  border: none;
  cursor: pointer;
}

.data-container {
  margin-bottom: 20px; /* 设置留言内容容器之间的底部间距 */
}

.data-row {
  display: flex; /* 设置行内布局 */
  margin-bottom: 10px; /* 设置姓名和内容之间的底部间距 */
}

.data-label {
  margin-right: 20px; /* 调整标签之间的右侧间距 */
}

.time {
  color: #999; /* 设置时间文本的颜色为浅灰色 */
}
</style>