import type { AxiosRequestConfig, CreateAxiosDefaults } from 'axios'

//  必填类型
type PickCreateAxiosDefaults = Required<Pick<CreateAxiosDefaults, 'url'>>
type IonUploadProgress = Pick<CreateAxiosDefaults, 'onUploadProgress'>

export interface Upload extends PickCreateAxiosDefaults, IonUploadProgress {
  formData: FormData
  controller?: AbortController
}

export interface UploadStream extends PickCreateAxiosDefaults, IonUploadProgress {
  file: File
  controller?: AbortController
}

export interface AxiosDownload extends Pick<CreateAxiosDefaults, 'onDownloadProgress'> {
  url: string
  data?: object
  fileName?: string //用于自定义文件名
  otherConfig?: AxiosRequestConfig
  controller?: AbortController
}

export interface UrlDownload {
  fileUrl: string
  fileName: string
  serveBaseUrl?: string
}

export abstract class BaseInterceptors {
  /**
   * 失败重试拦截器
   * @param config
   */
  abstract retryInterceptors?: (config: AxiosRequestConfig) => void

  /**
   * 数据缓存 && 重复请求 拦截器
   */
  abstract useCacheInterceptors?: (config: AxiosRequestConfig) => void
}
