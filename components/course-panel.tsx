"use client"

import { useState } from "react"
import type { Course, Chat } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon, ChevronDownIcon, ChevronRightIcon, MessageSquareIcon } from "lucide-react"

interface CoursePanelProps {
  courses: Course[]
  selectedCourse: Course | null
  selectedChat: Chat | null
  onCreateCourse: (title: string) => void
  onSelectCourse: (course: Course) => void
  onCreateChat: (courseId: string, chatName: string) => void
  onSelectChat: (courseId: string, chatId: string) => void
}

export default function CoursePanel({
  courses,
  selectedCourse,
  selectedChat,
  onCreateCourse,
  onSelectCourse,
  onCreateChat,
  onSelectChat,
}: CoursePanelProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newCourseTitle, setNewCourseTitle] = useState("")
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({})
  const [newChatName, setNewChatName] = useState("")
  const [isCreatingChat, setIsCreatingChat] = useState<string | null>(null)

  const handleCreateClick = () => {
    setIsCreating(true)
  }

  const handleCreateSubmit = () => {
    if (newCourseTitle.trim()) {
      onCreateCourse(newCourseTitle)
      setNewCourseTitle("")
      setIsCreating(false)
    }
  }

  const toggleCourseExpanded = (courseId: string) => {
    setExpandedCourses({
      ...expandedCourses,
      [courseId]: !expandedCourses[courseId],
    })
  }

  const handleCreateChat = (courseId: string) => {
    setIsCreatingChat(courseId)
  }

  const handleCreateChatSubmit = (courseId: string) => {
    if (newChatName.trim()) {
      onCreateChat(courseId, newChatName)
      setNewChatName("")
      setIsCreatingChat(null)
    }
  }

  return (
    <div className="h-full flex flex-col border-r bg-background">
      <div className="p-4 border-b border-border">
        <Button
          onClick={handleCreateClick}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
        >
          <PlusIcon className="h-4 w-4" />
          Create Course
        </Button>
      </div>

      {isCreating && (
        <div className="p-4 border-b border-border">
          <Input
            value={newCourseTitle}
            onChange={(e) => setNewCourseTitle(e.target.value)}
            placeholder="Course title"
            className="mb-2 w-full apple-input"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleCreateSubmit}
              className="flex-1 w-full rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
            >
              Create
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsCreating(false)}
              className="flex-1 w-full rounded-full border border-gray-300 dark:border-gray-700 transition-colors duration-200"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2">
        {courses.map((course) => (
          <div key={course.id} className="mb-2">
            <div
              className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedCourse?.id === course.id
                  ? "bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
              }`}
              onClick={() => onSelectCourse(course)}
            >
              <div className="flex items-center gap-2 flex-1 overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleCourseExpanded(course.id)
                  }}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  {expandedCourses[course.id] ? (
                    <ChevronDownIcon className="h-4 w-4" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4" />
                  )}
                </button>
                <span className="truncate font-medium">{course.title}</span>
              </div>
            </div>

            {expandedCourses[course.id] && (
              <div className="ml-6 mt-1 space-y-1">
                {course.chats &&
                  course.chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-pointer transition-all duration-200 ${
                        selectedChat?.id === chat.id ? "bg-blue-50 dark:bg-blue-900/20 shadow-sm" : ""
                      }`}
                      onClick={() => onSelectChat(course.id, chat.id)}
                    >
                      <MessageSquareIcon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                      <span className="text-sm">{chat.name}</span>
                    </div>
                  ))}

                {isCreatingChat === course.id ? (
                  <div className="p-2">
                    <Input
                      value={newChatName}
                      onChange={(e) => setNewChatName(e.target.value)}
                      placeholder="Chat name"
                      className="mb-2 text-sm w-full apple-input"
                      size={1}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleCreateChatSubmit(course.id)}
                        className="text-xs py-0 h-7 w-full rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                      >
                        Create
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsCreatingChat(null)}
                        className="text-xs py-0 h-7 w-full rounded-full border border-gray-300 dark:border-gray-700 transition-colors duration-200"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-pointer transition-all duration-200"
                    onClick={() => handleCreateChat(course.id)}
                  >
                    <PlusIcon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    <span className="text-sm">New Chat</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border flex justify-start">
        {/* Empty footer or add other controls if needed */}
      </div>
    </div>
  )
}

