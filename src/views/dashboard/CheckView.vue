<template>
  <div class="check-wrapper">
    <!-- 左侧：上传文件区域 -->
    <div class="left-panel">
      <el-upload
        class="upload-area"
        drag
        action="#"
        :show-file-list="false"
        :before-upload="handleUpload"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
      </el-upload>

      <!-- 显示上传文件名 -->
      <el-alert
        v-if="fileName"
        title="已上传文件："
        :description="fileName"
        type="info"
        show-icon
        class="uploaded-file"
      />
    </div>

    <!-- 右侧：说明 + 查重结果 -->
    <div class="right-panel">
      <el-card class="description">
        <p>📌 上传代码文件后系统将自动进行相似度检测。</p>
        <p>支持格式：.txt、.js、.java、.cpp 等</p>
      </el-card>

      <el-card class="result" v-if="result">
        <h3>查重结果：</h3>
        <p>相似度：{{ result.similarity }}%</p>
        <p>匹配文件：{{ result.matchedFile }}</p>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const fileName = ref<string>('') // 显示上传的文件名
const result = ref<null | { similarity: number; matchedFile: string }>(null)

// 模拟上传处理
const handleUpload = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file) // 👈 这里的 'file' 对应后端的字段名

  try {
    const res = await request.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    // 成功后保存文件名并提示
    fileName.value = file.name
    ElMessage.success(`上传成功：${file.name}`)

    // 可选：模拟结果（后续会替换成后端返回结果）
    result.value = {
      similarity: 78.5,
      // matchedFile: res.data.filename || 'unknown'
      matchedFile:res.data.originalName
      
    }
    console.log('✅ 上传成功，原名为：', res.data.originalName)

  } catch (err) {
    console.error('上传失败', err)
    ElMessage.error('上传失败，请重试')
  }

   return false // 仍然阻止默认上传行为
  } 

</script>

<style scoped>
.check-wrapper {
  display: flex;
  gap: 30px;
  padding: 30px;
}

/* 左侧上传区 */
.left-panel {
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.upload-area {
  width: 100%;
}
.uploaded-file {
  width: 100%;
}

/* 右侧信息区 */
.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.description, .result {
  width: 100%;
}
</style>
