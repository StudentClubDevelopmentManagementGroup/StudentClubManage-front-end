// 本文件用于格式化特定的时间字符串
export default {
    formatDate(val) {
        let dateStr = val.toLocaleString('zh-CN', {
            hour12: false,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        //替换日期分隔符
        dateStr = dateStr.replace(/\//g, '-');

        return dateStr
    },
    // 加上X小时
    plusHours(date, hours) {
        var dateTime = new Date(date);
        var nextDateTime = new Date(dateTime.getTime());
        nextDateTime.setHours(dateTime.getHours() + hours);

        if (nextDateTime.getDate() > dateTime.getDate()) {
            dateTime.setHours(23, 59, 59);
            return this.formatDate(dateTime)
        }

        return this.formatDate(nextDateTime)
    },
    // 同一日期条件下，date1 是否大于 date2
    isPass(date1, date2) {
        var date1 = new Date(date1)
        var date2 = new Date(date2)

        date2.setFullYear(date1.getFullYear());
        date2.setMonth(date1.getMonth());
        date2.setDate(date1.getDate());

        return date1 > date2;
    },
    // 同一日期下，date1 是否等于 date2
    isSameTime(date1, date2) {
        var date1 = new Date(date1)
        var date2 = new Date(date2)

        var time1 = date1.toTimeString().split(' ')[0];
        var time2 = date2.toTimeString().split(' ')[0];
        return time1 === time2;
    },
    // 加上X小时
    plusHours(date, hours) {
        var dateTime = new Date(date);
        var nextDateTime = new Date(dateTime.getTime());
        nextDateTime.setHours(dateTime.getHours() + hours);

        if (nextDateTime.getDate() > dateTime.getDate()) {
            dateTime.setHours(23, 59, 59);
            return this.formatDate(dateTime)
        }

        return this.formatDate(nextDateTime)
    },
    // 同一日期条件下，date1 是否大于 date2
    isPass(date1, date2) {
        var date1 = new Date(date1)
        var date2 = new Date(date2)

        date2.setFullYear(date1.getFullYear());
        date2.setMonth(date1.getMonth());
        date2.setDate(date1.getDate());

        return date1 > date2;
    },
    // 同一日期下，date1 是否等于 date2
    isSameTime(date1, date2) {
        var date1 = new Date(date1)
        var date2 = new Date(date2)

        var time1 = date1.toTimeString().split(' ')[0];
        var time2 = date2.toTimeString().split(' ')[0];
        return time1 === time2;
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
    },
    // 将秒转化为`${}小时${}分钟${}秒`
    formatTime(val) {
        const hours = Math.floor(val / 3600);
        const minutes = Math.floor((val % 3600) / 60);
        const seconds = val % 60;
        return `${hours}小时${minutes}分钟${seconds}秒`;
    },
    formatTime2(val) {
        const date = val ? new Date(val) : new Date;
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`
    },
    formatDate2(val) {
        const date = val ? new Date(val) : new Date;
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    formatDate3(val) {
        const date = new Date(val)
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    },
    constructUrl(basePath, queryParams) {
        // 检查basePath是否已经有查询参数（即是否包含?）  
        let hasExistingQuery = basePath.indexOf('?') !== -1;

        // 构建URL查询参数params
        let queryString = ''
        if (queryParams) {
            // 使用 URLSearchParams 来安全地构建查询字符串  
            const params = new URLSearchParams();
            for (const [key, value] of Object.entries(queryParams)) {
                params.append(key, value);
            }
            queryString = params.toString();
        }
        // 如果basePath已经有查询参数，使用&连接新参数；否则使用?  
        return basePath + (queryString && (hasExistingQuery ? '&' : '?') + queryString);
    }
}