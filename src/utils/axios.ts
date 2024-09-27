import axios, { AxiosError, AxiosInstance, AxiosProgressEvent, AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders, AxiosResponseTransformer, Canceler, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios';
import { AxiosDownload, Upload, UploadStream, UrlDownload } from './axios.model';
import { RequestQueue } from './axios.queue';
import { message } from 'tdesign-react';
import { BaseInterceptors } from './axios.model';

abstract class IErrorInfos {
  public readonly abstract code: number;
  public readonly abstract message: string;
  cause?: string;
  detail?: string;
}

//  封装 axios reponse error 实例
export class HttpResponesError implements IErrorInfos {
  code!: number;
  //  一般信息
  message!: string;
  cause?: string;
  //  详细错误信息
  detail?: string;
  response?: AxiosResponse;

  constructor(error: Partial<HttpResponesError>) {
    Object.assign(this, error);
  }

  public openMessage(custom?: (error: HttpResponesError) => void): void
  public openMessage(tips?: string): void
  public openMessage(tips?: string | ((error: HttpResponesError) => void)): void {
    if (typeof tips === 'string') {
      const error = tips ?? this.message;
      message.error(error);
    } else {
      //  自定义当前错误显示结果
      tips?.(this);
    }
  }

  //  模态框显示错误
  public showModal(tips?: string) {

  }

}

export class AxiosErrorModel<T = void> {
  data?: T;
  error?: HttpResponesError;

  static async callbackArray<CT>(promise: Promise<CT>): Promise<[null, CT] | [HttpResponesError, null]> {
    return promise
      .then<[null, CT]>((data: CT) => [null, data])
      .catch<[HttpResponesError, null]>((err: HttpResponesError) => [err, null]);
  }

  static async callbackArray_body<CT>(promise: Promise<AxiosResponse<CT>>): Promise<[null, AxiosErrorModelWithHeder<CT>] | [AxiosErrorModelWithHeder, null]> {
    return promise
      .then<[null, AxiosErrorModelWithHeder<CT>]>((data) => [null, data])
      .catch<[AxiosErrorModelWithHeder, null]>((err: AxiosErrorModelWithHeder) => [err, null]);
  }


};


export class AxiosErrorModelWithHeder<T = void> extends AxiosErrorModel<T> {
  response?: AxiosResponse<T, void>;
}


/**
 * 封装基本的拦截器
 * 如果持续扩展 请自行实现 {@link BaseInterceptors}
 */
class Instace {
  //  请求队列
  protected readonly requestQueue = new RequestQueue();
  public instace: AxiosInstance;
  constructor(
    public readonly key = '/',
    private readonly config: CreateAxiosDefaults &
    {/** 重写baseURL类型 为了获得类型提示 */ baseURL?: ERequestKeys } = {},
    private readonly otherConfig: Partial<{
      isRefreshToken: boolean
    }> = { isRefreshToken: false }
  ) {
    const transformResponse = (data: any, headers: AxiosResponseHeaders) => {
      //  如果data?.size超过了浏览器最大安全数
      if (data?.size > Number.MAX_SAFE_INTEGER) {
        return {
          size: BigInt(data?.size)
        }
      }
      return data;
    }
    const transformResponseArray = axios.defaults.transformResponse! as (AxiosResponseTransformer[]);
    this.instace = axios.create({
      ...this.config,
      transformResponse: [...transformResponseArray, transformResponse]
    });
    //  拦截器 manager
    this.initInterceptors();
  }


  /**
   * 新添加一个请求拦截器
   * @description 由于请求拦截器是有顺序的  
   * 所以如果需要确定当前拦截器顺序 需要清除原有全部拦截器 重新分配拦截器
   * @param cb 
   * @returns 
   */
  public addInterceptor(cb?: Parameters<typeof axios.interceptors.request.use>[0]) {
    if (!cb) {
      return;
    }
    this.instace.interceptors.request.clear();
    const interceptorItem = this.instace.interceptors.request.use(cb.bind(this));
    return () => {
      this.instace.interceptors.request.eject(interceptorItem);
    }
  }



  //  准备好请求和响应拦截器
  private initInterceptors() {
    const { isRefreshToken } = this.otherConfig;
    const requestInterceptors = new Map([
      [() => isRefreshToken, () => {
        //  刷新 token
        this.instace.interceptors.request.use((config) => {
          let canceler!: Canceler;
          const assignConfig = Object.assign({}, config, {
            cancelToken: new axios.CancelToken((cancel) => {
              canceler = cancel;
            }),
          });
          config.headers['Authorization'] = '456'

          this.requestQueue.addRequest('', Object.assign({}, assignConfig, canceler));
          return config;
        })
      }],
      [() => true, () => {
        //  基础请求拦截器
        this.instace.interceptors.request.use((config) => {
          config.headers.setAuthorization(`123`)
          return config;
        })
      }
      ]
    ]);

    const reverseInterceptors = Array.from(requestInterceptors.entries());
    reverseInterceptors.forEach(([k, v]) => {
      if (k()) {
        v?.();
      }
    });


    const responseInterceptors = new Map([
      [() => true, () => {
        this.instace.interceptors.response.use((response) => {
          return response;
        }, (error: AxiosError) => {
          console.error('error111111', error, error.response);
          const response = error.response as AxiosResponse<HttpResponesError>;
          //  其他未知错误
          if (!response) {
            //  网络异常
            if (!navigator.onLine) {
              return new HttpResponesError(response).openMessage('网络异常！');
            }
            // 未知错误
            return Promise.reject(new HttpResponesError({
              cause: '10001',
              code: 200,
              detail: '未知错误',
              message: '未知错误',
            }));
          }
          //  response
          switch (error.status) {
            case 401:
              const error = new HttpResponesError({ ...response.data, message: '未登录或登录已过期，请重新登录！' });
              error.openMessage = () => { };
              return Promise.reject(error);
          }
          return Promise.reject();
        })
      }],
      [() => isRefreshToken, () => {
        this.instace.interceptors.response.use((response) => {
          //  请求成功 移除请求队列中
          this.requestQueue.removeRequest(response.config.url ?? '')
          return response;
        }, (error: HttpResponesError | AxiosError) => {
          //  拿到自定义错误，刷新 token
          return new Promise((resolve, reject) => {
            if (!(error instanceof HttpResponesError)) {
              const response = error.response as AxiosResponse<HttpResponesError>;
              reject(new HttpResponesError(response.data));
              return;
            }
            //  刷新成功 token 后  修改新 token 重新请求并返回原来的请求的结果
            const getItemConfig = this.requestQueue.peddingRequests.get(String(Math.random() * 10));
            if (getItemConfig) {
              this.requestQueue.addRequest('', {
                resolveCallback: (configAfterUpdateAuthorization) => resolve(axios(configAfterUpdateAuthorization))
              })
              return;
            }
            reject(error)
            console.error('error22222', error);
          })

        })
      }]
    ]);

    for (const [k, v] of responseInterceptors) {
      if (k()) {
        v();
      }
    }
  }

  public getResponseArray<T>(url: string, config?: AxiosRequestConfig<T>) {
    return AxiosErrorModel.callbackArray<T>(this.instace.get(url, config));
  }

  public put<T>(url: string, data?: any, config?: AxiosRequestConfig<T>) {
    return AxiosErrorModel.callbackArray<T>(this.instace.put(url, data, config));
  }

  public delete<T>(url: string, config?: AxiosRequestConfig<T>) {
    return AxiosErrorModel.callbackArray<T>(this.instace.delete(url, config));
  }

  public patch<T>(url: string, data?: any, config?: AxiosRequestConfig<T>) {
    return AxiosErrorModel.callbackArray<T>(this.instace.patch(url, data, config));
  }

  public post_Body<T>(url: string, data?: any, config?: AxiosRequestConfig<T>) {
    return AxiosErrorModel.callbackArray<T>(this.instace.post(url, data, config));
  }

  public get_Body<T>(url: string, config?: AxiosRequestConfig<T>) {
    return AxiosErrorModel.callbackArray<T>(this.instace.get(url, config));
  }

  public put_Body<T>(url: string, data?: any, config?: AxiosRequestConfig<T>) {
    return AxiosErrorModel.callbackArray<T>(this.instace.put(url, data, config));
  }

  public upload<T>(data: Upload) {
    const { url, formData, controller, onUploadProgress } = data
    return AxiosErrorModel.callbackArray<T>(this.instace.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
      signal: controller?.signal,
    }))
  }

  public async uploadStream<T>(data: UploadStream) {
    const { url, file, controller, onUploadProgress } = data
    const fileArrayBuffer = await file.arrayBuffer()
    return AxiosErrorModel.callbackArray<T>(this.instace.post(url, fileArrayBuffer, {
      headers: { 'Content-Type': 'application/octet-stream' },
      onUploadProgress,
      signal: controller?.signal,
    }))
  }

  public axiosDownload(params: AxiosDownload): Promise<{ fileName: string }> {
    const { url, data, controller, fileName, onDownloadProgress } = params
    return new Promise((resolve, reject) => {
      AxiosErrorModel.callbackArray_body(this.instace.get<Blob>(url, {
        params: data,
        responseType: 'blob',
        onDownloadProgress,
        signal: controller ? controller.signal : undefined,
      })).then((result) => {
        const [error, data] = result;
        if (error) {
          reject(error);
          return;
        }
        const blob = new Blob([data.data!], { type: data?.response!.headers['content-type'] })
        const a = document.createElement('a')
        a.style.display = 'none'
        if (fileName) {
          a.download = fileName;
        } else {
          a.download = decodeURIComponent(analysisFilename(data?.response!.headers['content-disposition']))
        }
        a.href = URL.createObjectURL(blob)
        document.body.appendChild(a)
        const downloadFileName = a.download
        a.click()
        URL.revokeObjectURL(a.href)
        document.body.removeChild(a)
        resolve({ fileName: downloadFileName })
      })
    })
  }

  public urlDownload(params: UrlDownload) {
    const { fileName, serveBaseUrl = import.meta.env.VITE_API_SERVER_URL, fileUrl } = params
    const a = document.createElement('a')
    a.style.display = 'none'
    a.download = fileName
    a.href = fileUrl.startsWith('http') ? fileUrl : `${serveBaseUrl}${fileUrl}`
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(a.href) // 释放URL 对象
    document.body.removeChild(a)
  }


}

