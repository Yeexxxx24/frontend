<template>
  <el-container style="height: 100vh;">
    <!-- 顶部导航栏 -->
     <el-header class="header">
      <div class="logo">代码查重系统</div>
      <div class="user-info">
        <span>欢迎，{{ store.username }} ({{ roleLabel[store.role] }})</span>
        <el-button type="danger" @click="handleLogout">退出</el-button>
      </div>
     </el-header>

     <el-container>
        <!-- 左侧菜单栏 -->
        <el-aside width="200px" class="aside">
          <el-menu default-active="1">
            <el-menu-item index="1" @click="router.push('/dashboard/check')">查重模块</el-menu-item>
            <el-menu-item index="2" @click="router.push('/dashboard/profile')">个人信息</el-menu-item>
          </el-menu>
        </el-aside>
         
        <!-- 主内容区域 -->
         <el-main class="main">
            <router-view/>
            <!-- <h2>欢迎使用代码查重系统</h2> -->
            <!-- <p>请选择左侧功能进行操作</p> -->
         </el-main>
     </el-container>
  </el-container>
</template>

<script setup lang="ts">
  import { useUserStore } from '@/stores/user'; //用户状态store
  import { useRouter } from 'vue-router'; //用于跳转页面
  import { ElMessage } from 'element-plus'; //弹出提示

  const store = useUserStore()
  const router = useRouter()

  // 中文角色标签映射
  const roleLabel:Record<string,string> = {
    student:'学生',
    teacher:'教师',
    '':'未定义'
  }

  // 退出登录逻辑
  const handleLogout = () => {
    store.clearUser() //清空token和用户信息
    ElMessage.success('已退出登录')
    router.push('/login') //跳回登录页
  }

</script>

<style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #409eff;
    color:white;
    padding:0 20px
  }
  .logo {
    font-size: 20px;
    font-weight: bold;
  }
  .user-info {
    display: flex;
    align-items: center;
    gap:10px
  }
  .aside {
  background-color: #f5f5f5;
  padding-top: 20px;
}

.main {
  padding: 40px;
}
</style>