import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { SatellitePassId } from '../../domain/radar/models'

const DETAIL_SHEET_EXIT_DURATION_MS = 520

export function useSatelliteDetailSelection() {
  const [selectedPassId, setSelectedPassId] =
    useState<SatellitePassId | null>(null)
  const [isDetailSheetClosing, setIsDetailSheetClosing] =
    useState(false)
  const closeTimerRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
      }
    },
    [],
  )

  const closeDetailSheet = useCallback(() => {
    if (selectedPassId === null || isDetailSheetClosing) {
      return
    }

    setIsDetailSheetClosing(true)
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    closeTimerRef.current = window.setTimeout(
      () => {
        setSelectedPassId(null)
        setIsDetailSheetClosing(false)
        closeTimerRef.current = null
      },
      prefersReducedMotion ? 0 : DETAIL_SHEET_EXIT_DURATION_MS,
    )
  }, [isDetailSheetClosing, selectedPassId])

  function selectSatellite(passId: SatellitePassId) {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    setIsDetailSheetClosing(false)
    setSelectedPassId(passId)
  }

  return {
    selectedPassId,
    isDetailSheetClosing,
    selectSatellite,
    closeDetailSheet,
  }
}
