"use client"

import React, { useState, useEffect } from "react"
import type { ContentBlock } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { FileTextIcon, FileIcon, CheckSquareIcon, VideoIcon, HelpCircleIcon, LinkIcon, MoveIcon } from "lucide-react"

interface GeneratedContentBlockProps {
  content: ContentBlock
  onAddToEditor: (content: ContentBlock) => void
}

export default function GeneratedContentBlock({ content, onAddToEditor }: GeneratedContentBlockProps) {
  const [isDragging, setIsDragging] = useState(false)

  // Add useEffect to ensure dragging state is always reset
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      setIsDragging(false)
    }

    window.addEventListener('dragend', handleGlobalDragEnd)
    window.addEventListener('drop', handleGlobalDragEnd)
    
    return () => {
      window.removeEventListener('dragend', handleGlobalDragEnd)
      window.removeEventListener('drop', handleGlobalDragEnd)
    }
  }, [])

  // Ensure the dragging state is reset with a timeout
  const resetDragState = () => {
    setTimeout(() => {
      setIsDragging(false)
    }, 50)
  }

  const getIcon = () => {
    switch (content.type) {
      case "text":
        return <FileTextIcon className="h-4 w-4 text-blue-500" />
      case "file":
        return <FileIcon className="h-4 w-4 text-green-500" />
      case "task":
        return <CheckSquareIcon className="h-4 w-4 text-orange-500" />
      case "video":
        return <VideoIcon className="h-4 w-4 text-red-500" />
      case "quiz":
        return <HelpCircleIcon className="h-4 w-4 text-purple-500" />
      case "link":
        return <LinkIcon className="h-4 w-4 text-cyan-500" />
      default:
        return <FileTextIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    
    // Create a deep copy of the content with a new ID to ensure uniqueness
    const contentCopy = {
      ...content,
      id: `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    
    e.dataTransfer.setData('text', JSON.stringify({
      type: 'generated-block',
      item: contentCopy
    }))
    e.dataTransfer.effectAllowed = 'copy'
    
    // Create a custom drag image
    const ghostElement = document.createElement('div')
    ghostElement.className = 'bg-white p-2 border rounded shadow-md w-48'
    ghostElement.textContent = content.content.substring(0, 30) + (content.content.length > 30 ? '...' : '')
    document.body.appendChild(ghostElement)
    e.dataTransfer.setDragImage(ghostElement, 20, 20)
    
    // Remove the element after a short delay
    setTimeout(() => {
      document.body.removeChild(ghostElement)
    }, 0)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    resetDragState()
    
    // Only add to editor if the drop was successful AND it's a move operation
    // This prevents duplicate blocks from being created
    if (e.dataTransfer.dropEffect === 'move') {
      try {
        // Don't automatically call onAddToEditor here
        // Let the drop handler in ContentEditor handle it
      } catch (error) {
        console.error("Error in drag end:", error)
      }
    }
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`cursor-move transition-all duration-200 ${
        isDragging 
          ? "opacity-50 border-2 border-dashed border-blue-300 dark:border-blue-700" 
          : "opacity-100"
      }`}
    >
      <Card className="w-full hover:shadow-md transition-shadow apple-card">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <div className="mt-1">{getIcon()}</div>
            <div className="flex-1 text-sm line-clamp-2">{content.content}</div>
            <div className="mt-1">
              <MoveIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

