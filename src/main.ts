import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '../src/utils/axios-config.js'
import * as echarts from 'echarts';


const app = createApp(App)
// 将 ECharts 添加到全局属性中
app.config.globalProperties.$echarts = echarts;
app.use(ElementPlus)
app.use(router)
app.mount('#app')
