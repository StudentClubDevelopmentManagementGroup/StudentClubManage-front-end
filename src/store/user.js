import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import userApi from '@/api/user'
import { GetToken, SetToken, RemoveToken, GetUserInfo, RemoveUserInfo, SetUserInfo, RemoveRoles, SetRoles, GetRoles } from '@/utils/auth'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', () => {

  const state = reactive({
    currentPage: 0,
    token: GetToken(),
    userInfo: GetUserInfo(),
    roles: GetRoles()
  })

  const getCurrentPage = computed(() => state.currentPage);

  const getToken = computed(() => state.token);

  const getUserInfo = computed(() => state.userInfo);

  const getRoles = computed(() => state.roles);

  const getName = computed(() => state.userInfo.name);

  const setCurrentPage = (value) => {
    state.currentPage = value;
  }

  const resetState = () => {
    Object.assign(state, getDefaultState())
  }

  const setToken = (token) => {
    // state.token = token
    SetToken(token)
  }

  const setUserInfo = (userInfo) => {
    // state.userInfo = userInfo
    SetUserInfo(userInfo)
  }

  const setRoles = (roles) => {
    // state.roles = roles
    SetRoles(roles)
  }

  const logout = async () => {
    return new Promise((resolve, reject) => {
      userApi.logout()
        .then(() => {
          state.token = null
          state.userInfo = null
          state.roles = []
          RemoveUserInfo()
          RemoveToken()
          RemoveRoles()
          resolve()
        })
        .catch((error) => {
          reject(error);
        })
    })
  }


  const login = async (userInfo) => {
    const { user_id, pwd } = userInfo
    let userLoginDTO = {
      user_id: user_id.trim(),
      pwd: pwd
    }
    return new Promise((resolve, reject) => {
      userApi.login(userLoginDTO).then((data) => {
        if (data !== null) {
          state.token = data.token
          state.userInfo = data.user_info
          state.roles = data.user_info.role
          setToken(data.token)
          setUserInfo(data.user_info)
          setRoles(data.user_info.role)
        } else {
          ElMessage({
            message: '账号或密码错误',
            type: 'error',
            duration: 2500
          })
        }
        resolve()
      }).catch(error => {
        reject(error);
      });
    })
  }



  const updateUserInfo = (newUserInfo) => {
    SetUserInfo(newUserInfo)
  }

  return {
    resetState,
    setCurrentPage,
    logout,
    login,
    updateUserInfo,
    getCurrentPage,
    getToken,
    getUserInfo,
    getRoles,
    getName
  }
}, {
  persistent: true,
})
