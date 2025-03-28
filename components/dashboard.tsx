"use client"

import { useState, useEffect } from "react"
import CoursePanel from "./course-panel"
import ContentEditor from "./content-editor"
import LLMAssistant from "./llm-assistant"
import VectorDbManager from "./vector-db-manager"
import type { Course, ContentBlock, LLMModel, Chat } from "@/lib/types"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      title: "Introduction to Computer Science",
      chapters: [
        {
          id: "ch1",
          title: "Chapter 1: Fundamentals",
          blocks: [
            {
              id: "b1",
              type: "text",
              content: "This course introduces the basic concepts of computer science.",
            },
            {
              id: "b2",
              type: "task",
              content: "Research the history of computing and write a 500-word summary.",
            },
          ],
        },
      ],
      chats: [
        {
          id: "chat1",
          name: "General",
          messages: [],
        },
      ],
      vectorDb: [],
      selectedModel: "llama",
    },
  ])

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(courses[0])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(
    selectedCourse?.chats && selectedCourse.chats.length > 0 ? selectedCourse.chats[0] : null,
  )
  const [generatedContent, setGeneratedContent] = useState<ContentBlock[]>([])

  const [leftPanelWidth, setLeftPanelWidth] = useState(250)
  const [rightPanelWidth, setRightPanelWidth] = useState(350)
  const [isResizingLeft, setIsResizingLeft] = useState(false)
  const [isResizingRight, setIsResizingRight] = useState(false)
  const [showVectorDbManager, setShowVectorDbManager] = useState(false)

  // Update selected chat when course changes
  useEffect(() => {
    if (selectedCourse?.chats && selectedCourse.chats.length > 0) {
      setSelectedChat(selectedCourse.chats[0])
    } else {
      setSelectedChat(null)
    }
  }, [selectedCourse])

  // Mouse event handlers for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) {
        const newWidth = e.clientX
        setLeftPanelWidth(Math.max(200, Math.min(newWidth, 500)))
      } else if (isResizingRight) {
        const newWidth = window.innerWidth - e.clientX
        setRightPanelWidth(Math.max(250, Math.min(newWidth, 600)))
      }
    }

    const handleMouseUp = () => {
      setIsResizingLeft(false)
      setIsResizingRight(false)
    }

    if (isResizingLeft || isResizingRight) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizingLeft, isResizingRight])

  const handleCreateCourse = (title: string) => {
    const newCourse: Course = {
      id: `course-${courses.length + 1}`,
      title,
      chapters: [],
      chats: [
        {
          id: `chat-${Date.now()}`,
          name: "General",
          messages: [],
        },
      ],
      selectedModel: "llama",
    }
    setCourses([...courses, newCourse])
    setSelectedCourse(newCourse)
  }

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses(courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)))
    setSelectedCourse(updatedCourse)
  }

  const handleGenerateContent = (content: ContentBlock) => {
    setGeneratedContent([...generatedContent, content])
  }

  const handleAddContentToEditor = (content: ContentBlock) => {
    if (selectedCourse && selectedCourse.chapters.length > 0) {
      const updatedCourse = { ...selectedCourse }
      updatedCourse.chapters[0].blocks.push(content)
      handleUpdateCourse(updatedCourse)

      // Remove from generated content
      setGeneratedContent(generatedContent.filter((c) => c.id !== content.id))
    }
  }

  const handleCreateChat = (courseId: string, chatName: string) => {
    const course = courses.find((c) => c.id === courseId)
    if (course) {
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        name: chatName,
        messages: [],
      }

      const updatedCourse = {
        ...course,
        chats: [...(course.chats || []), newChat],
      }

      setCourses(courses.map((c) => (c.id === courseId ? updatedCourse : c)))
      setSelectedCourse(updatedCourse)
      setSelectedChat(newChat)
    }
  }

  const handleSelectChat = (courseId: string, chatId: string) => {
    const course = courses.find((c) => c.id === courseId)
    if (course && course.chats) {
      const chat = course.chats.find((c) => c.id === chatId)
      if (chat) {
        setSelectedChat(chat)
      }
    }
  }

  const handleUpdateChat = (updatedChat: Chat) => {
    if (selectedCourse && selectedCourse.chats) {
      const updatedChats = selectedCourse.chats.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))

      const updatedCourse = {
        ...selectedCourse,
        chats: updatedChats,
      }

      handleUpdateCourse(updatedCourse)
      setSelectedChat(updatedChat)
    }
  }

  const handleChangeModel = (model: LLMModel) => {
    if (selectedCourse) {
      const updatedCourse = {
        ...selectedCourse,
        selectedModel: model,
      }
      handleUpdateCourse(updatedCourse)
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <div style={{ width: `${leftPanelWidth}px`, flexShrink: 0 }} className="h-full">
          <CoursePanel
            courses={courses}
            selectedCourse={selectedCourse}
            selectedChat={selectedChat}
            onCreateCourse={handleCreateCourse}
            onSelectCourse={setSelectedCourse}
            onCreateChat={handleCreateChat}
            onSelectChat={handleSelectChat}
          />
        </div>

        <div
          className="w-1 bg-border cursor-col-resize hover:bg-primary active:bg-primary transition-colors"
          onMouseDown={() => setIsResizingLeft(true)}
        />

        <div className="flex-1 overflow-hidden h-full">
          {selectedCourse && <ContentEditor course={selectedCourse} onUpdateCourse={handleUpdateCourse} />}
        </div>

        <div
          className="w-1 bg-border cursor-col-resize hover:bg-primary active:bg-primary transition-colors"
          onMouseDown={() => setIsResizingRight(true)}
        />

        <div style={{ width: `${rightPanelWidth}px`, flexShrink: 0 }} className="h-full relative">
          {/* <div className="absolute top-4 right-4 z-10">
            <ThemeToggle />
          </div> */}

          {selectedCourse && selectedChat && (
            <LLMAssistant
              selectedModel={selectedCourse.selectedModel || "llama"}
              onChangeModel={handleChangeModel}
              onGenerateContent={handleGenerateContent}
              generatedContent={generatedContent}
              onAddContentToEditor={handleAddContentToEditor}
              selectedCourse={selectedCourse}
              selectedChat={selectedChat}
              onUpdateChat={handleUpdateChat}
              onOpenVectorDbManager={() => setShowVectorDbManager(true)}
            />
          )}
        </div>

        {showVectorDbManager && selectedCourse && (
          <VectorDbManager
            course={selectedCourse}
            onClose={() => setShowVectorDbManager(false)}
            onUpdateCourse={handleUpdateCourse}
          />
        )}
      </div>
    </DndProvider>
  )
}

