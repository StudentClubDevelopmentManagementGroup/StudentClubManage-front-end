import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import userApi from '@/api/user'
// import { getToken, setToken, removeToken, getUserInfo, removeUserInfo, setUserInfo, removeRoles, setRoles, getRoles } from '@/utils/auth'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
export const useUserStore = defineStore('user', () => {

  const state = reactive({
    currentPage: 0,
    token: "",
    userInfo: "",
    roles: ""
  })

  const getCurrentPage = computed(() => state.currentPage);
  const getToken = computed(() => state.token);
  const getUserInfo = computed(() => state.userInfo);
  const getRoles = computed(() => state.roles);

  const setCurrentPage = (value) => {
    state.currentPage = value;
  }

  const ResetState = () => {
    Object.assign(state, getDefaultState())
  }

  const SetToken = (token) => {
    // state.token = token
    setToken(token)
  }

  const SetUserInfo = (userInfo) => {
    // state.userInfo = userInfo
    setUserInfo(userInfo)
  }

  const SetRoles = (roles) => {
    // state.roles = roles
    setRoles(roles)
  }

  const Logout = async () => {
    try {
      await userApi.logout()
      state.token = null
      state.userInfo = null
      state.roles = []
      removeUserInfo()
      removeToken()
      removeRoles()
      router.replace('/login')
    } catch (error) {
      console.error(error)
    }
  }

  const Login = async (userInfo) => {
    const { act, pwd } = userInfo
    return new Promise((resolve, reject) => {
      let userLoginDTO = {
        act: act.trim(),
        pwd: pwd
      }
      userApi.login(userLoginDTO).then(data => {
        console.log(data);
        if (data !== null) {
          state.token = data.token
          state.userInfo = data.user
          state.roles = data.user.identification
          setToken(data.token)
          setUserInfo(data.user)
          setRoles(data.user.identification)
          resolve()
        } else {
          ElMessage({
            message: '账号或密码错误',
            type: 'error',
            duration: 2500
          })
          reject()
        }
      }).catch(error => {
        ElMessage({
          message: error,
          type: 'error',
        })
      })
    })
  }

  const UpdateUserInfo = (newUserInfo) => {
    setUserInfo(newUserInfo)
  }

  return {
    state,
    ResetState,
    SetToken,
    SetUserInfo,
    SetRoles,
    setCurrentPage,
    Logout,
    Login,
    UpdateUserInfo,
    getCurrentPage,
    getToken,
    getUserInfo,
    getRoles,
  }
}, {
  persistent: true,
})
