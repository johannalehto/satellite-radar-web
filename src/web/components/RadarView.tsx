import { useEffect, useRef, useState } from 'react'
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web'
import canvaskitWasmUrl from 'canvaskit-wasm/bin/full/canvaskit.wasm?url'
import type { RadarScene } from '../../domain/radar/sceneModels'
import type { SatellitePassId } from '../../domain/radar/models'
import {
  projectToViewportPoint,
  RADAR_RADIUS_RATIO,
} from '../../radar/visualization/projectToViewportPoint'
import type { RadarViewport } from '../../radar/visualization/types'
import { configureCanvasKitWebGL1 } from '../skia/configureCanvasKitWebGL1'
import './RadarView.css'

async function loadRadarCanvas() {
  configureCanvasKitWebGL1()
  return import('../../radar/visualization/RadarCanvas')
}

type RadarViewProps = {
  deviceHeadingDeg: number | null
  scene: RadarScene
  selectedPassId: SatellitePassId | null
  showLabels: boolean
  onSelectSatellite: (passId: SatellitePassId) => void
  onBackgroundClick: () => void
}

const EMPTY_VIEWPORT: RadarViewport = {
  width: 0,
  height: 0,
}
const RADAR_VIEW_HEIGHT_RATIO = 1.2

function RadarView({
  deviceHeadingDeg,
  scene,
  selectedPassId,
  showLabels,
  onSelectSatellite,
  onBackgroundClick,
}: RadarViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [viewport, setViewport] = useState<RadarViewport>(EMPTY_VIEWPORT)
  const activeHeadingDeg = deviceHeadingDeg ?? 0

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) {
        return
      }

      const width = entry.contentRect.width
      setViewport({
        width,
        height: width * RADAR_VIEW_HEIGHT_RATIO,
      })
    })

    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const headingRad = (activeHeadingDeg * Math.PI) / 180
  const northUnitX = -Math.sin(headingRad)
  const northUnitY = -Math.cos(headingRad)
  const centerX = viewport.width / 2
  const centerY = viewport.height / 2
  const radarRadius =
    Math.min(viewport.width, viewport.height) * RADAR_RADIUS_RATIO
  const arrowHorizontalRadius = Math.max(0, centerX - 8.5)
  const arrowVerticalRadius = Math.max(
    radarRadius + 8.5,
    centerY - viewport.height * 0.0735 - 7.5,
  )
  const labelHorizontalRadius = Math.max(
    radarRadius + 8,
    arrowHorizontalRadius - 20,
  )
  const labelVerticalRadius = Math.max(
    radarRadius + 8,
    arrowVerticalRadius - 20,
  )
  const northArrowX =
    centerX + northUnitX * arrowHorizontalRadius
  const northArrowY =
    centerY + northUnitY * arrowVerticalRadius
  const northLabelX =
    centerX + northUnitX * labelHorizontalRadius
  const northLabelY =
    centerY + northUnitY * labelVerticalRadius
  const northArrowRotationDeg =
    (Math.atan2(
      northUnitX * arrowHorizontalRadius,
      -northUnitY * arrowVerticalRadius,
    ) *
      180) /
    Math.PI

  return (
    <div
      ref={containerRef}
      className="radar-view"
      onClick={onBackgroundClick}
    >
      {viewport.width > 0 && (
        <>
          <div className="radar-north-marker" aria-hidden="true">
            <svg
              className="radar-north-arrow"
              viewBox="0 0 17 15"
              fill="none"
              style={{
                left: northArrowX,
                top: northArrowY,
                transform: `translate(-50%, -50%) rotate(${northArrowRotationDeg}deg)`,
              }}
            >
              <path
                d="M8.5 0.5 L16.5 14.5 L0.5 14.5 Z"
                stroke="currentColor"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <span
              className="radar-north-label"
              style={{
                left: northLabelX,
                top: northLabelY,
              }}
            >
              N
            </span>
          </div>
          <WithSkiaWeb
            opts={{ locateFile: () => canvaskitWasmUrl }}
            getComponent={loadRadarCanvas}
            componentProps={{
              deviceHeadingDeg: activeHeadingDeg,
              scene,
              viewport,
            }}
            fallback={<p className="radar-loading">Loading radar…</p>}
          />
          <div
            className="radar-interaction-layer"
            aria-label="Visible satellites"
          >
            {scene.satellites.map((satellite) => {
              const point = projectToViewportPoint(
                satellite.position,
                viewport,
                activeHeadingDeg,
              )
              const label = satellite.ownerCode
                ? `${satellite.name}, ${satellite.ownerCode}`
                : satellite.name

              return (
                <button
                  key={satellite.passId}
                  type="button"
                  aria-label={`View details for ${label}`}
                  className={
                    satellite.passId === selectedPassId
                      ? 'radar-satellite-target is-selected'
                      : 'radar-satellite-target'
                  }
                  style={{ left: point.x, top: point.y }}
                  onClick={(event) => {
                    event.stopPropagation()
                    onSelectSatellite(satellite.passId)
                  }}
                >
                  {showLabels && (
                    <span className="radar-satellite-label">
                      {label}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default RadarView
