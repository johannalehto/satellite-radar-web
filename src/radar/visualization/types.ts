import type { RadarScene } from '../../domain/radar/sceneModels'

export type RadarViewport = {
  width: number
  height: number
}

export type RadarCanvasProps = {
  scene: RadarScene
  viewport: RadarViewport
  useGreenTheme: boolean
}
