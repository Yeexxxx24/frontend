//作用：用 Pinia 来管理全局“用户状态”（登录信息）

// 引入 Pinia 的核心函数，用 defineStore() 来“创建一个全局状态模块”。
import { defineStore } from "pinia";

// 定义状态类型
interface UserState { //用 TS 明确规定状态数据长啥样
  token:string
  username:string
  role:'student' | 'teacher' | ''
}

// 创建store对象本体，用于管理用户状态
export const useUserStore = defineStore('user',{
  // state: (): UserState => ({ ... })
  //这个 state 必须符合 UserState 接口里的结构和类型定义
  state:():UserState => ({
    token:'',
    username:'',
    role:''
  }),
  actions:{  //对状态做什么操作
    // 登录后写入用户信息
    setUser(data:UserState){
      this.token = data.token
      this.username = data.username
      this.role = data.role
    },
    // 退出登录时清空用户信息
    clearUser(){
      this.token = ''
      this.username = ''
      this.role = ''
    }
  }
})