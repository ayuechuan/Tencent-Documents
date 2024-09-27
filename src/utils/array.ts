/**
 * 转换成数组
 * @param item 
 * @returns 
 * @example
 * =====
 * formatToArray({name : 111}) ===> [{name : 111}]
 * =====
 */
export function formatToArray<T>(item: T | T[]): T[] {
  return Array.isArray(item) ? item : [item];
}

  