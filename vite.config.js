import { getPluginsList } from "./build/plugins";
import { loadEnv } from "vite";
import path from 'path'
import { fileURLToPath, URL } from "url";

import {
  root,
  warpperEnv,
  __APP_INFO__
} from "./build/utils";
// https://vitejs.dev/config/
export default (mode) => {
  const { VITE_CDN, VITE_PORT, VITE_COMPRESSION, VITE_PUBLIC_PATH } =
    warpperEnv(loadEnv(mode, root));
  return {
    resolve: {
      // 类型：Record<string, string> | Array<{ find: string | RegExp, replacement: string }> 将会被传递到 @rollup/plugin-alias 作为它的 entries。
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, 'src')
      },
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.mjs'] // 类型： string[] 导入时想要省略的扩展名列表。
    },
    plugins: getPluginsList(VITE_CDN, VITE_COMPRESSION),
    optimizeDeps: {
      include: ["@wangeditor/editor-for-vue", "@wangeditor/editor"],
    },
  }
};
