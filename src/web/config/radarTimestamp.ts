import type { RadarClockOptions } from '../../radar/hooks/useRadarClock'
import {
  RADAR_FIXTURE_END_TIMESTAMP_MS,
  RADAR_FIXTURE_INITIAL_TIMESTAMP_MS,
} from '../../fixtures/radarFixtureTimeline'

const useRadarFixture = import.meta.env.VITE_USE_RADAR_FIXTURE === 'true'

export const radarClockOptions: RadarClockOptions = useRadarFixture
  ? {
      initialTimestampMs: RADAR_FIXTURE_INITIAL_TIMESTAMP_MS,
      loopEndTimestampMs: RADAR_FIXTURE_END_TIMESTAMP_MS,
      playbackRate: 1,
    }
  : {
      initialTimestampMs: Date.now(),
      useSystemClock: true,
    }
