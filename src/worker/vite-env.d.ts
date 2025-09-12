/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_PUBLIC_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Vite worker 导入类型
declare module '*?worker' {
  const workerConstructor: string
  export default workerConstructor
}

// Worker 全局声明
declare var self: any
declare function importScripts(...urls: string[]): void