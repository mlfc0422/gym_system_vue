<script setup lang="ts">

import { ref, onMounted } from 'vue';
import axios from 'axios';

// 定义行数据的接口
interface Message {
  name: string;
  content: string;
  createTime: string;
  imgPath: string;
}

// 定义响应式变量
const userContentList = ref<Message[]>([]);
const newMessage = ref<Message>({
  name: '',
  content: '',
  createTime: '',
  imgPath: ''
});
const currentAnnouncement = ref<Message | null>(null);
const rootContentList = ref<Message[]>([]);
const showAnnouncementList = ref(false);
const selectedImageFile = ref<File | null>(null);

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

function toggleAnnouncementList() {
  showAnnouncementList.value = !showAnnouncementList.value;
}

const handleFileChange = (event: Event) => {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files[0]) {
    selectedImageFile.value = fileInput.files[0];
  } else {
    selectedImageFile.value = null;
  }
};

const uploadImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('image', file);

    axios.post('/message/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
        .then(response => {
          if (response.data.code === 1) {
            resolve(response.data.data); // 返回图片路径
          } else {
            reject('上传失败: ' + response.data.msg);
          }
        })
        .catch(error => {
          reject('Error uploading image: ' + error);
        });
  });
};

const addContent = async () => {

  try {
    if (selectedImageFile.value) {
      newMessage.value.imgPath = await uploadImage(selectedImageFile.value);
    }

    const response = await axios.post('/message/user', newMessage.value);
    if (response.data.code === 1) {
      // 清空表单
      newMessage.value.content = '';
      newMessage.value.imgPath = '';
      selectedImageFile.value = null;
      // 重新获取公告列表
      getUserContentList()
    } else {
      alert('公告发布失败: ' + response.data.msg);
    }
  } catch (error) {
    console.error('公告发布失败:', error);
    alert('公告发布失败，请稍后再试。');
  }
};
</script>

<template>
  <div id="message" class="container mt-4">
    <div id="content">
      <!-- 公告和历史公告按钮 -->
      <div class="announcement-section d-flex align-items-center mb-3">
        <button class="btn btn-primary me-3" @click="toggleAnnouncementList">历史公告</button>
        <div class="current-announcement flex-grow-1">
          <strong>公告:</strong>{{ currentAnnouncement?.content }}
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
          <!-- 图片 -->
          <div class="data-row" v-if="announcement.imgPath">
            <img :src="'/src/assets/messageImg/'+announcement.imgPath" alt="管理员上传的图片"
                 style="width: 320px;height: 180px"/>
          </div>
        </div>
      </div>

      <!-- 分界线 -->
      <hr class="my-4">

      <!-- 留言内容列表 -->
      <div class="section-title mb-3">用户留言</div>
      <div v-for="(item, index) in userContentList" :key="index" class="data-container mb-4 p-3 border bg-light">
        <!-- 留言信息 -->
        <div class="data-row d-flex mb-2">
          <div class="data-value me-3"><strong>{{ item.name }}</strong></div>
          <div class="data-value time text-muted">{{ item.createTime }}</div>
        </div>
        <div class="data-row">
          <div class="data-value">{{ item.content }}</div>
        </div>
        <!-- 图片 -->
        <div class="data-row" v-if="item.imgPath">
          <img :src="'/src/assets/messageImg/'+item.imgPath" alt="用户上传的图片" style="width: 320px;height: 180px"/>
        </div>
      </div>
    </div>

    <!-- 留言输入 -->
    <div class="message-input mt-3">
      <div class="input-group">
        <textarea class="form-control mb-2" v-model="newMessage.content" placeholder="请输入留言内容"></textarea>
        <div class="input-group-append">
          <label for="file-input" class="btn btn-outline-secondary transparent-bg">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-file-image"
                 viewBox="0 0 16 16">
              <path d="M8.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              <path
                  d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8l-2.083-2.083a.5.5 0 0 0-.76.063L8 11 5.835 9.7a.5.5 0 0 0-.611.076L3 12V2z"/>
            </svg>
          </label>
          <input id="file-input" type="file" style="display: none" @change="handleFileChange">
        </div>
        <button class="btn btn-success mt-2" @click="addContent">发送</button>
      </div>
      <div v-if="selectedImageFile" class="selected-image-info">
        已选择图片
      </div>
    </div>
  </div>
</template>

<style scoped>
#message {
  position: relative; /* 相对定位 */
}
.message-input {
  display: flex;
  flex-direction: column; /* 改为列方向 */
  position: fixed; /* 固定定位 */
  bottom: 20px;
  padding: 15px;
  background-color: #e9ecef;
  z-index: 999; /* 确保输入框位于其他内容之上 */
  width: 1300px;
  height: 110px;
}

.message-input .input-group {
  display: flex;
}

.message-input textarea {
  flex: 1;
  height: 60px;
  resize: none;
  border: none;
  padding: 5px;
  margin-right: 10px;
}

.message-input .input-group-append {
  display: flex;
  align-items: center;
}

.message-input button {
  width: 100px; /* 改宽度 */
  height: 40px; /* 改高度 */
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  margin-top: 10px; /* 顶部外边距 */
}

.selected-image-info {
  color: #6c757d; /* Muted text color */
}

.data-row {
  display: flex;
  margin-bottom: 10px;
}

.time {
  color: #999;
}

.transparent-bg {
  background-color: transparent !important;
  border-color: transparent !important;
}

/* 特定样式 */
.section-title {
  font-weight: bold;
}

.announcement-section {
  align-items: center;
  margin-bottom: 3px;
}

.announcement-item {
  margin-bottom: 2px;
}

svg {
  color: black;
}

#content {
  margin-bottom: 132px;
}
</style>