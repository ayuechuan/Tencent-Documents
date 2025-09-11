import { RcFile } from "antd/lib/upload";
import EventEmitter from "events";

type uid = string;
type Details = { md5: string, crc32: string };

/**
 * 文件信息缓存类
 */
export abstract class Cache {
  // 全局共享的静态缓存
  protected static details: Map<uid, Details> = new Map();

  // 提供实例方法访问静态缓存
  protected setToCache(key: uid, value: Details): Details {
    (this.constructor as typeof Cache).details.set(key, value);
    return value;
  }

  protected getFromCache(key: uid): Details | undefined {
    return (this.constructor as typeof Cache).details.get(key);
  }
}

/**
 * 文件上传类
 * @description 注: 内部 控制上传状态 ｜ 上传接口的发起 ｜ 上传文件限制的校验
 */
export class Upload extends Cache {
  private readonly events = new EventEmitter();
  static readonly fileSliceDefaultMaxSize = 200 * 1024;
  private static fileDetails: Details | null = null;

  constructor(
    private readonly file: RcFile & { originfileObj?: Blob },
    private readonly fileName: string,
    private readonly maxLimitSize = Upload.fileSliceDefaultMaxSize
  ) {
    super();
    // Upload.fileDetails = Upload.search(this.file.uid)!;
  }


  on(key: string, callback: () => void) {
    this.events.on(key, callback);
    return this;
  }

  destory() {
    this.events.removeAllListeners();
  }

  public get isBeyondLimit() {
    return this.file.size / 1024 / 1024 < this.maxLimitSize;
  }

  /**
   * 优先秒传
   */
  public async start() {
    try {
      let data = Upload.fileDetails;
      if (!data) {
        data = await this.getFileMd5AndCrc32() as any;
        // Upload.fileDetails = Upload.set(this.file.uid, data!);
      }


    } catch (error) {

    } finally {
      this.destory();
    }
  }

  /**
   * 单文件上传
   */
  public async startSingleFileUpload() { }

  /**
   * 秒传
   */
  public async startSecondUpload() { }

  /**
   * 获取文件的md5 & crc32
   */
  private async getFileMd5AndCrc32() {
    return new Promise((resolve) => {

    })
  }

  /**
   * 获取分片的md5
   */
  private async getFileSliceMd5() { }
}

// const upload = new Upload('', '123', 50);
// upload.on('end', () => {
//   upload.destory();
// })
// upload.check().then(() => {
//   upload.start();
// })

