<script setup lang="ts">
import {ref} from "vue";
import router from "@/router";
import axios from "axios";

const userData = ref({
  username: '',
  password: '',
  name: '',
  phone: '',
});


function denglu() {
  router.push("/userLogin");
}

function submitForm() {
  axios.post('userRegister', userData.value)
      .then(res => {
        if (res.data.code === 1) {
          alert('注册成功');
          router.push('/userLogin');
        } else {
          alert('注册失败:'+res.data.msg);
        }
      })
      .catch(err => {
        console.log(err);
      });
}

</script>

<template>
  <div id="register">
    <main class="form-signin w-100 m-auto">
      <div class="form-container">
        <form @submit.prevent="submitForm">
          <input type="text" v-model="userData.username" class="form-control" placeholder="Username" required>
          <input type="password" v-model="userData.password" class="form-control" placeholder="Password" required>
          <input type="text" v-model="userData.name" class="form-control" placeholder="Name" required>
          <input type="text" v-model="userData.phone" class="form-control" placeholder="Phone" required>
          <button type="submit" class="btn btn-primary">注册</button>
          <button @click="denglu" class="btn">已有账号，立即登录</button>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import "../style/register.css";
</style>