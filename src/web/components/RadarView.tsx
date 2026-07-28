import { useEffect, useRef, useState } from 'react'
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web'
import canvaskitWasmUrl from 'canvaskit-wasm/bin/full/canvaskit.wasm?url'
import type { RadarScene } from '../../domain/radar/sceneModels'
import type { SatellitePassId } from '../../domain/radar/models'
import { projectToViewportPoint } from '../../radar/visualization/projectToViewportPoint'
import type { RadarViewport } from '../../radar/visualization/types'
import { configureCanvasKitWebGL1 } from '../skia/configureCanvasKitWebGL1'
import './RadarView.css'

async function loadRadarCanvas() {
  configureCanvasKitWebGL1()
  return import('../../radar/visualization/RadarCanvas')
}

type RadarViewProps = {
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
  scene,
  selectedPassId,
  showLabels,
  onSelectSatellite,
  onBackgroundClick,
}: RadarViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [viewport, setViewport] = useState<RadarViewport>(EMPTY_VIEWPORT)

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

  return (
    <div
      ref={containerRef}
      className="radar-view"
      onClick={onBackgroundClick}
    >
      <div className="radar-north-marker" aria-hidden="true">
        <span className="radar-north-arrow" />
        <span>N</span>
      </div>

      {viewport.width > 0 && (
        <>
          <WithSkiaWeb
            opts={{ locateFile: () => canvaskitWasmUrl }}
            getComponent={loadRadarCanvas}
            componentProps={{ scene, viewport }}
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
