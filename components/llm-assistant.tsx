"use client"

import { useState, useRef, useEffect } from "react"
import type { ContentBlock, LLMModel, Course, Chat, Message } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SendIcon, SettingsIcon, DatabaseIcon, PlusIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDrop } from "react-dnd"
import GeneratedContentBlock from "./generated-content-block"

interface LLMAssistantProps {
  selectedModel: LLMModel
  onChangeModel: (model: LLMModel) => void
  onGenerateContent: (content: ContentBlock) => void
  generatedContent: ContentBlock[]
  onAddContentToEditor: (content: ContentBlock) => void
  selectedCourse: Course
  selectedChat: Chat
  onUpdateChat: (chat: Chat) => void
  onOpenVectorDbManager: () => void
}

export default function LLMAssistant({
  selectedModel,
  onChangeModel,
  onGenerateContent,
  generatedContent,
  onAddContentToEditor,
  selectedCourse,
  selectedChat,
  onUpdateChat,
  onOpenVectorDbManager,
}: LLMAssistantProps) {
  const [input, setInput] = useState("")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful assistant for creating educational content for Moodle courses.",
  )

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedChat.messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: Date.now(),
    }

    const updatedMessages = [...selectedChat.messages, userMessage]

    onUpdateChat({
      ...selectedChat,
      messages: updatedMessages,
    })

    setInput("")
    setIsGenerating(true)

    // Simulate LLM response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: `Here's some content for your course about "${input}"`,
        timestamp: Date.now(),
      }

      const finalMessages = [...updatedMessages, assistantMessage]

      onUpdateChat({
        ...selectedChat,
        messages: finalMessages,
      })

      setIsGenerating(false)

      // Generate a content block
      const newContent: ContentBlock = {
        id: `gen-${Date.now()}`,
        type: "text",
        content: `This is generated content about "${input}". You can drag this to your course content.`,
      }

      onGenerateContent(newContent)
    }, 1500)
  }

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "generated-block",
    drop: (item: ContentBlock) => {
      onAddContentToEditor(item)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <div className="flex flex-col w-full h-full border-l border-border bg-card text-card-foreground apple-panel">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="font-semibold">{selectedChat.name}</h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        >
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </div>

      {isSettingsOpen && (
        <div className="p-4 border-b border-border space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">LLM Model</label>
            <Select value={selectedModel} onValueChange={(value) => onChangeModel(value as LLMModel)}>
              <SelectTrigger className="w-full apple-input">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="llama">Llama</SelectItem>
                <SelectItem value="deepseek">DeepSeek</SelectItem>
                <SelectItem value="mistral">Mistral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">System Prompt</label>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="min-h-[100px] w-full apple-input"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Vector Database</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-full border border-gray-300 dark:border-gray-700 transition-colors duration-200"
                onClick={onOpenVectorDbManager}
              >
                <DatabaseIcon className="h-4 w-4 mr-2" />
                Manage Content
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedChat.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Start a conversation with the AI assistant</p>
            </div>
          ) : (
            selectedChat.messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-xl p-3 shadow-sm ${
                    message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-foreground"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}

          {isGenerating && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-xl p-3 bg-gray-100 dark:bg-gray-800 text-foreground shadow-sm">
                <div className="flex space-x-2">
                  <div
                    className="h-2 w-2 rounded-full bg-blue-500 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 rounded-full bg-blue-500 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 rounded-full bg-blue-500 animate-bounce"
                    style={{ animationDelay: "600ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {generatedContent.length > 0 && (
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm">Generated Content</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={() =>
                  onGenerateContent({
                    id: `gen-${Date.now()}`,
                    type: "text",
                    content: "This is a sample generated content block.",
                  })
                }
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            <div
              ref={drop}
              className={`space-y-2 max-h-40 overflow-y-auto ${isOver ? "bg-blue-50/50 dark:bg-blue-900/10 rounded-xl" : ""}`}
            >
              {generatedContent.map((content) => (
                <GeneratedContentBlock key={content.id} content={content} onAddToEditor={onAddContentToEditor} />
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI assistant..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="w-full apple-input"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isGenerating}
              className="h-10 w-10 p-0 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
            >
              <SendIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

