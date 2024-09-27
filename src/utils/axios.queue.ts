import axios, { AxiosRequestConfig, Canceler } from "axios";
import Cookies from "js-cookie";

export interface SpreadAxiosRequestConfig extends AxiosRequestConfig {
  requestkey?: string;
  resolveCallback?: (configAfterUpdateAuthorization: AxiosRequestConfig) => void;
  canceler?: Canceler
}

export class RequestQueue {
  /**
   * token 是否正处于过期状态
   */
  public isTokenExpired: boolean = false;
  /**
   * 过期时 需重新 request 请求的队列
   */
  public peddingRequests: Map<string, SpreadAxiosRequestConfig> = new Map();

  //  添加 过期 请求
  public addRequest(key: string, config: SpreadAxiosRequestConfig): void {
    if (this.peddingRequests.has(key)) {
      const baseConfig = this.peddingRequests.get(key);
      this.peddingRequests.set(key, { ...baseConfig, ...config });
    } else {
      this.peddingRequests.set(key, config);
    }
  }

  //  删除 缓存等待 请求
  public removeRequest(key: string): void {
    this.peddingRequests.delete(key);
  }

  //  取消请求
  public cancelRequest(): void {
    this.peddingRequests.forEach((config) => {
      if (config.canceler) {
        config.canceler();
      }
    });
  }

  //  重发请求
  public resendRequest(): void {
    const Authorization = 'Bearer ' + Cookies.get('token');
    this.peddingRequests.forEach((config) => {
      //  此时 tokne 已经刷新
      Object.assign(config.headers!, { Authorization });
      const { requestkey, resolveCallback, canceler, ...arg } = config;
      config.resolveCallback?.(arg);
    });
  }

  //  server
  public getTokenByRefreshToken(): Promise<unknown> {
    return new Promise((resolve) => {
      axios.get('/api/refreshToken', { headers: { Authorization: 'no-auth' } })
        .then(() => {
          resolve(true);
        })
        .catch((err) => { })
    })
  }

  // 刷新 token
  public refreshToken(): void {
    const refreshToken = Cookies.get('refreshToken');
    if (refreshToken) {
      this.getTokenByRefreshToken().then((isResult) => {
        if (isResult) {
          this.isTokenExpired = false;
          this.resendRequest();
        }
      })
    }
  }
}