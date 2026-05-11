export interface ChatSession {
  id: string
  customerId: string
  title: string
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  sessionId: string
  senderRole: "USER" | "BOT"
  content: string
  messageType: "TEXT" | "IMAGE" | "HTML"
  status: "PENDING" | "SENT" | "FAILED"
  createdAt: string
}

export interface WsIncoming {
  sessionId: string
  content: string
  messageType: "TEXT" | "IMAGE" | "HTML"
}

export interface WsOutgoing extends Message {
  error?: string
}
