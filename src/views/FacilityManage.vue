<script setup lang="ts">
import {onMounted, ref} from "vue";
import axios from "axios";

interface Equipment {
  id: number;
  name: string;
  num: number;
  rootId: number;
  text: string;
  createTime: string;
  updateTime: string;
}

const equipmentList = ref<Equipment[]>([]);
const loading = ref(false);
const currentEquipment = ref<Partial<Equipment>>({});
const showAddEquipmentDialog = ref(false);
const isEdit = ref(false);
const multipleSelection = ref<Equipment[]>([]);

onMounted(() => {
  getEquipmentList();
});

function getEquipmentList() {
  loading.value = true;
  axios.get('/facility/list')
      .then(res => {
        if (res.data.code === 1) {
          equipmentList.value = res.data.data;
        } else {
          alert('获取器材列表失败: ' + res.data.msg);
        }
      })
      .catch(error => {
        console.error('请求失败:', error);
      })
      .finally(() => {
        loading.value = false;
      });
}

function addEquipment() {
  axios.post('/facility', currentEquipment.value)
      .then(res => {
        if (res.data.code === 1) {
          getEquipmentList();
          showAddEquipmentDialog.value = false;
          currentEquipment.value = {};
        } else {
          alert('添加器材失败: ' + res.data.msg);
        }
      })
      .catch(error => {
        console.error('添加器材请求失败:', error);
      });
}

function updateEquipment() {
  axios.put('/facility', currentEquipment.value)
      .then(res => {
        if (res.data.code === 1) {
          getEquipmentList();
          showAddEquipmentDialog.value = false;
          currentEquipment.value = {};
        } else {
          alert('修改器材失败: ' + res.data.msg);
        }
      })
      .catch(error => {
        console.error('修改器材请求失败:', error);
      });
}

function showEditDialog(equipment: Equipment) {
  isEdit.value = true;
  currentEquipment.value = {...equipment};
  showAddEquipmentDialog.value = true;
}

function showAddDialog() {
  isEdit.value = false;
  currentEquipment.value = {};
  showAddEquipmentDialog.value = true;
}

function handleSelectionChange(val: Equipment[]) {
  multipleSelection.value = val;
}

function deleteSelectedEquipments() {
  const ids = multipleSelection.value.map(item => item.id);
  axios.delete('/facility', {data: ids})
      .then(res => {
        if (res.data.code === 1) {
          getEquipmentList();
          multipleSelection.value = [];
        } else {
          alert('删除器材失败: ' + res.data.msg);
        }
      })
      .catch(error => {
        console.error('删除器材请求失败:', error);
      });
}
</script>

<template>
  <div>
    <el-container>
      <el-main class="p-5">
        <!-- 顶部栏，包含标题和新增器材按钮 -->
        <el-row type="flex" justify="space-between" align="middle" style="margin-bottom: 20px;">
          <el-col>
            <h2>器材管理</h2>
          </el-col>
          <el-col>
            <el-button type="primary" @click="showAddDialog">新增器材</el-button>
            <el-button type="danger" @click="deleteSelectedEquipments" :disabled="!multipleSelection.length">批量删除
            </el-button>
          </el-col>
        </el-row>
        <!-- 分割线 -->
        <hr style="border: 1px solid #dcdfe6; margin: 20px 0;">
        <!-- 器材列表 -->
        <el-table :data="equipmentList" v-loading="loading" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="id" label="器材编号" width="125"></el-table-column>
          <el-table-column prop="name" label="器材名称" width="125"></el-table-column>
          <el-table-column prop="num" label="数量" width="100"></el-table-column>
          <el-table-column prop="text" label="描述" width="300"></el-table-column>
          <el-table-column prop="rootId" label="操作人" width="100"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="200"></el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="200"></el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="showEditDialog(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 新增/修改器材对话框 -->
        <el-dialog :title="isEdit ? '修改器材' : '新增器材'" v-model="showAddEquipmentDialog">
          <el-form :model="currentEquipment">
            <el-form-item label="名称">
              <el-input v-model="currentEquipment.name"></el-input>
            </el-form-item>
            <el-form-item label="数量">
              <el-input v-model="currentEquipment.num" type="number"></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="currentEquipment.text"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="showAddEquipmentDialog = false">取消</el-button>
            <el-button type="primary" @click="isEdit ? updateEquipment() : addEquipment()">{{
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