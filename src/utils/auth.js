import Cookies from 'js-cookie'

const TokenKey = 'token'

export function GetToken() {
  return Cookies.get(TokenKey)
}

export function SetToken(token) {
  return Cookies.set(TokenKey, token, { expires: 7 })
}

export function RemoveToken() {
  return Cookies.remove(TokenKey)
}

export function SetUserInfo(user) {
  let userInfo = '';
  if (user) {
    userInfo = JSON.stringify(user)
  }
  return Cookies.set('userInfo', userInfo, { expires: 7 })
}

export function GetUserInfo() {
  let userInfoText = Cookies.get('userInfo')
  if (userInfoText) {
    return JSON.parse(userInfoText);
  }
  return '';
}

export function RemoveUserInfo() {
  return Cookies.remove('userInfo')
}

export function SetRoles(roles) {
  let userRoles = []
  if (roles) {
    userRoles = JSON.stringify(roles)
  }
  Cookies.set("roles", userRoles, { expires: 7 })
}

export function GetRoles() {
  let userRoles = Cookies.get("roles")
  if (userRoles) {
    return JSON.parse(userRoles)
  }
  return []
}

export function RemoveRoles() {
  Cookies.remove("roles")
}