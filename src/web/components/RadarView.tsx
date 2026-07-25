import { useEffect, useRef, useState } from 'react'
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web'
import canvaskitWasmUrl from 'canvaskit-wasm/bin/full/canvaskit.wasm?url'
import type { RadarScene } from '../../domain/radar/sceneModels'
import type { RadarViewport } from '../../radar/visualization/types'
import { configureCanvasKitWebGL1 } from '../skia/configureCanvasKitWebGL1'
import './RadarView.css'

async function loadRadarCanvas() {
  configureCanvasKitWebGL1()
  return import('../../radar/visualization/RadarCanvas')
}

type RadarViewProps = {
  scene: RadarScene
}

const EMPTY_VIEWPORT: RadarViewport = {
  width: 0,
  height: 0,
}

function RadarView({ scene }: RadarViewProps) {
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

      const size = entry.contentRect.width
      setViewport({ width: size, height: size })
    })

    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div ref={containerRef} className="radar-view">
      <div className="radar-north-marker" aria-hidden="true">
        <span className="radar-north-arrow">△</span>
        <span>N</span>
      </div>

      {viewport.width > 0 && (
        <WithSkiaWeb
          opts={{ locateFile: () => canvaskitWasmUrl }}
          getComponent={loadRadarCanvas}
          componentProps={{ scene, viewport }}
          fallback={<p className="radar-loading">Loading radar…</p>}
        />
      )}
    </div>
  )
}

export default RadarView
