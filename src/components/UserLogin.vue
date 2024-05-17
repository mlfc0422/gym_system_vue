<script setup lang="ts">
import router from "@/router";
import {ref} from "vue";
import axios from "axios";
import auth from "@/utils/auth";

const userData = ref({
  username: '',
  password: '',
});

function submitForm() {
  axios.post('userLogin', userData.value)
      .then(res => {
        if (res.data.code === 1) {
          auth.login();
          alert('登录成功');
          router.push('/userIndex');
        } else {
          alert('登录失败:' + res.data.msg);
        }
      })
      .catch(err => {
        console.log(err);
      });
}


function zhuce() {
  router.push("/userRegister");
}

</script>

<template>
  <div id="login">
    <main class="form-signin w-100 m-auto">
      <div class="form-container">
        <form @submit.prevent="submitForm">
          <h1 class="h3 mb-3 fw-normal" style="text-align: center">JUST DO IT</h1>

          <div class="form-floating">
            <input type="text" v-model="userData.username" class="form-control" id="floatingInput"
                   placeholder="Username" required>
            <label for="floatingInput">用户名</label>
          </div>
          <div class="form-floating">
            <input type="password" v-model="userData.password" class="form-control" id="floatingPassword"
                   placeholder="Password" required>
            <label for="floatingPassword">密码</label>
          </div>

          <div class="button-container">
            <button class="btn btn-lg btn-primary" type="submit">登录</button>
            <button @click="zhuce" class="btn">没有账号，立即注册</button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import "../style/login.css";
</style>