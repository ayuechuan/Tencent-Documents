interface IFormData {
  docid: string
  move_type: string
  source_type: string
  file?: File
}

export class TDFileData implements IFormData {
  docid!: string
  move_type = 'rename'
  source_type = ''
  file?: File
  constructor(fileData: Partial<TDFileData>) {
    Object.assign(this, fileData)
  }

  each(callback: (key: keyof TDFileData, value: TDFileData[keyof TDFileData]) => void) {
    // 遍历当前类中的属性
    Object.keys(this).forEach((key) => {
      if (Reflect.has(this, key)) {
        const typedKey = key as keyof TDFileData
        callback(typedKey, this[typedKey])
      }
    })
  }

  get size() {
    return this.file?.size
  }

  get formDataBody() {
    const data = new FormData()
    this.each((key, value) => {
      data.append(key, value as string | Blob)
    })
    return data
  }
}

export const formdata = new TDFileData({
  docid: '110',
  file: new File(['hello'], 'hello.txt', { type: 'text/plain' }),
})
