// 本文件用于格式化特定的时间字符串
export default {
    formatDate(val) {
        if (typeof val !== 'undefined') {
            let dateStr = val.toLocaleString('zh-CN', {
                hour12: false,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
            //替换日期分隔符
            dateStr = dateStr.replace(/\//g, '-');

            return dateStr + " "
        } else {
            return ""
        }
    },
    getNowDatetime() {
        return new Date().toLocaleString('zh-CN', {
            hour12: false,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).replace(/\//g, '-');
    },
    getNowTime() {
        return new Date().toLocaleString('zh-CN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }) + " "
    }
}