<template>
   <h3>已发布作业列表</h3>

   <el-table :data="assignments" border style="width: 100%;">
      <el-table-column prop="title" label="标题"/>
      <el-table-column prop="description" label="内容"/>
      <el-table-column  label="截止日期">
        <template #default="{row}">
          {{ formatTime(row.deadline) }}
        </template>
      </el-table-column>
      <el-table-column label="发布时间">
        <template #default="{row}">
          {{ formatTime(row.create_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{row}">
          <el-button type="primary" size="small" @click="openEdiDialog(row)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
   </el-table>

   <!-- 修改弹窗 -->
    <el-dialog v-model="dialogVisible" title="修改作业" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="editForm.title"/>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="editForm.description" rows="5"/>
        </el-form-item>
        <el-form-item label="截止日期">
          <el-date-picker
            v-model="editForm.deadline"
            type="datetime"
            placeholder="选择日期时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitEdit">保存修改</el-button>
      </template>
    </el-dialog>
</template>

<script setup lang="ts">
  import {ref,onMounted} from 'vue'
  import request from '@/utils/request';
  import { ElMessage } from 'element-plus';
  import { useUserStore } from '@/stores/user';
  import dayjs from 'dayjs';
  import { ElMessageBox } from 'element-plus';

  const store = useUserStore()
  const assignments = ref([]) //作业列表数据
  const dialogVisible = ref(false)  //控制弹窗显示
  const editForm = ref({
    id:0,
    title:'',
    description:'',
    deadline:''
  })
  const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

  // 获取当前教师发布的作业列表
  const loadAssignments = async ()=> {
    try {
      // GET /assignment/list?teacherId=4
       /* 把当前教师的 ID（从登录信息里拿到）传给后端，后端收到这个请求后，
       就可以从数据库里找出属于该教师发布的作业记录 */
      const res = await request.get('/assignment/list',{
        params:{teacherId:store.id}
      })

      if(res.data.code === 200){
        assignments.value = res.data.data
      }else{
        ElMessage.error(res.data.message || '加载失败')
      }
    } catch (error) {
      console.error('获取作业失败:',error)
      ElMessage.error('网络错误')
    }
  }

  // 打开编辑弹窗，并预填当前行数据
  const openEdiDialog= (row:any) => {
    editForm.value = {
      id:row.id,
      title:row.title,
      description:row.description,
      deadline:dayjs(row.deadline).format('YYYY-MM-DD HH:mm:ss')
    }
    dialogVisible.value= true
  }

  // 提交修改请求
  const submitEdit = async() => {
    try {
      const res = await request.post('/assignment/update',editForm.value)
      if(res.data.code === 200){
        ElMessage.success('修改成功')
        dialogVisible.value=false
        await loadAssignments()//刷新列表
      }else{
        ElMessage.error(res.data.message || '修改失败')
      }
    } catch (error) {
      console.error('修改失败',error)
      ElMessage.error('请求失败')
    }
  }

  const handleDelete = async (row:any) => {
    try {
      // 先弹出确认框
      await ElMessageBox.confirm(
        '确认要删除这项作业吗？',
        '提示',
        {
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }
      )

      // 确认取消后执行删除请求
      const res = await request.delete(`/assignment/${row.id}`)

      if(res.data.code === 200){
        ElMessage.success('删除成功')
        loadAssignments()
      }else{
        ElMessage.error(res.data.message || '删除失败')
      }
    } catch (error) {
      console.log('取消删除',error)
      
    }
  }

  onMounted(() => {
    loadAssignments()
  })


</script>

<style scoped>
.assign-list-wrapper {
  padding: 30px;
}
</style>