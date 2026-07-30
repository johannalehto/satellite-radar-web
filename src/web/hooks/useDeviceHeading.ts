import { useCallback, useEffect, useRef, useState } from 'react'

type DeviceHeadingStatus =
  | 'idle'
  | 'requesting'
  | 'active'
  | 'denied'
  | 'unsupported'

type DeviceOrientationEventWithCompass = DeviceOrientationEvent & {
  webkitCompassHeading?: number
}

type DeviceOrientationEventConstructorWithPermission =
  typeof DeviceOrientationEvent & {
    requestPermission?: (
      absolute?: boolean,
    ) => Promise<'granted' | 'denied'>
  }

function normalizeHeading(headingDeg: number) {
  return ((headingDeg % 360) + 360) % 360
}

function shortestHeadingDelta(fromDeg: number, toDeg: number) {
  return ((toDeg - fromDeg + 540) % 360) - 180
}

function getScreenOrientationAngle() {
  return window.screen.orientation?.angle ?? 0
}

function getHeading(
  event: DeviceOrientationEventWithCompass,
  acceptAbsoluteAlpha: boolean,
) {
  if (
    typeof event.webkitCompassHeading === 'number' &&
    Number.isFinite(event.webkitCompassHeading)
  ) {
    return normalizeHeading(event.webkitCompassHeading)
  }

  if (
    typeof event.alpha !== 'number' ||
    !Number.isFinite(event.alpha) ||
    (!event.absolute && !acceptAbsoluteAlpha)
  ) {
    return null
  }

  return normalizeHeading(
    360 - event.alpha + getScreenOrientationAngle(),
  )
}

function getInitialStatus(): DeviceHeadingStatus {
  if (typeof DeviceOrientationEvent === 'undefined') {
    return 'unsupported'
  }

  const OrientationEvent =
    DeviceOrientationEvent as DeviceOrientationEventConstructorWithPermission

  return OrientationEvent.requestPermission ? 'idle' : 'active'
}

export function useDeviceHeading() {
  const [headingDeg, setHeadingDeg] = useState<number | null>(null)
  const [status, setStatus] =
    useState<DeviceHeadingStatus>(getInitialStatus)
  const smoothedHeadingRef = useRef<number | null>(null)
  const pendingHeadingRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (status !== 'active') {
      return
    }

    function publishPendingHeading() {
      animationFrameRef.current = null
      const targetHeading = pendingHeadingRef.current

      if (targetHeading === null) {
        return
      }

      const currentHeading = smoothedHeadingRef.current
      const nextHeading =
        currentHeading === null
          ? targetHeading
          : normalizeHeading(
              currentHeading +
                shortestHeadingDelta(currentHeading, targetHeading) *
                  0.18,
            )

      smoothedHeadingRef.current = nextHeading
      setHeadingDeg(nextHeading)
    }

    function queueHeading(heading: number | null) {
      if (heading === null) {
        return
      }

      pendingHeadingRef.current = heading

      if (animationFrameRef.current === null) {
        animationFrameRef.current =
          window.requestAnimationFrame(publishPendingHeading)
      }
    }

    function handleOrientation(event: Event) {
      queueHeading(
        getHeading(
          event as DeviceOrientationEventWithCompass,
          false,
        ),
      )
    }

    function handleAbsoluteOrientation(event: Event) {
      queueHeading(
        getHeading(
          event as DeviceOrientationEventWithCompass,
          true,
        ),
      )
    }

    window.addEventListener('deviceorientation', handleOrientation)
    window.addEventListener(
      'deviceorientationabsolute',
      handleAbsoluteOrientation,
    )

    return () => {
      window.removeEventListener(
        'deviceorientation',
        handleOrientation,
      )
      window.removeEventListener(
        'deviceorientationabsolute',
        handleAbsoluteOrientation,
      )

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [status])

  const requestAccess = useCallback(async () => {
    if (
      status === 'active' ||
      status === 'requesting' ||
      status === 'unsupported'
    ) {
      return
    }

    const OrientationEvent =
      DeviceOrientationEvent as DeviceOrientationEventConstructorWithPermission

    setStatus('requesting')

    try {
      const permission = OrientationEvent.requestPermission
        ? await OrientationEvent.requestPermission(true)
        : 'granted'

      setStatus(permission === 'granted' ? 'active' : 'denied')
    } catch {
      setStatus('denied')
    }
  }, [status])

  return {
    headingDeg,
    status,
    requestAccess,
  }
}
