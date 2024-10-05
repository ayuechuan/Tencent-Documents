//  防抖函数
export function debounce(func: any, wait: number) {
  let timeout: NodeJS.Timeout;
  return () => {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}