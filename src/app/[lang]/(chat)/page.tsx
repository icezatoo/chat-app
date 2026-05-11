"use client"

import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { Sidebar } from "@/components/chat/sidebar"
import { Topbar } from "@/components/chat/topbar"
import { Composer } from "@/components/chat/composer"
import { EmptyState } from "@/components/chat/empty-state"
import { MessageList } from "@/components/chat/messages"
import { useChat } from "@/hooks/use-chat"
import { useDictionary } from "@/lib/i18n-context"

function userInfo(session: ReturnType<typeof useSession>["data"], fallbackName: string) {
  const name = session?.user?.name ?? fallbackName
  const email = session?.user?.email ?? ""
  const firstName = name.split(" ")[0] ?? name
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  return { name, email, firstName, initials }
}

export default function ChatPage() {
  const { data: session } = useSession()
  const accessToken = (session as { accessToken?: string } | null)?.accessToken
  const dict = useDictionary()

  const {
    sessions,
    activeSession,
    messages,
    streamPhase,
    toast,
    sendMessage,
    selectSession,
    newChat,
    showToast,
  } = useChat(accessToken)

  const [draft, setDraft] = useState("")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const chatScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [messages.length, streamPhase])

  const handleSend = (text?: string) => {
    const t = text ?? draft
    if (!t.trim()) return
    setDraft("")
    sendMessage(t)
  }

  const handleSelectSession = (id: string) => {
    const s = sessions.find((x) => x.id === id)
    if (!s) return
    selectSession(s)
    if (isMobile) setMobileOpen(false)
  }

  const handleNewChat = () => {
    newChat()
    if (isMobile) setMobileOpen(false)
  }

  const user = userInfo(session, dict.common.fallbackUserName)
  const showEmpty = !activeSession && messages.length === 0
  const isThinking = streamPhase === "thinking"
  const showSidebarInGrid = isMobile ? true : !sidebarCollapsed

  const currentTitle = activeSession?.title ?? dict.topbar.newChat

  const startedSub = activeSession
    ? dict.topbar.startedOn.replace(
        "{date}",
        new Date(activeSession.createdAt).toLocaleDateString("th-TH", {
          day: "numeric",
          month: "short",
        })
      )
    : undefined

  return (
    <div
      className={[
        "app",
        !isMobile && sidebarCollapsed ? "sidebar-collapsed" : "",
        isMobile && mobileOpen ? "mobile-open" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {isMobile && <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />}

      {showSidebarInGrid && (
        <Sidebar
          sessions={sessions}
          activeId={activeSession?.id ?? null}
          onSelect={handleSelectSession}
          onNewChat={handleNewChat}
          onToggle={() => (isMobile ? setMobileOpen(false) : setSidebarCollapsed(true))}
          user={user}
        />
      )}

      <div className="main">
        <Topbar
          title={currentTitle}
          sub={startedSub}
          onShare={() => showToast(dict.chat.shareCopied)}
          sidebarCollapsed={isMobile ? !mobileOpen : sidebarCollapsed}
          onExpand={() => (isMobile ? setMobileOpen(true) : setSidebarCollapsed(false))}
        />

        <div className="chat-area scroll" ref={chatScrollRef}>
          {showEmpty ? (
            <EmptyState firstName={user.firstName} onPick={handleSend} />
          ) : (
            <div className="chat-inner">
              <MessageList messages={messages} isThinking={isThinking} />
            </div>
          )}
        </div>

        <Composer
          value={draft}
          onChange={setDraft}
          onSend={() => handleSend()}
          disabled={isThinking}
          hint={activeSession ? dict.composer.continuePlaceholder : undefined}
        />
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
