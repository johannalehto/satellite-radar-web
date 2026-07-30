import type { RadarScene } from '../../domain/radar/sceneModels'

export type RadarViewport = {
  width: number
  height: number
}

export type RadarCanvasProps = {
  deviceHeadingDeg: number
  scene: RadarScene
  viewport: RadarViewport
}
