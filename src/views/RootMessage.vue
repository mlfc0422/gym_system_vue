<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 定义行数据的接口
interface Message {
  id: number;
  name: String;
  content: String;
  createTime: String;
  imgPath: String;
}

// 定义状态
const newAnnouncement = ref<Message>({createTime: '', id: 0, name: '', content: '', imgPath: ''});
const announcementList = ref<Message[]>([]);
const messageList = ref<Message[]>([]);
const showAnnouncementDialog = ref(false);
const selectedImageFile = ref<File | null>(null);

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

const submitAnnouncement = async () => {

  try {
    if (selectedImageFile.value) {
      newAnnouncement.value.imgPath = await uploadImage(selectedImageFile.value);
    }

    const response = await axios.post('/message/root', newAnnouncement.value);
    if (response.data.code === 1) {
      alert('公告发布成功');
      showAnnouncementDialog.value = false;
      // 清空表单
      newAnnouncement.value.content = '';
      newAnnouncement.value.imgPath = '';
      selectedImageFile.value = null;
      // 重新获取公告列表
      await getAnnouncements()
    } else {
      alert('公告发布失败: ' + response.data.msg);
    }
  } catch (error) {
    console.error('公告发布失败:', error);
    alert('公告发布失败，请稍后再试。');
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
      <el-button type="primary" @click="showAnnouncementDialog = true">新增公告</el-button>

      <el-table :data="announcementList" class="mt-4">
        <el-table-column prop="name" label="发布人"></el-table-column>
        <el-table-column prop="content" label="公告内容"></el-table-column>
        <el-table-column prop="imgPath" label="图片" width="200">
          <template v-slot="{ row }">
            <img v-if="row.imgPath" :src="'/src/assets/messageImg/'+row.imgPath" alt="留言图片"
                 style="max-width: 100%; max-height: 100px;">
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="留言时间"></el-table-column>
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
        <el-table-column prop="imgPath" label="图片" width="200">
          <template v-slot="{ row }">
            <img v-if="row.imgPath" :src="'/src/assets/messageImg/'+row.imgPath" alt="留言图片"
                 style="max-width: 100%; max-height: 100px;">
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="留言时间"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="danger" @click="deleteMessage(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增公告对话框 -->
    <el-dialog title="新增公告" v-model="showAnnouncementDialog">
      <el-form :model="newAnnouncement">
        <el-form-item label="公告内容">
          <el-input type="textarea" v-model="newAnnouncement.content"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <input id="file-input" type="file" @change="handleFileChange">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAnnouncementDialog = false">取消</el-button>
        <el-button type="primary" @click="submitAnnouncement">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
</style>