import React from 'react'

type KeyboardArrowRightIconProps = React.SVGAttributes<SVGElement>;

export function KeyboardArrowRightIcon(props: KeyboardArrowRightIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentColor"
      {...props}
    >
      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
    </svg>
  )
}
