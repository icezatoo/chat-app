"use client"

import { Icon } from "@/components/icons"
import { useDictionary } from "@/lib/i18n-context"
import { LangSwitcher } from "@/components/lang-switcher"

export function Topbar({
  title,
  sub,
  onShare,
  sidebarCollapsed,
  onExpand,
}: {
  title: string
  sub?: string
  onShare?: () => void
  sidebarCollapsed: boolean
  onExpand: () => void
}) {
  const { topbar: t } = useDictionary()

  return (
    <div className="topbar">
      {sidebarCollapsed && (
        <button className="btn-icon" onClick={onExpand}>
          <Icon name="sidebar" />
        </button>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
        <div className="chat-title">{title}</div>
        {sub && <div className="chat-sub">{sub}</div>}
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
        <LangSwitcher />
        <button className="btn-icon" title={t.share} onClick={onShare}>
          <Icon name="share" size={16} />
        </button>
        <button className="btn-icon" title={t.more}>
          <Icon name="dots" size={18} />
        </button>
      </div>
    </div>
  )
}
