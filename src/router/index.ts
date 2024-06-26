import {createRouter, createWebHistory} from 'vue-router'
import UserLogin from "@/components/UserLogin.vue";
import UserRegister from "@/components/UserRegister.vue";
import UserIndex from "@/components/UserIndex.vue";
import RootLogin from "@/components/RootLogin.vue";
import RootIndex from "@/components/RootIndex.vue";
import Home from "@/views/Home.vue";
import Course from "@/views/UserCourse.vue";
import MyClass from "@/views/MyClass.vue";
import UserMessage from "@/views/UserMessage.vue";
import auth from "@/utils/auth";
import RootMessage from "@/views/RootMessage.vue";
import UserIntroduce from "@/views/UserIntroduce.vue";
import RootIntroduce from "@/views/RootIntroduce.vue";
import UserManage from "@/views/UserManage.vue";
import BillManage from "@/views/BillManage.vue";
import FacilityManage from '@/views/FacilityManage.vue';
import CourseManage from "@/views/CourseManage.vue";
import EmpManage from "@/views/EmpManage.vue";

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
                if (to.meta.requiresAuth && !auth.userLoggedIn()) {
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
                    component: UserIntroduce
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
                if (to.meta.requiresAuth && !auth.rootLoggedIn()) {
                    next('/rootLogin'); // 如果需要登录且未登录，则跳转到登录页面
                } else {
                    next(); // 继续路由跳转
                }
            },
            children:[
                {
                    path: 'introduce',
                    component: RootIntroduce
                },
                {
                    path:'rootMessage',
                    component: RootMessage
                },
                {
                    path: 'userManage',
                    component: UserManage
                },
                {
                    path: 'billManage',
                    component: BillManage
                },
                {
                    path: 'facilityManage',
                    component: FacilityManage
                },
                {
                    path: 'courseManage',
                    component: CourseManage
                },
                {
                    path: 'empManage',
                    component: EmpManage
                }
            ]
        }

    ]
})

export default router
