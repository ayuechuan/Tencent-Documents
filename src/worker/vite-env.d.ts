/// <reference types="vite/client" />

declare const __WORKER__: boolean

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Vite worker 导入类型
declare module '*?worker' {
  const workerConstructor: string
  export default workerConstructor
}