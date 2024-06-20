const getConfig = () => {
  return {
    "Version": "5.1.0",
    "FixedHeader": true,
    "HiddenSideBar": false,
    "MultiTagsCache": false,
    "KeepAlive": true,
    "Layout": "vertical",
    "Theme": "light",
    "DarkMode": false,
    "OverallStyle": "light",
    "Grey": false,
    "Weak": false,
    "HideTabs": false,
    "HideFooter": false,
    "HideHeader": false,
    "SidebarStatus": true,
    "EpThemeColor": "#409EFF",
    "ShowLogo": true,
    "ShowModel": "smart",
    "MenuArrowIconNoTransition": false,
    "CachingAsyncRoutes": false,
    "TooltipEffect": "light",
    "ResponsiveStorageNameSpace": "responsive-",
    "MenuSearchHistory": 6,
    "MapConfigure": {
      "amapKey": "97b3248d1553172e81f168cf94ea667e",
      "options": {
        "resizeEnable": true,
        "center": [113.6401, 34.72468],
        "zoom": 12
      }
    }
  }
}

const responsiveStorageNameSpace = () => getConfig().ResponsiveStorageNameSpace;

const CONFIG = {
  development: {
    baseUrl: 'http://localhost:3333',
    serverUrl: 'http://localhost:5173',
    logo: 'http://localhost:5173/icon.jpeg',
    avatar: 'http://localhost:8080/header4.gif',
    emptyImg: 'http://localhost:8080/empty.png',
    qrCodeUrlPrefix: 'http://localhost:8080?target=',
    superAdmin: ["/welcome", "/teacher", "/run", "/develop", "/user", "/introduce"],
    admin: ["/welcome", "/run", "/develop", "/user", "/introduce", "/member"],
    member: ["/welcome", "/member"]
  },
  production: {
    serverUrl: '//TODO:待确定的生产环境域名或url',
    baseUrl: 'http://121.37.9.218:3333',
    logo: 'http://121.37.9.218/logo.png',
    avatar: 'http://121.37.9.218/header4.gif',
    emptyImg: 'http://121.37.9.218/empty.png',
    qrCodeUrlPrefix: 'https://www.mushanyu.xyz:8800?target=',
    superAdmin: ["/welcome", "/run", "/develop", "/user", "/introduce", "/teacher"],
    admin: ["/welcome", "/run", "/develop", "/user", "/introduce", "/member"],
    member: ["/welcome", "/member"]
  }
}

export { getConfig, responsiveStorageNameSpace };
export default CONFIG[process.env.NODE_ENV];