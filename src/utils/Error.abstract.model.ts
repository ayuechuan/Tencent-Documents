import { AxiosResponse } from "axios"
import { message } from "tdesign-react"

abstract class IErrorInfos {
  public abstract readonly code: number
  public abstract readonly message: string
  cause?: string
  detail?: string
}

//  封装 axios reponse error 实例
export class HttpResponesError implements IErrorInfos {
  code!: number
  //  一般信息
  message!: string
  cause?: string
  //  详细错误信息
  detail?: string
  response?: AxiosResponse

  constructor(error: Partial<HttpResponesError>) {
    Object.assign(this, error)
  }

  public openMessage(custom?: (error: HttpResponesError) => void): void
  public openMessage(tips?: string): void
  public openMessage(tips?: string | ((error: HttpResponesError) => void)): void {
    if (typeof tips === 'string') {
      const error = tips ?? this.message
      message.error(error)
    } else {
      //  自定义当前错误显示结果
      tips?.(this)
    }
  }

  //  模态框显示错误
  public showModal(tips?: string) { }
}

export class AxiosErrorModel<T = void> {
  data?: T
  error?: HttpResponesError

  static async callbackArray<CT>(promise: Promise<CT>): Promise<[null, CT] | [HttpResponesError, null]> {
    return promise
      .then<[null, CT]>((data: CT) => [null, data])
      .catch<[HttpResponesError, null]>((err: HttpResponesError) => [err, null])
  }

  static async callbackArray_body<CT>(
    promise: Promise<AxiosResponse<CT>>,
  ): Promise<[null, AxiosErrorModelWithHeder<CT>] | [AxiosErrorModelWithHeder, null]> {
    return promise
      .then<[null, AxiosErrorModelWithHeder<CT>]>((data) => [null, data])
      .catch<[AxiosErrorModelWithHeder, null]>((err: AxiosErrorModelWithHeder) => [err, null])
  }
}

export class AxiosErrorModelWithHeder<T = void> extends AxiosErrorModel<T> {
  response?: AxiosResponse<T, void>
}