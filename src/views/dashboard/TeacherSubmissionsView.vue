<!-- 展示某个作业的学生提交记录 -->
<template>
  <div class="teacher-submissions-view">
    <h2 style="margin-bottom: 20px">学生提交记录</h2>

    <el-table :data="submissions" v-loading="loading" style="width: 100%">
      <el-table-column prop="studentName" label="学生姓名" />
      <el-table-column label="提交时间">
        <template #default="{ row }">
          <span v-if="row.submittedAt">{{ formatTime(row.submittedAt) }}</span>
          <span v-else>未提交</span>
        </template>
      </el-table-column>
      <el-table-column label="文件名">
        <template #default="{ row }">
          <a
            v-if="row.filename"
            :href="`http://localhost:3000/uploads/${row.filename}`"
            target="_blank"
          >
            {{ row.originalName }}
          </a>
          <span v-else style="color: #999">未上传</span>
        </template>
      </el-table-column>
    </el-table>

    <el-empty
      v-if="!loading && submissions.length === 0"
      description="暂无提交记录"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import request from "@/utils/request";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
const route = useRoute();
const submissions = ref<any[]>([]);
const loading = ref(false);
// 时间格式化
const formatTime = (time: string) => {
  return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
};
const assignmentId = route.query.assignmentId;

// const fileDownloadUrl = (filename: string) => {
//   return `http://localhost:3000/uploads/${filename}`
// }

const fetchSubmissions = async () => {
  if (!assignmentId) {
    ElMessage.error("缺少作业 ID");
    return;
  }

  loading.value = true;
  try {
    const res = await request.get("/submission/list", {
      params: { assignmentId },
    });
    console.log(submissions.value)

    if (res.data.code === 200) {
      submissions.value = res.data.data;
    } else {
      ElMessage.error(res.data.message || "获取提交记录失败");
    }
  } catch (error) {
    console.error("请求出错：", error);
    ElMessage.error("网络错误");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSubmissions);
</script>

<style scoped>
.teacher-submissions-view {
  padding: 20px;
}
</style>
