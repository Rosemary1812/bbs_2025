<template>
  <div class="admin-page">
    <div class="admin-header">
      <h2>社区管理</h2>
    </div>
    <div class="admin-content">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="admin-card">
            <template #header>
              <span>用户管理</span>
            </template>
            <div class="card-content">
              <p>用户总数: {{ userStats.total }}</p>
              <p>今日新增: {{ userStats.todayNew }}</p>
              <el-button type="primary" @click="goToUserManagement">管理用户</el-button>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="admin-card">
            <template #header>
              <span>文章管理</span>
            </template>
            <div class="card-content">
              <p>文章总数: {{ articleStats.total }}</p>
              <p>今日发布: {{ articleStats.todayNew }}</p>
              <el-button type="primary" @click="goToArticleManagement">管理文章</el-button>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="admin-card">
            <template #header>
              <span>板块管理</span>
            </template>
            <div class="card-content">
              <p>板块总数: {{ boardStats.total }}</p>
              <p>一级板块: {{ boardStats.parentCount }}</p>
              <el-button type="primary" @click="goToBoardManagement">管理板块</el-button>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="admin-card">
            <template #header>
              <span>系统设置</span>
            </template>
            <div class="card-content">
              <p>系统状态: 正常</p>
              <p>在线用户: {{ systemStats.onlineUsers }}</p>
              <el-button type="primary" @click="goToSystemSettings">系统设置</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const router = useRouter();

const userStats = ref({
  total: 0,
  todayNew: 0
});

const articleStats = ref({
  total: 0,
  todayNew: 0
});

const boardStats = ref({
  total: 0,
  parentCount: 0
});

const systemStats = ref({
  onlineUsers: 0
});

const api = {
  getAdminStats: "/admin/getStats"
};

const loadStats = async () => {
  try {
    let result = await proxy.Request({
      url: api.getAdminStats
    });
    if (result) {
      userStats.value = result.data.userStats || { total: 0, todayNew: 0 };
      articleStats.value = result.data.articleStats || { total: 0, todayNew: 0 };
      boardStats.value = result.data.boardStats || { total: 0, parentCount: 0 };
      systemStats.value = result.data.systemStats || { onlineUsers: 0 };
    }
  } catch (error) {
    console.error('加载统计数据失败:', error);
  }
};

const goToUserManagement = () => {
  router.push('/admin/users');
};

const goToArticleManagement = () => {
  router.push('/admin/articles');
};

const goToBoardManagement = () => {
  router.push('/admin/boards');
};

const goToSystemSettings = () => {
  router.push('/admin/settings');
};

onMounted(() => {
  loadStats();
});
</script>

<style lang="scss" scoped>
.admin-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .admin-header {
    margin-bottom: 30px;
    h2 {
      color: #333;
      margin: 0;
    }
  }

  .admin-content {
    .admin-card {
      margin-bottom: 20px;
      
      .card-content {
        text-align: center;
        
        p {
          margin: 10px 0;
          color: #666;
        }
        
        .el-button {
          margin-top: 10px;
        }
      }
    }
  }
}
</style> 