/**
 * @description 这个文件是废弃的文件，仅用于参考ElImage提供的部分API
 */
import {
    buildProps,
    definePropType,
    isNumber,
    mutable,
} from '@element-plus/utils'

import { ExtractPropTypes } from 'vue'

/** https://element-plus.org/zh-CN/component/image.html#image-attributes */
export const imageProps = buildProps({
    //** 当启用预览时，用于控制点击背景是否可以退出预览模式。 */
    hideOnClickModal: Boolean,
    /** 指定图片源（与原生 img 元素相同）*/
    src: {
        type: String,
        default: '',
    },
    /** 确定图片在容器中如何调整大小以适应（类似于 CSS 的 object-fit 属性） */
    fit: {
        type: String,
        values: ['', 'contain', 'cover', 'fill', 'none', 'scale-down'],
        default: '',
    },
    /** 指示浏览器如何加载图片（类似于原生的 loading 属性） */
    loading: {
        type: String,
        values: ['eager', 'lazy'],
    },
    /** 启用图片的懒加载 */
    lazy: Boolean,
    /** 在使用懒加载时，指定添加滚动监听的容器 */
    scrollContainer: {
        type: definePropType<string | HTMLElement | undefined>([String, Object]),
    },
    /** 允许大图预览，提供预览图片源的列表 */
    previewSrcList: {
        type: definePropType<string[]>(Array),
        default: () => mutable([] as const),
    },
    /** 确定是否将图片查看器附加到 body 中（适用于嵌套的父元素） */
    previewTeleported: Boolean,
    /** 设置图片预览的 z-index */
    zIndex: {
        type: Number,
    },
    /** 指定初始预览图片索引（在 url-list 中） */
    initialIndex: {
        type: Number,
        default: 0,
    },
    /** 确定查看器预览是否无限循环 */
    infinite: {
        type: Boolean,
        default: true,
    },
    /** 指定是否可以通过按下 ESC 键关闭图片查看器 */
    closeOnPressEscape: {
        type: Boolean,
        default: true,
    },
    /** 设置图片查看器缩放事件的缩放率 */
    zoomRate: {
        type: Number,
        default: 1.2,
    },
    /** 指定图片查看器缩放事件的最小缩放比例 */
    minScale: {
        type: Number,
        default: 0.2,
    },
    /** 指定图片查看器缩放事件的最大缩放比例 */
    maxScale: {
        type: Number,
        default: 7,
    },
    /** 设置 HTML 属性：crossorigin */
    crossorigin: {
        type: definePropType<'anonymous' | 'use-credentials' | ''>(String),
    },
} as const)

type ImageProps = ExtractPropTypes<typeof imageProps>

export const imageEmits = {
    //** 图片加载完成时触发 */
    load: (evt: Event) => evt instanceof Event,
    //** 图片加载失败时触发 */
    error: (evt: Event) => evt instanceof Event,
    //** 切换图片时触发 */
    switch: (val: number) => isNumber(val),
    //** 关闭图片查看器时触发 */
    close: () => true,
    //** 显示图片查看器时触发 */
    show: () => true,
}

type ImageEmits = typeof imageEmits

interface ImageOptions extends ImageProps {
    text: {
        type: String,
        default: ''
    }
}

export type { ImageProps, ImageEmits, ImageOptions }