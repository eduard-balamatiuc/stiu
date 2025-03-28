"use client"

import { useState } from "react"
import type { Course, ContentBlock, Chapter } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDrop, useDragLayer } from "react-dnd"
import { SearchIcon, ChevronDownIcon, ChevronRightIcon, GripVerticalIcon } from "lucide-react"
import ContentBlockComponent from "./content-block"

interface ContentEditorProps {
  course: Course
  onUpdateCourse: (course: Course) => void
}

export default function ContentEditor({ course, onUpdateCourse }: ContentEditorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({})

  const handleUpdateCourse = () => {
    // In a real app, this would save to the backend
    alert("Course updated successfully!")
  }

  const toggleChapterExpanded = (chapterId: string) => {
    setExpandedChapters({
      ...expandedChapters,
      [chapterId]: !expandedChapters[chapterId],
    })
  }

  const handleAddChapter = () => {
    const newChapter: Chapter = {
      id: `ch-${Date.now()}`,
      title: `Chapter ${course.chapters.length + 1}`,
      blocks: [],
    }

    onUpdateCourse({
      ...course,
      chapters: [...course.chapters, newChapter],
    })
  }

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ["content-block", "generated-block"],
    drop: (item: ContentBlock, monitor) => {
      if (item && course.chapters.length > 0) {
        // Add to the first chapter by default
        const updatedChapters = [...course.chapters]
        updatedChapters[0] = {
          ...updatedChapters[0],
          blocks: [...updatedChapters[0].blocks, item],
        }

        onUpdateCourse({
          ...course,
          chapters: updatedChapters,
        })

        return { dropped: true }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }))

  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  return (
    <div className="flex flex-col w-full h-full border-r border-border bg-card text-card-foreground apple-panel">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search content..."
            className="pl-10 w-full apple-input"
          />
        </div>
      </div>

      <div
        ref={drop}
        className={`flex-1 overflow-y-auto p-4 ${
          isOver && canDrop
            ? "bg-blue-50/50 dark:bg-blue-900/10 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-xl"
            : ""
        }`}
      >
        {course.chapters.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p className="mb-4">No chapters yet</p>
            <Button
              onClick={handleAddChapter}
              className="rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
            >
              Add Chapter
            </Button>
          </div>
        ) : (
          course.chapters.map((chapter) => (
            <div key={chapter.id} className="mb-6">
              <div className="flex items-center mb-2">
                <button
                  onClick={() => toggleChapterExpanded(chapter.id)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2 transition-colors duration-200"
                >
                  {expandedChapters[chapter.id] !== false ? (
                    <ChevronDownIcon className="h-5 w-5" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5" />
                  )}
                </button>
                <h2 className="text-lg font-semibold">{chapter.title}</h2>
              </div>

              {expandedChapters[chapter.id] !== false && (
                <div className="ml-8 space-y-4">
                  {chapter.blocks.map((block, index) => (
                    <div key={block.id} className="flex items-start group">
                      <div className="mt-1 mr-2 opacity-0 group-hover:opacity-100 cursor-move">
                        <GripVerticalIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <ContentBlockComponent
                        block={block}
                        onUpdate={(updatedBlock) => {
                          const updatedBlocks = [...chapter.blocks]
                          updatedBlocks[index] = updatedBlock

                          const updatedChapters = course.chapters.map((ch) =>
                            ch.id === chapter.id ? { ...ch, blocks: updatedBlocks } : ch,
                          )

                          onUpdateCourse({
                            ...course,
                            chapters: updatedChapters,
                          })
                        }}
                        onDelete={() => {
                          const updatedBlocks = chapter.blocks.filter((b) => b.id !== block.id)

                          const updatedChapters = course.chapters.map((ch) =>
                            ch.id === chapter.id ? { ...ch, blocks: updatedBlocks } : ch,
                          )

                          onUpdateCourse({
                            ...course,
                            chapters: updatedChapters,
                          })
                        }}
                      />
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    className="w-full border-dashed rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200"
                    onClick={() => {
                      const newBlock: ContentBlock = {
                        id: `block-${Date.now()}`,
                        type: "text",
                        content: "New content block",
                      }

                      const updatedChapters = course.chapters.map((ch) =>
                        ch.id === chapter.id ? { ...ch, blocks: [...ch.blocks, newBlock] } : ch,
                      )

                      onUpdateCourse({
                        ...course,
                        chapters: updatedChapters,
                      })
                    }}
                  >
                    Add Content Block
                  </Button>
                </div>
              )}
            </div>
          ))
        )}

        {course.chapters.length > 0 && (
          <Button
            variant="outline"
            className="w-full border-dashed mb-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200"
            onClick={handleAddChapter}
          >
            Add Chapter
          </Button>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <Button
          className="w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
          onClick={handleUpdateCourse}
        >
          Update Course
        </Button>
      </div>
    </div>
  )
}

