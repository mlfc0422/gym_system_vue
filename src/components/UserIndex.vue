<script setup lang="ts">

import axios from "axios";
import router from "@/router";
import auth from "@/utils/auth";

function logout() {
  axios.post('userLogout')
      .then(res => {
        if (res.data.code === 1) {
          alert(res.data.data);
          auth.logout()
          router.push('/userLogin');
        } else {
          alert('登出失败');
        }
      })
      .catch(err => {
        console.log(err);
      });
}
</script>

<template>
  <header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
    <router-link to="/userIndex/introduce" class="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6">104Gym</router-link>
    <div class="navbar-nav">
      <div class="nav-item text-nowrap">
        <a class="nav-link px-3" @click="logout">登出</a>
      </div>
    </div>
  </header>

  <div class="container-fluid">
    <div class="row">
      <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
        <div class="position-sticky pt-3 sidebar-sticky">
          <ul class="nav flex-column">
            <li class="nav-item">
              <router-link to="/userIndex/home" class="nav-link rectangle">
                <span class="align-text-bottom"></span>
                个人主页
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/userIndex/course" class="nav-link rectangle">
                <span class="align-text-bottom"></span>
                课程列表
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/userIndex/myClass" class="nav-link rectangle">
                <span class="align-text-bottom"></span>
                我的课程
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/userIndex/userMessage" class="nav-link rectangle">
                <span class="align-text-bottom"></span>
                公告栏
              </router-link>
            </li>
          </ul>
        </div>
      </nav>


      <main class="col-md-9 ms-md-auto ms-sm-auto col-lg-10 ms-lg-auto px-md-4">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>

@import "../style/index.css";
</style>