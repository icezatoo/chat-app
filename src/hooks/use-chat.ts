"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { api, wsUrl } from "@/lib/api"
import { useDictionary } from "@/lib/i18n-context"
import type { ChatSession, Message, WsOutgoing } from "@/lib/types"

// NOTE: Browser WebSocket cannot set Authorization headers.
// The backend's extractBearer must also check the "token" query param:
//   if q := r.URL.Query().Get("token"); q != "" { return q }

export type StreamPhase = "idle" | "thinking" | "done"

export function useChat(accessToken: string | undefined) {
  const { chat: { errors } } = useDictionary()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [streamPhase, setStreamPhase] = useState<StreamPhase>("idle")
  const [toast, setToast] = useState<string | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const tokenRef = useRef(accessToken)
  tokenRef.current = accessToken

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }

  useEffect(() => {
    if (!accessToken) return
    api.listSessions(accessToken).then(setSessions).catch(console.error)
  }, [accessToken])

  useEffect(() => {
    if (!accessToken) return

    const ws = new WebSocket(wsUrl(accessToken))
    wsRef.current = ws

    ws.onmessage = (ev) => {
      try {
        const msg: WsOutgoing = JSON.parse(ev.data as string)
        if (msg.error) {
          showToast(errors.serverError.replace("{error}", msg.error))
          setStreamPhase("idle")
          return
        }
        if (msg.senderRole === "USER") {
          setMessages((prev) => [...prev, msg])
          setStreamPhase("thinking")
        } else if (msg.senderRole === "BOT") {
          setMessages((prev) => [...prev, msg])
          setStreamPhase("done")
          setTimeout(() => setStreamPhase("idle"), 300)
        }
      } catch {
        // ignore parse errors
      }
    }

    ws.onerror = () => showToast(errors.wsError)
    ws.onclose = () => {
      if (wsRef.current === ws) wsRef.current = null
    }

    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [accessToken])

  const createSession = useCallback(
    async (title: string): Promise<ChatSession | null> => {
      if (!tokenRef.current) return null
      try {
        const s = await api.createSession(tokenRef.current, title)
        setSessions((prev) => [s, ...prev])
        return s
      } catch {
        showToast(errors.createSession)
        return null
      }
    },
    [errors.createSession]
  )

  const selectSession = useCallback(
    async (session: ChatSession) => {
      setActiveSession(session)
      setMessages([])
      setStreamPhase("idle")
      if (!tokenRef.current) return
      try {
        const history = await api.getHistory(tokenRef.current, session.id)
        setMessages(history)
      } catch {
        showToast(errors.loadHistory)
      }
    },
    [errors.loadHistory]
  )

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || streamPhase === "thinking") return

      let session = activeSession
      if (!session) {
        const title = trimmed.slice(0, 50)
        session = await createSession(title)
        if (!session) return
        setActiveSession(session)
        setMessages([])
      }

      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        showToast(errors.notConnected)
        return
      }

      setStreamPhase("thinking")
      wsRef.current.send(
        JSON.stringify({
          sessionId: session.id,
          content: trimmed,
          messageType: "TEXT",
        })
      )
    },
    [activeSession, streamPhase, createSession, errors.notConnected]
  )

  const newChat = useCallback(() => {
    setActiveSession(null)
    setMessages([])
    setStreamPhase("idle")
  }, [])

  return {
    sessions,
    activeSession,
    messages,
    streamPhase,
    toast,
    sendMessage,
    selectSession,
    newChat,
    showToast,
  }
}
