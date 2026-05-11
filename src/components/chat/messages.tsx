"use client"

import { Icon } from "@/components/icons"
import { useDictionary } from "@/lib/i18n-context"
import type { Message } from "@/lib/types"

function BotAvatar() {
  return (
    <div className="bot-avatar">
      <Icon name="spark" size={16} stroke={1.8} />
    </div>
  )
}

export function UserMessage({ text }: { text: string }) {
  return (
    <div className="msg-row user">
      <div className="msg-bubble">{text}</div>
    </div>
  )
}

export function BotMessage({
  children,
  time,
  streaming = false,
  showActions = true,
}: {
  children: React.ReactNode
  time?: string
  streaming?: boolean
  showActions?: boolean
}) {
  const { messages: t } = useDictionary()

  return (
    <div className="msg-row bot">
      <BotAvatar />
      <div className="msg-bubble">
        <div className="bot-content">
          {children}
          {streaming && <span className="caret" />}
        </div>
        {!streaming && showActions && time && (
          <div className="msg-meta">
            <span>{time}</span>
            <div className="msg-actions">
              <button className="msg-action" title={t.copy}>
                <Icon name="copy" size={14} />
              </button>
              <button className="msg-action" title={t.regenerate}>
                <Icon name="refresh" size={14} />
              </button>
              <button className="msg-action" title={t.like}>
                <Icon name="thumbUp" size={14} />
              </button>
              <button className="msg-action" title={t.dislike}>
                <Icon name="thumbDown" size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function TypingIndicator() {
  const { messages: t } = useDictionary()

  return (
    <div className="msg-row bot">
      <BotAvatar />
      <div className="msg-bubble">
        <span className="typing">
          <span>{t.thinking}</span>
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </span>
      </div>
    </div>
  )
}

export function MessageList({
  messages,
  isThinking,
}: {
  messages: Message[]
  isThinking: boolean
}) {
  const locale = "th-TH"

  return (
    <>
      {messages.map((m) =>
        m.senderRole === "USER" ? (
          <UserMessage key={m.id} text={m.content} />
        ) : (
          <BotMessage
            key={m.id}
            time={new Date(m.createdAt).toLocaleTimeString(locale, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          >
            <p>{m.content}</p>
          </BotMessage>
        )
      )}
      {isThinking && <TypingIndicator />}
    </>
  )
}