/**
 * 开放 API 统一管理入口
 */
export class OpenApi {
  public static instace: Instace;
  public static readonly instaceMap: Map<string, Instace> = new Map();

  /**
   * 可单个 | 多个实例同时添加
   * @param instace 
   */
  public static add(instace: Instace): typeof OpenApi
  public static add(instace: Instace[]): typeof OpenApi
  public static add(instace: Instace | Instace[]): typeof OpenApi {
    if (Array.isArray(instace)) {
      instace.forEach((item) => {
        this.instaceMap.set(item.key, item);
      })
    } else {
      this.instaceMap.set(instace.key, instace);
    }
    return this;
  }

  /**
   * 注册当前 request 的 axios 实例
   * @param key 
   * @param recover 是否在调用完毕后还原上一次的实例
   * @returns 
   */
  public static register<T extends ERequestKeys>(key?: T): Instace {
    this.instace = this.instaceMap.get(key || '/') || this.instaceMap.get('/')!;
    return this.instace;
  }
}

//  必须注册 方便后续 TS 提示
type ERequestKeys =
  | '/'
  | '/socketServer'
  | '/authServer'



//  注册当前项目所有所需接口实例
const baseServer = new Instace('/', { baseURL: '/', timeout: 3000 });
const socketServer = new Instace('/socketServer', { baseURL: '/socketServer' });

