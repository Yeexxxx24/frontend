<template>
  <div class="submit-homework">
    <el-card class="box-card">
      <div class="assignment-info">
        <h2>{{ assignment?.title }}</h2>
        <p>{{ assignment?.description }}</p>
        <p style="margin-top: 10px;">截止时间：<strong>{{ formatTime(assignment?.deadline) }}</strong></p>
      </div>

      <el-divider />

      <el-upload
        class="upload-area"
        :show-file-list="true"
        :http-request="customRequest"
        :auto-upload="false"
        :on-change="handleFileChange"
        :file-list="fileList"
      >
        <el-button type="primary">选择文件</el-button>
      </el-upload>

      <el-button
        type="success"
        style="margin-top: 20px;"
        :disabled="!file"
        @click="submitHomework"
      >
        提交作业
      </el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import request from '@/utils/request'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const route = useRoute()
const store = useUserStore()

const assignment = ref<any>({})
const file = ref<File | null>(null)
const fileList = ref<any[]>([])

// 格式化时间
const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

// 获取作业详情
const fetchAssignment = async () => {
  const assignmentId = route.query.id
  if (!assignmentId) return

  try {
    const res = await request.get('/assignment/detail', {
      params: { id: assignmentId }
    })
    if (res.data.code === 200) {
      assignment.value = res.data.data
    } else {
      ElMessage.error(res.data.message || '获取作业信息失败')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('网络错误')
  }
}

// 提交作业
const submitHomework = async () => {
  if (!file.value || !assignment.value?.id) return

  const formData = new FormData()
  formData.append('studentId', String(store.id))
  formData.append('assignmentId', String(assignment.value.id))
  formData.append('file', file.value)

  try {
    const res = await request.post('/submission', formData)
    if (res.data.code === 200) {
      ElMessage.success('提交成功')
    } else {
      ElMessage.error(res.data.message || '提交失败')
    }
  } catch (err) {
    console.error(err)
    ElMessage.error('提交异常')
  }
}

// 自定义上传拦截，阻止自动上传行为
const customRequest = () => {
  // 不需要实际上传，submitHomework 会处理
}

// 处理文件变化
const handleFileChange = (uploadFile: any) => {
  file.value = uploadFile.raw
}

onMounted(fetchAssignment)
</script>

<style scoped>
.submit-homework {
  max-width: 700px;
  margin: 40px auto;
}
.assignment-info h2 {
  margin-bottom: 10px;
}
.assignment-info p {
  font-size: 15px;
  color: #444;
}
.upload-area {
  margin-top: 20px;
}
</style>
