// 本文件用于格式化特定的文本
export default {
  extractSummary(htmlContent, maxLength = 180) {
    // 使用正则表达式移除 HTML 标签
    const textContent = htmlContent.replace(/<\/?[^>]+(>|$)/g, "");
    // 截取前200个字符
    return textContent.substring(0, maxLength);
  },
};
