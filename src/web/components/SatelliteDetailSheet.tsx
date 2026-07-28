import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import type { SatellitePass } from '../../domain/radar/models'
import { getSatellitePassStatus } from '../../domain/radar/selectors/satellitePassStatus'
import './SatelliteDetailSheet.css'

type SatelliteDetailSheetProps = {
  pass: SatellitePass
  elevationDeg: number | null
  timestampMs: number
  isClosing: boolean
  onClose: () => void
}

const SWIPE_CLOSE_THRESHOLD_PX = 80

const DIRECTION_NAMES: Record<string, string> = {
  N: 'North',
  NE: 'North-East',
  E: 'East',
  SE: 'South-East',
  S: 'South',
  SW: 'South-West',
  W: 'West',
  NW: 'North-West',
}

function formatObjectType(value: SatellitePass['objectType']) {
  if (!value) {
    return 'Unknown'
  }

  return value
    .split('_')
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(' ')
}

function formatClockTime(timestampMs: number) {
  return new Date(timestampMs).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function formatRemainingTime(remainingMs: number) {
  const remainingSeconds = Math.max(
    0,
    Math.ceil(remainingMs / 1_000),
  )
  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function formatDirection(direction: string) {
  return DIRECTION_NAMES[direction] ?? direction
}

function SatelliteDetailSheet({
  pass,
  elevationDeg,
  timestampMs,
  isClosing,
  onClose,
}: SatelliteDetailSheetProps) {
  const sheetRef = useRef<HTMLElement>(null)
  const dragStartYRef = useRef<number | null>(null)
  const dragOffsetRef = useRef(0)
  const [isDragging, setIsDragging] = useState(false)
  const status = getSatellitePassStatus(pass, timestampMs)
  const badgeLabel =
    status === 'approaching'
      ? 'VISIBLE IN'
      : status === 'passed'
        ? 'PASSED'
        : 'VISIBLE'
  const badgeDurationMs =
    status === 'approaching'
      ? pass.visibleFromMs - timestampMs
      : status === 'passed'
        ? timestampMs - pass.visibleUntilMs
        : pass.visibleUntilMs - timestampMs

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function setDragOffset(offsetPx: number) {
    dragOffsetRef.current = offsetPx
    sheetRef.current?.style.setProperty(
      '--sheet-drag-y',
      `${offsetPx}px`,
    )
  }

  function handlePointerDown(
    event: ReactPointerEvent<HTMLElement>,
  ) {
    if (!event.isPrimary || isClosing) {
      return
    }

    dragStartYRef.current = event.clientY
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(
    event: ReactPointerEvent<HTMLElement>,
  ) {
    if (dragStartYRef.current === null) {
      return
    }

    setDragOffset(
      Math.max(0, event.clientY - dragStartYRef.current),
    )
  }

  function finishDrag(event: ReactPointerEvent<HTMLElement>) {
    if (dragStartYRef.current === null) {
      return
    }

    dragStartYRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setIsDragging(false)

    if (dragOffsetRef.current >= SWIPE_CLOSE_THRESHOLD_PX) {
      onClose()
      return
    }

    window.requestAnimationFrame(() => setDragOffset(0))
  }

  return (
    <>
      <button
        className="satellite-detail-backdrop"
        type="button"
        aria-label="Close satellite details"
        onClick={onClose}
      />
      <aside
        ref={sheetRef}
        className={[
          'satellite-detail-sheet',
          isDragging ? 'is-dragging' : '',
          isClosing ? 'is-closing' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label={`${pass.name} details`}
      >
        <div className="satellite-detail-scroll">
          <header
            className="satellite-detail-heading"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
          >
            <h2>{pass.name}</h2>
            <p className="satellite-visible-badge">
              <span>{badgeLabel}</span>
              <strong>
                {formatRemainingTime(badgeDurationMs)}
              </strong>
            </p>
          </header>

          <div className="satellite-detail-groups">
            <dl className="satellite-detail-grid">
            <div>
              <dt>ELEVATION NOW</dt>
              <dd>
                {elevationDeg === null
                  ? '—'
                  : `${elevationDeg.toFixed(1)}°`}
              </dd>
            </div>
            <div>
              <dt>MAX ELEVATION</dt>
              <dd>{pass.maxElevationDeg.toFixed(1)}°</dd>
            </div>
            <div className="satellite-detail-wide">
              <dt>VISIBLE</dt>
              <dd>
                {formatClockTime(pass.visibleFromMs)} –{' '}
                {formatClockTime(pass.visibleUntilMs)}
              </dd>
            </div>
            <div className="satellite-detail-wide">
              <dt>DIRECTION</dt>
              <dd>
                {formatDirection(pass.start.direction)} to{' '}
                {formatDirection(pass.end.direction)}
              </dd>
            </div>
            </dl>

            <dl className="satellite-detail-grid">
            <div>
              <dt>OWNER</dt>
              <dd>{pass.owner?.code ?? 'Unknown'}</dd>
            </div>
            <div>
              <dt>LAUNCH DATE</dt>
              <dd>{pass.launch?.date ?? 'Unknown'}</dd>
            </div>
            <div className="satellite-detail-wide">
              <dt>LAUNCH SITE</dt>
              <dd>{pass.launch?.site?.name ?? 'Unknown'}</dd>
            </div>
            </dl>

            <dl className="satellite-detail-grid">
            <div>
              <dt>NORAD ID</dt>
              <dd>{pass.satelliteId}</dd>
            </div>
            <div>
              <dt>OBJECT TYPE</dt>
              <dd>{formatObjectType(pass.objectType)}</dd>
            </div>
            </dl>
          </div>
        </div>
      </aside>
    </>
  )
}

export default SatelliteDetailSheet
