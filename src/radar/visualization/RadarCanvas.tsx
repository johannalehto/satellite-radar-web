import {
  Canvas,
  Circle,
  Line,
  vec,
} from '@shopify/react-native-skia'
import type { NormalizedRadarPoint } from '../../domain/radar/calculations/projectToRadarPoint'
import type {
  RadarCanvasProps,
  RadarViewport,
} from './types'

const RADAR_RADIUS_RATIO = 0.4
const SATELLITE_RADIUS = 5
const USER_RADIUS = 4
const TICK_HALF_LENGTH = 8

function toViewportPoint(
  point: NormalizedRadarPoint,
  viewport: RadarViewport,
) {
  const centerX = viewport.width / 2
  const centerY = viewport.height / 2
  const radarRadius =
    Math.min(viewport.width, viewport.height) * RADAR_RADIUS_RATIO

  return vec(
    centerX + point.x * radarRadius,
    centerY + point.y * radarRadius,
  )
}

function RadarCanvas({ scene, viewport }: RadarCanvasProps) {
  const center = vec(viewport.width / 2, viewport.height / 2)
  const radarRadius =
    Math.min(viewport.width, viewport.height) * RADAR_RADIUS_RATIO
  const userPosition = toViewportPoint(scene.userPosition, viewport)

  const cardinalTicks = [
    {
      start: vec(center.x, center.y - radarRadius - TICK_HALF_LENGTH),
      end: vec(center.x, center.y - radarRadius + TICK_HALF_LENGTH),
    },
    {
      start: vec(center.x + radarRadius - TICK_HALF_LENGTH, center.y),
      end: vec(center.x + radarRadius + TICK_HALF_LENGTH, center.y),
    },
    {
      start: vec(center.x, center.y + radarRadius - TICK_HALF_LENGTH),
      end: vec(center.x, center.y + radarRadius + TICK_HALF_LENGTH),
    },
    {
      start: vec(center.x - radarRadius - TICK_HALF_LENGTH, center.y),
      end: vec(center.x - radarRadius + TICK_HALF_LENGTH, center.y),
    },
  ]

  return (
    <Canvas
      style={{ width: viewport.width, height: viewport.height }}
      aria-label="Satellite radar"
    >
      <Line
        p1={vec(center.x - radarRadius, center.y)}
        p2={vec(center.x + radarRadius, center.y)}
        color="#353535"
        strokeWidth={1}
      />
      <Line
        p1={vec(center.x, center.y - radarRadius)}
        p2={vec(center.x, center.y + radarRadius)}
        color="#353535"
        strokeWidth={1}
      />

      <Circle
        c={center}
        r={radarRadius}
        color="#8a8a8a"
        style="stroke"
        strokeWidth={1}
      />

      {cardinalTicks.map((tick, index) => (
        <Line
          key={index}
          p1={tick.start}
          p2={tick.end}
          color="#f0f0f0"
          strokeWidth={2}
        />
      ))}

      {scene.satellites.map((satellite) => {
        const position = toViewportPoint(satellite.position, viewport)

        return (
          <Circle
            key={satellite.passId}
            c={position}
            r={SATELLITE_RADIUS}
            color="#ffffff"
          />
        )
      })}

      <Circle
        c={userPosition}
        r={USER_RADIUS}
        color="#ff8bdf"
      />
    </Canvas>
  )
}

export default RadarCanvas
