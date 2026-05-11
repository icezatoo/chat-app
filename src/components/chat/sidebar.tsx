"use client"

import { useEffect, useRef, useState } from "react"
import { signOut } from "next-auth/react"
import { Icon } from "@/components/icons"
import { useDictionary, useLocale } from "@/lib/i18n-context"
import type { ChatSession } from "@/lib/types"

function groupByDay(
  sessions: ChatSession[],
  buckets: Record<string, string>
) {
  const now = new Date()
  const groups: { label: string; items: ChatSession[] }[] = []

  const keyed: Record<string, ChatSession[]> = {
    [buckets.today]: [],
    [buckets.yesterday]: [],
    [buckets.week]: [],
    [buckets.month]: [],
    [buckets.older]: [],
  }

  for (const s of sessions) {
    const d = new Date(s.updatedAt)
    const diffDays = (now.getTime() - d.getTime()) / 86_400_000

    if (diffDays < 1) keyed[buckets.today].push(s)
    else if (diffDays < 2) keyed[buckets.yesterday].push(s)
    else if (diffDays < 7) keyed[buckets.week].push(s)
    else if (diffDays < 30) keyed[buckets.month].push(s)
    else keyed[buckets.older].push(s)
  }

  for (const [label, items] of Object.entries(keyed)) {
    if (items.length) groups.push({ label, items })
  }
  return groups
}

function ProfileMenu({
  user,
  onClose,
  onSignOut,
  menu,
}: {
  user: { name: string; email: string; initials: string }
  onClose: () => void
  onSignOut: () => void
  menu: { profile: string; settings: string; signOut: string }
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest(".user-pill")
      ) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [onClose])

  return (
    <div ref={ref} className="menu-pop" style={{ bottom: 68, left: 10, right: 10 }}>
      <div className="menu-head">
        <div className="avatar avatar-lg">{user.initials}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
          <div className="name">{user.name}</div>
          <div className="email">{user.email}</div>
        </div>
      </div>
      <button className="menu-item">
        <Icon name="user" size={16} />
        {menu.profile}
      </button>
      <button className="menu-item">
        <Icon name="settings" size={16} />
        {menu.settings}
        <span className="menu-kbd">⌘,</span>
      </button>
      <div className="menu-sep" />
      <button className="menu-item danger" onClick={onSignOut}>
        <Icon name="logout" size={16} />
        {menu.signOut}
      </button>
    </div>
  )
}

export function Sidebar({
  sessions,
  activeId,
  onSelect,
  onNewChat,
  onToggle,
  user,
}: {
  sessions: ChatSession[]
  activeId: string | null
  onSelect: (id: string) => void
  onNewChat: () => void
  onToggle: () => void
  user: { name: string; email: string; initials: string }
}) {
  const { sidebar: t } = useDictionary()
  const locale = useLocale()
  const [search, setSearch] = useState("")
  const [profileOpen, setProfileOpen] = useState(false)

  const filtered = search
    ? sessions.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()))
    : sessions

  const groups = groupByDay(filtered, t.buckets)

  const handleSignOut = () => {
    setProfileOpen(false)
    signOut({ callbackUrl: `/${locale}/login` })
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <div className="brandmark">
          <div className="glyph">ป</div>
          <span style={{ fontSize: 16 }}>Plodnee</span>
        </div>
        <button className="btn-icon" onClick={onToggle} title={t.collapseSidebar}>
          <Icon name="sidebar" />
        </button>
      </div>

      <button className="new-chat-btn" onClick={onNewChat}>
        <Icon name="plus" size={18} />
        {t.newChat}
      </button>

      <div className="search-row">
        <div className="input-with-icon">
          <span className="icon-slot">
            <Icon name="search" size={16} />
          </span>
          <input
            className="input"
            style={{ height: 40, fontSize: 14 }}
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="history-list scroll">
        {groups.map((g) => (
          <div key={g.label}>
            <div className="history-day">{g.label}</div>
            {g.items.map((s) => (
              <button
                key={s.id}
                className={`history-item${activeId === s.id ? " active" : ""}`}
                onClick={() => onSelect(s.id)}
              >
                <Icon name="chat" size={15} stroke={1.7} />
                <span className="title">{s.title}</span>
                <span className="menu-btn">
                  <Icon name="dots" size={16} />
                </span>
              </button>
            ))}
          </div>
        ))}
        {sessions.length === 0 && (
          <div
            style={{
              padding: "24px 12px",
              textAlign: "center",
              fontSize: 13,
              color: "var(--ink-4)",
            }}
          >
            {t.noHistory}
          </div>
        )}
      </div>

      <div className="sidebar-foot">
        <button className="user-pill" onClick={() => setProfileOpen(!profileOpen)}>
          <div className="avatar">{user.initials}</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              minWidth: 0,
              flex: 1,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--ink)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 180,
              }}
            >
              {user.name}
            </span>
            <span style={{ fontSize: 11, color: "var(--ink-3)" }}>
              {t.conversations.replace("{n}", String(sessions.length))}
            </span>
          </div>
          <Icon name="chevDown" size={14} />
        </button>

        {profileOpen && (
          <ProfileMenu
            user={user}
            onClose={() => setProfileOpen(false)}
            onSignOut={handleSignOut}
            menu={t.menu}
          />
        )}
      </div>
    </aside>
  )
}
