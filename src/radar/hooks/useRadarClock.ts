import { useEffect, useState } from 'react'

const DEFAULT_CLOCK_INTERVAL_MS = 50

export type RadarClockOptions = {
  initialTimestampMs: number
  playbackRate?: number
  loopEndTimestampMs?: number
  intervalMs?: number
  useSystemClock?: boolean
}

export function useRadarClock({
  initialTimestampMs,
  playbackRate = 1,
  loopEndTimestampMs,
  intervalMs = DEFAULT_CLOCK_INTERVAL_MS,
  useSystemClock = false,
}: RadarClockOptions): number {
  const [timestampMs, setTimestampMs] = useState(() =>
    useSystemClock ? Date.now() : initialTimestampMs,
  )

  useEffect(() => {
    const startedAtMs = Date.now()
    const loopDurationMs = loopEndTimestampMs
      ? loopEndTimestampMs - initialTimestampMs
      : null

    const intervalId = setInterval(() => {
      if (useSystemClock) {
        setTimestampMs(Date.now())
        return
      }

      const elapsedMs = (Date.now() - startedAtMs) * playbackRate
      const playbackElapsedMs =
        loopDurationMs && loopDurationMs > 0
          ? elapsedMs % loopDurationMs
          : elapsedMs

      setTimestampMs(initialTimestampMs + playbackElapsedMs)
    }, intervalMs)

    return () => {
      clearInterval(intervalId)
    }
  }, [
    initialTimestampMs,
    intervalMs,
    loopEndTimestampMs,
    playbackRate,
    useSystemClock,
  ])

  return timestampMs
}
