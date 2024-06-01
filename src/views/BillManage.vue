<script setup lang="ts">
import {onMounted, ref} from "vue";
import axios from "axios";

interface Bill {
  id: number;
  rootId: number;
  text: string;
  amount: number;
  createTime: string;
  updateTime: string;
}

const billList = ref<Bill[]>([]);
const loading = ref(false);
const currentBill = ref<Partial<Bill>>({});
const showAddBillDialog = ref(false);
const isEdit = ref(false);

onMounted(() => {
  getBillList();
});

function getBillList() {
  loading.value = true;
  axios.get('/bill/list')
      .then(res => {
        if (res.data.code === 1) {
          billList.value = res.data.data;
        } else {
          alert('获取账单列表失败: ' + res.data.msg);
        }
      })
      .catch(error => {
        console.error('请求失败:', error);
      })
      .finally(() => {
        loading.value = false;
      });
}

function addBill() {
  axios.post('/bill', currentBill.value)
      .then(res => {
        if (res.data.code === 1) {
          getBillList();
          showAddBillDialog.value = false;
          currentBill.value = {};
        } else {
          alert('添加账单失败: ' + res.data.msg);
        }
      })
      .catch(error => {
        console.error('添加账单请求失败:', error);
      });
}

function editBill(bill: Bill) {
  isEdit.value = true;
  currentBill.value = {...bill};
  showAddBillDialog.value = true;
}

function updateBill() {
  axios.put(`/bill`, currentBill.value)
      .then(res => {
        if (res.data.code === 1) {
          getBillList();
          showAddBillDialog.value = false;
          currentBill.value = {};
          isEdit.value = false;
        } else {
          alert('更新账单失败: ' + res.data.msg);
        }
      })
      .catch(error => {
        console.error('更新账单请求失败:', error);
      });
}
</script>

<template>
  <div>
    <el-container>
      <el-main class="p-5">
        <!-- 顶部栏，包含标题和新增账单按钮 -->
        <el-row type="flex" justify="space-between" align="middle" style="margin-bottom: 20px;">
          <el-col>
            <h2>账单管理</h2>
          </el-col>
          <el-col>
            <el-button type="primary" @click="showAddBillDialog = true">新增账单</el-button>
          </el-col>
        </el-row>
        <!-- 分割线 -->
        <hr style="border: 1px solid #dcdfe6; margin: 20px 0;">
        <!-- 账单列表 -->
        <el-table :data="billList" v-loading="loading">
          <el-table-column prop="id" label="账单编号" width="100"></el-table-column>
          <el-table-column prop="rootId" label="管理员id" width="100"></el-table-column>
          <el-table-column prop="text" label="描述" width="300"></el-table-column>
          <el-table-column prop="amount" label="总金额" width="180"></el-table-column>
          <el-table-column prop="createTime" label="创建日期" width="200"></el-table-column>
          <el-table-column prop="updateTime" label="修改日期" width="200"></el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button @click="editBill(scope.row)" type="primary" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 新增/编辑账单对话框 -->
        <el-dialog :title="isEdit ? '编辑账单' : '新增账单'" v-model="showAddBillDialog">
          <el-form :model="currentBill">
            <el-form-item label="描述">
              <el-input v-model="currentBill.text" :disabled="!isEdit"></el-input>
            </el-form-item>
            <el-form-item label="金额">
              <el-input v-model="currentBill.amount" type="number" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="showAddBillDialog = false">取消</el-button>
            <el-button type="primary" @click="isEdit ? updateBill() : addBill">{{
                isEdit ? '保存' : '添加'
              }}
            </el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>


<style scoped>

</style>