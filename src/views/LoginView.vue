<template>
  <div class="login-container">
    <el-form :model="form" class="login-form">
      <!-- 用户输入框  -->
      <el-form-item>
        <el-input v-model="form.username" placeholder="用户名"/>
      </el-form-item>
      
      <!-- 密码输入框 -->
      <el-form-item>
        <el-input v-model="form.password" placeholder="密码" show-password/>
      </el-form-item>

      <!-- 登录按钮 -->
      <el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </el-form-item>

      <!-- 注册跳转 -->
       <el-form-item>
        <span>没有账号？</span>
        <el-button type="text" @click="goRegister">去注册</el-button>
       </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus';
  import {reactive} from 'vue'
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/user';
  import request from '@/utils/request';

  const router = useRouter() // 获取路由实例，用于跳转页面
  const store = useUserStore()  // 获取用户状态 store，方便存储 token 等
  
  //登录表单的数据
  const form = reactive({
    username:'',
    password:''
  })

  // 点击登录按钮时调用
  const handleLogin = async ()=>{
    try {
      // 向后端发送 POST 请求，请求路径 /login，请求体为 form（用户名和密码）
      const res = await request.post('/login',form)

      // 成功后，把返回的用户信息保存到 Pinia 中
      store.setUser(res.data)

      // 提示登录成功
      ElMessage.success('登录成功')

      // 跳转到dashboard页面
      router.push('/dashboard')
    }catch(error){
      // 如果出错，比如用户名或密码错误，显示失败消息
      ElMessage.error('登录失败')
    }
  }
  //跳转到注册页面
  const goRegister =() =>{
    router.push('/register')
  }
</script>

<style scoped>
  .login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-form {
  width: 300px;
}
</style>