import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import Dashboard from '@/views/Dashboard.vue'
import CheckView from '@/views/dashboard/CheckView.vue'
import ProfileView from '@/views/dashboard/ProfileView.vue'
import TeacherCheckView from '@/views/dashboard/TeacherCheckView.vue'
import AllHistoryView from '@/views/dashboard/TeacherAllHistoryView.vue'
import TeacherWelcome from '@/views/dashboard/TeacherWelcome.vue'
import AssignHomeworkView from '@/views/dashboard/TeacherAssignHomeworkView.vue'
import TeacherAssignments from '@/views/dashboard/TeacherAssignments.vue'
import AssignListView from '@/views/dashboard/TeacherAssignListView.vue'
import StudentHomeworkList from '@/views/dashboard/StudentHomeworkList.vue'

const routes: RouteRecordRaw[] = [
  // 重定向 用户访问时直接跳转到登录页面
  {
    path: '/',
    redirect: '/login' 
  },
  { 
    path: '/login', 
    component: LoginView 
  },
  { 
    path: '/register', 
    component: RegisterView 
  },
  // {
  //   path:'/dashboard/assign',
  //   component:AssignHomeworkView
  // },
  { 
    path: '/dashboard', 
    component: Dashboard,
    children:[
      {
        path:'',
        redirect:'check'
      },
      {
        path:'welcome',
        component:TeacherWelcome
      },
      {
        path:'check',
        component:CheckView
      },
      {
        path:'profile',
        component:ProfileView
      },
       { 
        path: 'all-history', 
        component: AllHistoryView 
      },
      {
        path:'assign',
        component:AssignHomeworkView
      },
      {
        path:'teacher-assignments',
        component:TeacherAssignments
      },
      {
        path:'assignment-list',
        component:AssignListView
      },
      {
        path:'student-homework',
        component:StudentHomeworkList
      }
    ]
  },
  {
    path:'/dashboard/teacher-check',
    component:TeacherCheckView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})



export default router
