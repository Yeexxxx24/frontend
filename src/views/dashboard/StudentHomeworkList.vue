<template>
  <div class="homework-wrapper">
    <div class="header">
      <h3>作业列表</h3>
      <el-select v-model="filter" placeholder="筛选" @change="filterList">
        <el-option label="全部" value="all" />
        <el-option label="已提交" value="submitted" />
        <el-option label="未提交" value="unsubmitted" />
      </el-select>
    </div>

    <el-table :data="filteredAssignments" style="width: 100%">
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="截止时间">
        <template #default="{ row }">{{ formatTime(row.deadline) }}</template>
      </el-table-column>
      <el-table-column label="提交状态">
        <template #default="{ row }">
          <el-tag :type="row.submitted ? 'success' : 'danger'">
            {{ row.submitted ? '已提交' : '未提交' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="goSubmit(row.id)">提交作业</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

const store = useUserStore()
const router = useRouter()

const allAssignments = ref<any[]>([])         // 后端返回的完整作业数据
const filteredAssignments = ref<any[]>([])    // 页面上实际展示的
const filter = ref('all')                     // 当前筛选条件：all / submitted / unsubmitted

// 格式化时间
const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

// 查询所有作业，并判断每条作业是否已提交
const fetchAssignments = async () => {
  try {
    //向后端接口 GET /assignment/all 发送请求 获取所有作业
    const res = await request.get('/assignment/all') 
    if (res.data.code === 200) {
      const assignments = res.data.data

      // 对每个作业查询提交状态
      for (const item of assignments) {
        const subRes = await request.get('/submission/status', {
          params: {
            assignmentId: item.id,
            studentId: store.id
          }
        })
        item.submitted = subRes.data.data?.submitted || false
      }

      allAssignments.value = assignments
      filterList() // 初始渲染筛选
    } else {
      ElMessage.error(res.data.message || '获取作业失败')
    }
  } catch (err) {
    console.error('获取作业失败', err)
    ElMessage.error('请求错误')
  }
}

// 筛选函数
const filterList = () => {
  if (filter.value === 'all') {
    filteredAssignments.value = allAssignments.value
  } else {
    filteredAssignments.value = allAssignments.value.filter(item =>
      filter.value === 'submitted' ? item.submitted : !item.submitted
    )
  }
}

// 点击“提交作业”按钮跳转
const goSubmit = (assignmentId: number) => {
  router.push(`/dashboard/submit/${assignmentId}`)
}

// 页面挂载时获取数据
onMounted(() => {
  fetchAssignments()
})
</script>

<style scoped>
.homework-wrapper {
  padding: 30px;
}
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
