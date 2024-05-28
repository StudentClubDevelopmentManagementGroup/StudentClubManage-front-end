import { defineStore } from 'pinia';
import { reactive, computed } from 'vue'
import { message } from "@/utils/message";

/**
 * @Description 缓存优化远程服务器请求访问机制
 * // TODO: 由于时间问题已废弃
 */
export const useFileStore = defineStore('file', () => {
    const state = reactive({
        fileUrlCache: new Map(), // 图片加载资源缓存
        filePromiseCache: new Map() // 图片请求缓存
    })

    const getFilePromiseCache = () => {
        return state.filePromiseCache
    }

    const getFilePromise = (key) => {
        return state.filePromiseCache.get(key)
    }

    const addFilePromiseCache = (key, val) => {

        state.filePromiseCache.set(key, val)
    }

    const delFilePromiseCache = (key) => {
        state.filePromiseCache.delete(key)
    }

    const getFileUrlCache = () => {
        return state.fileUrlCache
    }

    const getFileUrl = (key) => {
        return state.fileUrlCache.get(key)
    }

    const addFileUrlCache = (key, val) => {
        state.fileUrlCache.set(key, val)
    }

    const delFileUrlCache = (key) => {
        state.fileUrlCache.delete(key)
    }

    return {
        getFileUrlCache,
        getFileUrl,
        addFileUrlCache,
        delFileUrlCache,
        getFilePromiseCache,
        getFilePromise,
        addFilePromiseCache,
        delFilePromiseCache,
    }
}, {
    persistent: true,
});

