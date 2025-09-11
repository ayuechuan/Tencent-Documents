import * as comlink from 'comlink'

export class SheetsRemote {
  public blockingFunc(iterations: number, cb?: (result: number) => void): number {
    console.log(`\titerations: ${iterations} * 1,000,000 loop`)

    let result = 0
    for (let i = 0; i < iterations; i++) {
      for (let j = 0; j < 1_000_000; j++) {
        result += Math.random()
      }
    }
    console.log(`\tresult:${result}`)
    // randomの合計を返す
    cb?.(result)
    return result
  }
}

const rmote = new SheetsRemote()

export type Iremote = typeof rmote

comlink.expose(rmote)
