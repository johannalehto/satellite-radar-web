import { Fragment } from 'react'
import {
  BlurMask,
  Canvas,
  Circle,
  Line,
  vec,
} from '@shopify/react-native-skia'
import type {
  RadarCanvasProps,
} from './types'
import {
  projectToViewportPoint,
  RADAR_RADIUS_RATIO,
} from './projectToViewportPoint'

const SATELLITE_RADIUS_RATIO = 0.0105
const USER_MARKER_RADIUS = 4.5
const USER_MARKER_TICK_INNER_RADIUS = 3
const USER_MARKER_TICK_OUTER_RADIUS = 6
const TICK_HALF_LENGTH_RATIO = 0.021
const VERTICAL_GRID_POSITIONS = [0.08, 0.34, 0.59, 0.85]
const HORIZONTAL_GRID_POSITIONS = [0.3, 0.52, 0.74]

function toSkiaPoint(
  point: Parameters<typeof projectToViewportPoint>[0],
  viewport: Parameters<typeof projectToViewportPoint>[1],
) {
  const viewportPoint = projectToViewportPoint(point, viewport)
  return vec(viewportPoint.x, viewportPoint.y)
}

function RadarCanvas({
  scene,
  viewport,
  useGreenTheme,
}: RadarCanvasProps) {
  const primaryRgb = useGreenTheme ? '117, 255, 141' : '242, 242, 242'
  const satelliteRgb = useGreenTheme ? '117, 255, 141' : '255, 255, 255'
  const markerColor = useGreenTheme ? '#75ff8d' : '#fdf5f5'
  const gridColor = useGreenTheme
    ? 'rgba(81, 166, 97, 0.14)'
    : 'rgba(92, 92, 92, 0.1)'
  const center = vec(viewport.width / 2, viewport.height / 2)
  const radarRadius =
    Math.min(viewport.width, viewport.height) * RADAR_RADIUS_RATIO
  const satelliteRadius = viewport.width * SATELLITE_RADIUS_RATIO
  const tickHalfLength = viewport.width * TICK_HALF_LENGTH_RATIO
  const userPosition = toSkiaPoint(scene.userPosition, viewport)
  const userMarkerTicks = [
    {
      start: vec(
        userPosition.x,
        userPosition.y - USER_MARKER_TICK_INNER_RADIUS,
      ),
      end: vec(
        userPosition.x,
        userPosition.y - USER_MARKER_TICK_OUTER_RADIUS,
      ),
    },
    {
      start: vec(
        userPosition.x + USER_MARKER_TICK_INNER_RADIUS,
        userPosition.y,
      ),
      end: vec(
        userPosition.x + USER_MARKER_TICK_OUTER_RADIUS,
        userPosition.y,
      ),
    },
    {
      start: vec(
        userPosition.x,
        userPosition.y + USER_MARKER_TICK_INNER_RADIUS,
      ),
      end: vec(
        userPosition.x,
        userPosition.y + USER_MARKER_TICK_OUTER_RADIUS,
      ),
    },
    {
      start: vec(
        userPosition.x - USER_MARKER_TICK_INNER_RADIUS,
        userPosition.y,
      ),
      end: vec(
        userPosition.x - USER_MARKER_TICK_OUTER_RADIUS,
        userPosition.y,
      ),
    },
  ]

  const cardinalTicks = [
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
          p1={vec(viewport.width * position, viewport.height * 0.13)}
          p2={vec(viewport.width * position, viewport.height * 0.94)}
          color={gridColor}
          strokeWidth={1}
        />
      ))}
      {HORIZONTAL_GRID_POSITIONS.map((position) => (
        <Line
          key={`horizontal-${position}`}
          p1={vec(0, viewport.height * position)}
          p2={vec(viewport.width, viewport.height * position)}
          color={gridColor}
          strokeWidth={1}
        />
      ))}

      {scene.satellites.map((satellite) => {
        if (!satellite.trajectory) {
          return null
        }

        const lineStart = toSkiaPoint(
          satellite.trajectory.lineStart,
          viewport,
        )
        const lineEnd = toSkiaPoint(
          satellite.trajectory.lineEnd,
          viewport,
        )
        const trajectoryOpacity = satellite.opacity * 0.9

        return (
          <Line
            key={`trajectory-${satellite.passId}`}
            p1={lineStart}
            p2={lineEnd}
            color={`rgba(${primaryRgb}, ${trajectoryOpacity})`}
            strokeWidth={0.4}
          />
        )
      })}

      <Circle
        c={center}
        r={radarRadius}
        color={`rgba(${primaryRgb}, 0.85)`}
        style="stroke"
        strokeWidth={0.2}
      />

      {cardinalTicks.map((tick, index) => (
        <Line
          key={index}
          p1={tick.start}
          p2={tick.end}
          color={`rgb(${primaryRgb})`}
          strokeWidth={1.5}
        />
      ))}

      {scene.satellites.map((satellite) => {
        const position = toSkiaPoint(satellite.position, viewport)

        return (
          <Fragment key={satellite.passId}>
            <Circle
              c={position}
              r={satelliteRadius * 1.1}
              color={`rgba(${satelliteRgb}, ${
                satellite.opacity * 0.34
              })`}
            >
              <BlurMask
                blur={satelliteRadius * 1.8}
                style="normal"
              />
            </Circle>
            <Circle
              c={position}
              r={satelliteRadius * 1.06}
              color={`rgba(${satelliteRgb}, ${
                satellite.opacity * 0.55
              })`}
            >
              <BlurMask
                blur={satelliteRadius}
                style="normal"
              />
            </Circle>
            <Circle
              c={position}
              r={satelliteRadius * 1.01}
              color={`rgba(${satelliteRgb}, ${
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
              color={`rgba(${satelliteRgb}, ${satellite.opacity})`}
            />
          </Fragment>
        )
      })}

      <Circle
        c={userPosition}
        r={USER_MARKER_RADIUS}
        color={markerColor}
        style="stroke"
        strokeWidth={1}
      />
      {userMarkerTicks.map((tick, index) => (
        <Line
          key={`user-marker-tick-${index}`}
          p1={tick.start}
          p2={tick.end}
          color={markerColor}
          strokeWidth={1}
        />
      ))}
    </Canvas>
  )
}

export default RadarCanvas
