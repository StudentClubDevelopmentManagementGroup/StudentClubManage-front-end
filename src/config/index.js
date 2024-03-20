import axios from "axios";

let config = {};
const VITE_PUBLIC_PATH = import.meta.env.VITE_PUBLIC_PATH;

const setConfig = (cfg) => {
  config = Object.assign(config, cfg);
};

const getConfig = (key) => {
  if (typeof key === "string") {
    const arr = key.split(".");
    if (arr && arr.length) {
      let data = config;
      arr.forEach((v) => {
        if (data && typeof data[v] !== "undefined") {
          data = data[v];
        } else {
          data = null;
        }
      });
      return data;
    }
  }
  return config;
};

// 获取项目动态全局配置
export const getPlatformConfig = async (app) => {
  app.config.globalProperties.$config = getConfig();
  try {
    const response = await axios({
      method: "get",
      url: `${VITE_PUBLIC_PATH}platform-config.json`,
    });
    let $config = app.config.globalProperties.$config;
    // 自动注入项目配置
    if (app && $config && typeof response.data === "object") {
      $config = Object.assign($config, response.data);
      app.config.globalProperties.$config = $config;
      // 设置全局配置
      setConfig($config);
    }
    return $config;
  } catch (error) {
    throw new Error("请在public文件夹下添加platform-config.json配置文件");
  }
};

// 本地响应式存储的命名空间
const responsiveStorageNameSpace = () => getConfig().ResponsiveStorageNameSpace;

const CONFIG = {
  development: {
    baseUrl: 'http://121.37.9.218:8500',
    logo: 'http://localhost:5173/icon.jpeg',
    avatar: 'http://localhost:8080/header4.gif',
    emptyImg: 'http://localhost:8080/empty.png',
    qrCodeUrlPrefix: 'http://localhost:8080?target=',
  },
  production: {
    baseUrl: 'http://121.37.9.218:8500',
    logo: 'http://121.37.9.218/logo.png',
    avatar: 'http://121.37.9.218/header4.gif',
    emptyImg: 'http://121.37.9.218/empty.png',
    qrCodeUrlPrefix: 'https://www.mushanyu.xyz:8800?target=',
    roomExcelHref: 'https://mushanyu-file-save.oss-cn-beijing.aliyuncs.com/project/apply-room-record/%E6%88%BF%E9%97%B4%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx',
    userExcelHref: 'https://mushanyu-file-save.oss-cn-beijing.aliyuncs.com/project/apply-room-record/%E4%BA%BA%E5%91%98%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'
  }
}

export { getConfig, setConfig, responsiveStorageNameSpace };
export default CONFIG[process.env.NODE_ENV];