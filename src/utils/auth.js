import Cookies from 'js-cookie'

const TokenKey = 'guet-s-c-m-s-token'

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

export function getClub() {
  let currentClub = Cookies.get("currentClub")
  if (currentClub) {
    return JSON.parse(currentClub)
  } else {
    return null
  }
}

export function setClub(club) {
  let currentClub = {}
  if (club) {
    currentClub = JSON.stringify(club)
  }
  Cookies.set("currentClub", currentClub)
}

export function removeClub() {
  Cookies.remove("currentClub")
}

export function removeParams() {
  Cookies.remove("p")
}

export function getParams() {
  let params = Cookies.get("p")
  if (params) {
    return JSON.parse(params)
  } else {
    return null
  }
}

export function setParams(params) {
  let currentParams = {}
  if (params) {
    currentParams = JSON.stringify(params)
  }
  Cookies.set("p", currentParams)
}

export function removeRoute() {
  Cookies.remove("r")
}

export function getRoute() {
  let route = Cookies.get("r")
  if (route) {
    return JSON.parse(route)
  } else {
    return null
  }
}

export function setRoute(route) {
  let currentRoute = {}
  if (route) {
    currentRoute = JSON.stringify(route)
  }
  Cookies.set("r", currentRoute)
}