<template>
  <div class="submit-homework">
    <el-card class="box-card">
      <div class="assignment-info">
        <h2>{{ assignment?.title }}</h2>
        <p>{{ assignment?.description }}</p>
        <p>截止时间：<strong>{{ formatTime(assignment?.deadline) }}</strong></p>
      </div>

      <el-divider />

      <!-- 上传 -->
      <el-upload
        class="upload-area"
        :show-file-list="true"
        :auto-upload="false"
        :on-change="handleFileChange"
        :http-request="customUpload"
        :file-list="fileList"
      >
        <el-button type="primary">选择文件</el-button>
      </el-upload>

      <el-button
        type="success"
        style="margin-top: 20px"
        :disabled="!uploadedFilename.value || uploading.value"
        @click="submitHomework"
      >
        提交作业
      </el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import request from "@/utils/request";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";

const route = useRoute();
const store = useUserStore();

const assignment = ref<any>({});
const fileList = ref<any[]>([]);
// const uploadedFilename = ref("");     // 系统保存名
// const uploadedFilename = ref<string>('');
// const uploading = ref<boolean>(false);
const uploadedFilename = ref<string>('');
const uploading = ref<boolean>(false);

const originalFilename = ref("");     // 原始名（中文）
// const uploading = ref(false);

const formatTime = (time: string) => dayjs(time).format("YYYY-MM-DD HH:mm:ss");

const fetchAssignment = async () => {
  const res = await request.get("/assignment/detail", {
    params: { id: route.query.id },
  });
  if (res.data.code === 200) {
    assignment.value = res.data.data;
  } else {
    ElMessage.error("获取作业信息失败");
  }
};

// 上传文件（在点击“选择文件”后自动触发）
const customUpload = async (option: any) => {
  uploading.value = true;
  const formData = new FormData();
  formData.append("file", option.file);
  try {
    const res = await request.post("/upload", formData);
    if (res.data.code === 200) {
      uploadedFilename.value = res.data.filename;
      originalFilename.value = res.data.originalName;
      ElMessage.success("上传成功，请点击提交作业完成提交");
    } else {
      ElMessage.error("上传失败");
    }
  } catch (e) {
    console.error("上传失败：", e);
    ElMessage.error("上传失败");
  } finally {
    uploading.value = false;
  }
};

const submitHomework = async () => {
  if (!uploadedFilename.value || !assignment.value?.id) {
    ElMessage.warning("请先上传文件再提交");
    return;
  }

  const formData = new FormData();
  formData.append("studentId", String(store.id));
  formData.append("assignmentId", String(assignment.value.id));
  formData.append("filename", uploadedFilename.value);
  formData.append("originalName", originalFilename.value);

  try {
    const res = await request.post("/submission", formData);
    if (res.data.code === 200) {
      ElMessage.success("提交成功");
    } else {
      ElMessage.error(res.data.message || "提交失败");
    }
  } catch (err) {
    console.error("提交异常：", err);
    ElMessage.error("提交异常");
  }
};

const handleFileChange = (file: any) => {
  fileList.value = [file];
};

onMounted(fetchAssignment);
</script>

<style scoped>
.submit-homework {
  max-width: 700px;
  margin: 40px auto;
}
.assignment-info p {
  font-size: 15px;
  color: #444;
}
.upload-area {
  margin-top: 20px;
}
</style>
