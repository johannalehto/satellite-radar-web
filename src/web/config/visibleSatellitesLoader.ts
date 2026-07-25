import {
  getVisibleSatellites,
  type VisibleSatellitesLoader,
} from '../../api/radarClient'
import { getVisibleSatellitesFromFixture } from '../../fixtures/getVisibleSatellitesFromFixture'

const useRadarFixture = import.meta.env.VITE_USE_RADAR_FIXTURE === 'true'

export const visibleSatellitesLoader: VisibleSatellitesLoader = useRadarFixture
  ? getVisibleSatellitesFromFixture
  : getVisibleSatellites
