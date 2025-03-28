export type LLMModel = "llama" | "deepseek" | "mistral"

export interface ContentBlock {
  id: string
  type: "text" | "file" | "task" | "video" | "quiz" | "link"
  content: string
  metadata?: Record<string, any>
}

export interface Chapter {
  id: string
  title: string
  blocks: ContentBlock[]
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

export interface Chat {
  id: string
  name: string
  messages: Message[]
}

export interface Course {
  id: string
  title: string
  chapters: Chapter[]
  chats?: Chat[]
  vectorDb?: VectorDbFile[]
  selectedModel?: LLMModel
}

export interface VectorDbFile {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: number
}