OpenApi.add([baseServer, socketServer])
  .register('/');

//优先采用RFC 5897  让与url直接通过a标签的下载的结果相同
function analysisFilename(contentDisposition: string): string {
  let regex = /filename\*=\S+?''(.+?)(;|$)/
  if (regex.test(contentDisposition)) {
    return RegExp.$1
  }
  regex = /filename="{0,1}([\S\s]+?)"{0,1}(;|$)/
  if (regex.test(contentDisposition)) {
    return RegExp.$1
  }
  return '文件名获取异常'
}

/**
 * 示例：FileServer 模块所需的 server
 */
export class FileServer extends OpenApi {

  public static socketFileDownload() {
    const controller = new AbortController();
    setTimeout(() => void controller.abort(), 300);
    return this.register().axiosDownload({
      url: '',
      data: {},
      fileName: '', //用于自定义文件名
      otherConfig: {
        responseType: 'blob'
      },
      controller,
      onDownloadProgress(progressEvent: AxiosProgressEvent) {
        const progress = progressEvent.progress;
        //  监听进度
        console.log('progress', progress);
      }
    })
  }

  /**
   * 搜索
   * @returns 
   */
  public static serach(params: any) {
    return this.register('/socketServer')
      .getResponseArray<{ name: string }>('/public/v1/goods/search', params)
  }
}




