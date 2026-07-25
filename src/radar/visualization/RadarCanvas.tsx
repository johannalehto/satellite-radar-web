import { Fragment } from 'react'
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
const GRID_POSITIONS = [0.2, 0.4, 0.6, 0.8]

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
      {GRID_POSITIONS.flatMap((position) => [
        <Line
          key={`vertical-${position}`}
          p1={vec(viewport.width * position, 0)}
          p2={vec(viewport.width * position, viewport.height)}
          color="#343434"
          strokeWidth={1}
        />,
        <Line
          key={`horizontal-${position}`}
          p1={vec(0, viewport.height * position)}
          p2={vec(viewport.width, viewport.height * position)}
          color="#343434"
          strokeWidth={1}
        />,
      ])}

      {scene.satellites.map((satellite) => {
        if (!satellite.trajectory) {
          return null
        }

        return (
          <Line
            key={`trajectory-${satellite.passId}`}
            p1={toViewportPoint(satellite.trajectory.start, viewport)}
            p2={toViewportPoint(satellite.trajectory.end, viewport)}
            color="#b5b5b5"
            strokeWidth={1}
          />
        )
      })}

      <Circle
        c={center}
        r={radarRadius}
        color="#a4a4a4"
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
          <Fragment key={satellite.passId}>
            <Circle
              c={position}
              r={SATELLITE_RADIUS * 2.4}
              color="rgba(255, 255, 255, 0.12)"
            />
            <Circle
              c={position}
              r={SATELLITE_RADIUS}
              color="#ffffff"
            />
          </Fragment>
        )
      })}

      <Circle
        c={userPosition}
        r={USER_RADIUS * 2.2}
        color="rgba(255, 139, 223, 0.12)"
      />
      <Circle
        c={userPosition}
        r={USER_RADIUS}
        color="#ff8bdf"
      />
    </Canvas>
  )
}

export default RadarCanvas
