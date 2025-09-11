export class GlobalOperate {
  constructor() { }

  public start() {
    const sideEffect = this.onCopy()
    return () => {
      sideEffect.unsubscribe();
    }
  }

  //  查看复制
  private onCopy() {
    const controller = new AbortController();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        //  拿到剪切板的内容
        navigator.clipboard.readText().then((res) => {
          console.log('拿到剪切板的内容', res)
        })
      }
    }, { signal: controller.signal })
    return {
      unsubscribe: () => { controller.abort(); }
    }
  }
}

export class WithResolvers<T> {
  public promise!: Promise<T>
  public resolve!: (value: T | PromiseLike<T>) => void
  public reject!: (reason?: any) => void
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}
