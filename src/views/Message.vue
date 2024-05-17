<script setup lang="ts">

// 定义行数据的接口
import {onMounted, ref} from "vue";
import axios from "axios";

interface Message {
  name:String
  content:String
  createTime:String
}

const contentList = ref<Message[]>([]);
const newMessage = ref();

onMounted(() => {
  getContentList();
});

function getContentList() {
  axios.get('message/list')
      .then(res => {
        contentList.value = res.data.data;
      })
      .catch(err => {
        console.log(err);
      });
}

function sendMessage() {
  axios.post('message', {content: newMessage.value})
      .then(res => {
        if (res.data.code === 1) {
          alert('发送成功');
          getContentList();
        } else {
          alert('留言失败:' + res.data.msg);
        }
      })
      .catch(err => {
        console.log(err);
      });
  newMessage.value = '';
}
</script>

<template>
  <div id="message">
    <!-- 留言内容列表 -->
    <div v-for="(item, index) in contentList" :key="index" class="data-container">
      <!-- 留言信息 -->
      <div class="data-row">
        <div class="data-label"></div>
        <div class="data-value">{{ item.name }}</div>
        <div class="data-label"></div>
        <div class="data-value time">{{ item.createTime }}</div>
      </div>
      <div class="data-row">
        <div class="data-label"></div>
        <div class="data-value">{{ item.content }}</div>
      </div>
    </div>

    <!-- 留言输入框 -->
    <div class="message-input">
      <textarea v-model="newMessage" placeholder="请输入留言内容"></textarea>
      <button @click="sendMessage">发送</button>
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