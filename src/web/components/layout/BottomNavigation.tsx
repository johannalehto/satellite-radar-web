import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import './BottomNavigation.css'

type NavigationItemProps = {
  label: string
  onSelect?: () => void
  to: string
  end?: boolean
  children: ReactNode
}

function NavigationItem({
  label,
  onSelect,
  to,
  end = false,
  children,
}: NavigationItemProps) {
  return (
    <NavLink
      aria-label={label}
      className={({ isActive }) =>
        `bottom-navigation-link${isActive ? ' is-active' : ''}`
      }
      end={end}
      onClick={onSelect}
      to={to}
    >
      {children}
    </NavLink>
  )
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32">
      <path d="M27 5 13.2 27l-2.4-8.2L3 15.6 27 5Z" />
    </svg>
  )
}

function RadarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="11" />
      <circle cx="16" cy="16" r="3" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32">
      <path d="M11 9h17M11 16h17M11 23h17" />
      <path d="M4 9h1M4 16h1M4 23h1" />
    </svg>
  )
}

type BottomNavigationProps = {
  onRequestDeviceHeadingAccess: () => Promise<void>
}

function BottomNavigation({
  onRequestDeviceHeadingAccess,
}: BottomNavigationProps) {
  return (
    <nav className="bottom-navigation" aria-label="Primary navigation">
      <NavigationItem end label="Location" to="/">
        <LocationIcon />
      </NavigationItem>
      <NavigationItem
        label="Radar"
        onSelect={() => {
          void onRequestDeviceHeadingAccess()
        }}
        to="/radar"
      >
        <RadarIcon />
      </NavigationItem>
      <NavigationItem label="Satellite list" to="/satellites">
        <ListIcon />
      </NavigationItem>
    </nav>
  )
}

export default BottomNavigation
