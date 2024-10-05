import sync, { cancelSync } from "framesync"

export function framesync(update: (delta: number) => void) {
  const passTimestamp = ({ delta }: { delta: number }) => update(delta)

  return {
    start: () => sync.update(passTimestamp, true),
    stop: () => cancelSync.update(passTimestamp),
  }
}