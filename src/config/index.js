const getConfig = () => {
  return {
    "Version": "3.1.0",
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
    baseUrl: 'http://129.204.250.70:8888',
    serverUrl: 'http://129.204.250.70:8888',
    logo: 'http://129.204.250.70:8888/icon.jpeg',
    avatar: 'http://129.204.250.70:8888/header4.gif',
    emptyImg: 'http://129.204.250.70:8888/empty.png',
    qrCodeUrlPrefix: 'http://129.204.250.70:8888?target=',
    superAdmin: ["/welcome", "/teacher", "/run", "/develop", "/user", "/introduce","/member"],
    admin: ["/welcome", "/run", "/develop", "/user", "/introduce", "/member"],
    member: ["/welcome", "/member"]
  },
  production: {
    baseUrl: 'http://129.204.250.70:8888',
    serverUrl: 'http://129.204.250.70:8888',
    logo: 'http://129.204.250.70:8888/icon.jpeg',
    avatar: 'http://129.204.250.70:8888/header4.gif',
    emptyImg: 'http://129.204.250.70:8888/empty.png',
    qrCodeUrlPrefix: 'http://129.204.250.70:8888?target=',
    superAdmin: ["/welcome", "/teacher", "/run", "/develop", "/user", "/introduce","/member"],
    admin: ["/welcome", "/run", "/develop", "/user", "/introduce", "/member"],
    member: ["/welcome", "/member"]
  }
}

export { getConfig, responsiveStorageNameSpace };
export default CONFIG[process.env.NODE_ENV];