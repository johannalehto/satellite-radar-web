import { Fragment } from 'react'
import {
  BlurMask,
  Canvas,
  Circle,
  Line,
  LinearGradient,
  vec,
} from '@shopify/react-native-skia'
import type { NormalizedRadarPoint } from '../../domain/radar/calculations/projectToRadarPoint'
import type {
  RadarCanvasProps,
  RadarViewport,
} from './types'

const RADAR_RADIUS_RATIO = 0.4
const SATELLITE_RADIUS_RATIO = 0.0105
const USER_RADIUS_RATIO = 0.0052
const TICK_HALF_LENGTH_RATIO = 0.021
const VERTICAL_GRID_POSITIONS = [0.08, 0.34, 0.59, 0.85]
const HORIZONTAL_GRID_POSITIONS = [0.3, 0.52, 0.74]

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
  const satelliteRadius = viewport.width * SATELLITE_RADIUS_RATIO
  const userRadius = viewport.width * USER_RADIUS_RATIO
  const tickHalfLength = viewport.width * TICK_HALF_LENGTH_RATIO
  const userPosition = toViewportPoint(scene.userPosition, viewport)

  const cardinalTicks = [
    {
      start: vec(center.x, center.y - radarRadius - tickHalfLength),
      end: vec(center.x, center.y - radarRadius + tickHalfLength),
    },
    {
      start: vec(center.x + radarRadius - tickHalfLength, center.y),
      end: vec(center.x + radarRadius + tickHalfLength, center.y),
    },
    {
      start: vec(center.x, center.y + radarRadius - tickHalfLength),
      end: vec(center.x, center.y + radarRadius + tickHalfLength),
    },
    {
      start: vec(center.x - radarRadius - tickHalfLength, center.y),
      end: vec(center.x - radarRadius + tickHalfLength, center.y),
    },
  ]

  return (
    <Canvas
      style={{ width: viewport.width, height: viewport.height }}
      aria-label="Satellite radar"
    >
      {VERTICAL_GRID_POSITIONS.map((position) => (
        <Line
          key={`vertical-${position}`}
          p1={vec(viewport.width * position, 0)}
          p2={vec(viewport.width * position, viewport.height)}
          color="#343434"
          strokeWidth={2}
        />
      ))}
      {HORIZONTAL_GRID_POSITIONS.map((position) => (
        <Line
          key={`horizontal-${position}`}
          p1={vec(0, viewport.height * position)}
          p2={vec(viewport.width, viewport.height * position)}
          color="#343434"
          strokeWidth={2}
        />
      ))}

      {scene.satellites.map((satellite) => {
        if (!satellite.trajectory) {
          return null
        }

        const lineStart = toViewportPoint(
          satellite.trajectory.lineStart,
          viewport,
        )
        const lineEnd = toViewportPoint(
          satellite.trajectory.lineEnd,
          viewport,
        )
        const trajectoryOpacity = satellite.opacity * 0.9

        return (
          <Line
            key={`trajectory-${satellite.passId}`}
            p1={lineStart}
            p2={lineEnd}
            strokeWidth={0.4}
          >
            <LinearGradient
              start={lineStart}
              end={lineEnd}
              colors={[
                'rgba(242, 242, 242, 0)',
                `rgba(242, 242, 242, ${trajectoryOpacity})`,
                `rgba(242, 242, 242, ${trajectoryOpacity})`,
                'rgba(242, 242, 242, 0)',
              ]}
              positions={[0, 0.16, 0.84, 1]}
            />
          </Line>
        )
      })}

      <Circle
        c={center}
        r={radarRadius}
        color="rgba(222, 222, 222, 0.85)"
        style="stroke"
        strokeWidth={0.2}
      />

      {cardinalTicks.map((tick, index) => (
        <Line
          key={index}
          p1={tick.start}
          p2={tick.end}
          color="#f2f2f2"
          strokeWidth={1.5}
        />
      ))}

      {scene.satellites.map((satellite) => {
        const position = toViewportPoint(satellite.position, viewport)

        return (
          <Fragment key={satellite.passId}>
            <Circle
              c={position}
              r={satelliteRadius * 1.05}
              color={`rgba(255, 255, 255, ${
                satellite.opacity * 0.28
              })`}
            >
              <BlurMask
                blur={satelliteRadius * 1.35}
                style="normal"
              />
            </Circle>
            <Circle
              c={position}
              r={satelliteRadius * 1.03}
              color={`rgba(255, 255, 255, ${
                satellite.opacity * 0.5
              })`}
            >
              <BlurMask
                blur={satelliteRadius * 0.8}
                style="normal"
              />
            </Circle>
            <Circle
              c={position}
              r={satelliteRadius * 1.01}
              color={`rgba(255, 255, 255, ${
                satellite.opacity * 0.85
              })`}
            >
              <BlurMask
                blur={satelliteRadius * 0.42}
                style="normal"
              />
            </Circle>
            <Circle
              c={position}
              r={satelliteRadius}
              color={`rgba(255, 255, 255, ${satellite.opacity})`}
            />
          </Fragment>
        )
      })}

      <Circle
        c={userPosition}
        r={userRadius * 1.08}
        color="rgba(255, 255, 255, 0.3)"
      >
        <BlurMask blur={userRadius * 1.8} style="normal" />
      </Circle>
      <Circle
        c={userPosition}
        r={userRadius * 1.05}
        color="rgba(255, 255, 255, 0.5)"
      >
        <BlurMask blur={userRadius * 1.05} style="normal" />
      </Circle>
      <Circle
        c={userPosition}
        r={userRadius * 1.02}
        color="rgba(255, 250, 253, 0.8)"
      >
        <BlurMask blur={userRadius * 0.55} style="normal" />
      </Circle>
      <Circle
        c={userPosition}
        r={userRadius}
        color="#ff7eda"
      />
    </Canvas>
  )
}

export default RadarCanvas
