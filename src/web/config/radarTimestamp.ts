import { RADAR_FIXTURE_INITIAL_TIMESTAMP_MS } from '../../fixtures/radarFixtureTimeline'

const useRadarFixture = import.meta.env.VITE_USE_RADAR_FIXTURE === 'true'

export const radarTimestampMs = useRadarFixture
  ? RADAR_FIXTURE_INITIAL_TIMESTAMP_MS
  : Date.now()
