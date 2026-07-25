import { useEffect, useState } from 'react'

const CLOCK_INTERVAL_MS = 50

export type RadarClockOptions = {
  initialTimestampMs: number
  playbackRate?: number
  loopEndTimestampMs?: number
}

export function useRadarClock({
  initialTimestampMs,
  playbackRate = 1,
  loopEndTimestampMs,
}: RadarClockOptions): number {
  const [timestampMs, setTimestampMs] = useState(initialTimestampMs)

  useEffect(() => {
    const startedAtMs = Date.now()
    const loopDurationMs = loopEndTimestampMs
      ? loopEndTimestampMs - initialTimestampMs
      : null

    const intervalId = setInterval(() => {
      const elapsedMs = (Date.now() - startedAtMs) * playbackRate
      const playbackElapsedMs =
        loopDurationMs && loopDurationMs > 0
          ? elapsedMs % loopDurationMs
          : elapsedMs

      setTimestampMs(initialTimestampMs + playbackElapsedMs)
    }, CLOCK_INTERVAL_MS)

    return () => {
      clearInterval(intervalId)
    }
  }, [initialTimestampMs, loopEndTimestampMs, playbackRate])

  return timestampMs
}
