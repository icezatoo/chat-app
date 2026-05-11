import type { ChatSession, Message } from "@/lib/types"

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8090"

async function req<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  })
  if (!res.ok) throw new Error(`API ${res.status} ${path}`)
  return res.json() as Promise<T>
}

export const api = {
  createSession: (token: string, title: string) =>
    req<ChatSession>("/sessions", token, { method: "POST", body: JSON.stringify({ title }) }),

  listSessions: (token: string) =>
    req<ChatSession[]>("/sessions", token),

  getHistory: (token: string, sessionId: string) =>
    req<Message[]>(`/sessions/${sessionId}/messages`, token),
}

export function wsUrl(token: string): string {
  const base = BASE.replace(/^http/, "ws")
  return `${base}/ws?token=${encodeURIComponent(token)}`
}
