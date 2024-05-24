import {createRouter, createWebHistory} from 'vue-router'
import UserLogin from "@/components/UserLogin.vue";
import UserRegister from "@/components/UserRegister.vue";
import UserIndex from "@/components/UserIndex.vue";
import RootLogin from "@/components/RootLogin.vue";
import RootIndex from "@/components/RootIndex.vue";
import Home from "@/views/Home.vue";
import Course from "@/views/Course.vue";
import MyClass from "@/views/MyClass.vue";
import UserMessage from "@/views/UserMessage.vue";
import auth from "@/utils/auth";
import Introduce from "@/views/Introduce.vue";
import RootMessage from "@/views/RootMessage.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: 'userLogin' // Redirect to login page
        },
        {
            path: '/userLogin',
            component: UserLogin
        },
        {
            path: '/userRegister',
            component: UserRegister
        },
        {
            path: '/userIndex',
            component: UserIndex,
            meta: {requiresAuth: true},
            beforeEnter: (to, from, next) => {
                if (to.meta.requiresAuth && !auth.loggedIn()) {
                    next('/userLogin'); // 如果需要登录且未登录，则跳转到登录页面
                } else {
                    next(); // 继续路由跳转
                }
            },
            children: [
                {
                    path: 'home',
                    component: Home
                },
                {
                    path: 'course',
                    component: Course
                },
                {
                    path: 'myClass',
                    component: MyClass
                },
                {
                    path: 'userMessage',
                    component: UserMessage
                },
                {
                    path: 'introduce',
                    component: Introduce
                }
            ]

        },
        {
            path: '/rootLogin',
            component: RootLogin
        },
        {
            path: '/rootIndex',
            component: RootIndex,
            meta: {requiresAuth: true},
            beforeEnter: (to, from, next) => {
                if (to.meta.requiresAuth && !auth.loggedIn()) {
                    next('/rootLogin'); // 如果需要登录且未登录，则跳转到登录页面
                } else {
                    next(); // 继续路由跳转
                }
            },
            children:[
                {
                    path:'rootMessage',
                    component: RootMessage
                }
            ]
        }

    ]
})

export default router
