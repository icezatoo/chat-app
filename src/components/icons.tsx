"use client"

interface IconProps {
  name: keyof typeof paths
  size?: number
  stroke?: number
  className?: string
}

const paths = {
  sidebar: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M9 3v18" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  chat: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z" />,
  dots: (
    <>
      <circle cx="5" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  send: <path d="M5 12 19 5l-3 14-4-7-7-0z" />,
  paperclip: <path d="m21 11-8.5 8.5a5 5 0 1 1-7-7L13 4.4a3.5 3.5 0 0 1 5 5L9.5 18a2 2 0 1 1-2.8-2.8L14 8" />,
  mic: (
    <>
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
  chevDown: <path d="m6 9 6 6 6-6" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5M21 12H9" />
    </>
  ),
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />,
  shield: <path d="M12 3 4 6v6a10 10 0 0 0 8 9 10 10 0 0 0 8-9V6l-8-3z" />,
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </>
  ),
  thumbUp: <path d="M7 22V11l5-8a3 3 0 0 1 3 3v5h5a2 2 0 0 1 2 2.3l-1.5 7A2 2 0 0 1 18.6 22H7z" />,
  thumbDown: <path d="M17 2v11l-5 8a3 3 0 0 1-3-3v-5H4a2 2 0 0 1-2-2.3L3.5 3.7A2 2 0 0 1 5.4 2H17z" />,
  refresh: <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" />,
  share: (
    <>
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="m8.6 10.7 6.8-3.4M8.6 13.3l6.8 3.4" />
    </>
  ),
  calc: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <rect x="7" y="6" width="10" height="4" />
      <circle cx="8.5" cy="14" r="0.6" fill="currentColor" />
      <circle cx="12" cy="14" r="0.6" fill="currentColor" />
      <circle cx="15.5" cy="14" r="0.6" fill="currentColor" />
      <circle cx="8.5" cy="17.5" r="0.6" fill="currentColor" />
      <circle cx="12" cy="17.5" r="0.6" fill="currentColor" />
      <circle cx="15.5" cy="17.5" r="0.6" fill="currentColor" />
    </>
  ),
} as const

export function Icon({ name, size = 18, stroke = 1.6, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name]}
    </svg>
  )
}
