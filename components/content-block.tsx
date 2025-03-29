"use client"

import React, { useState, useEffect } from "react"
import type { ContentBlock } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  FileTextIcon,
  FileIcon,
  CheckSquareIcon,
  VideoIcon,
  HelpCircleIcon,
  LinkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Edit2Icon,
  Trash2Icon,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ContentBlockProps {
  block: ContentBlock
  onUpdate: (block: ContentBlock) => void
  onDelete: (block: ContentBlock) => void
}

export default function ContentBlockComponent({ block, onUpdate, onDelete }: ContentBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(block.content)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const handleDragEnd = () => {
      setIsDragging(false)
    }

    window.addEventListener('dragend', handleDragEnd)
    window.addEventListener('drop', handleDragEnd)
    
    return () => {
      window.removeEventListener('dragend', handleDragEnd)
      window.removeEventListener('drop', handleDragEnd)
    }
  }, [])

  useEffect(() => {
    setEditedContent(block.content);
  }, [block.content]);

  const resetDragState = () => {
    setTimeout(() => {
      setIsDragging(false)
    }, 50)
  }

  const getIcon = () => {
    switch (block.type) {
      case "text":
        return <FileTextIcon className="h-5 w-5 text-blue-500" />
      case "file":
        return <FileIcon className="h-5 w-5 text-green-500" />
      case "task":
        return <CheckSquareIcon className="h-5 w-5 text-orange-500" />
      case "video":
        return <VideoIcon className="h-5 w-5 text-red-500" />
      case "quiz":
        return <HelpCircleIcon className="h-5 w-5 text-purple-500" />
      case "link":
        return <LinkIcon className="h-5 w-5 text-cyan-500" />
      default:
        return <FileTextIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const handleTypeChange = (type: ContentBlock["type"]) => {
    onUpdate({
      ...block,
      type,
    })
  }

  const handleSaveEdit = () => {
    onUpdate({
      ...block,
      content: editedContent,
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (block && block.id) {
      onDelete(block);
    }
  }

  return (
    <div 
      className={`w-full transition-opacity duration-200 ${isDragging ? "opacity-40" : "opacity-100"}`}
      draggable
      onDragStart={(e) => {
        setIsDragging(true)
        e.dataTransfer.setData('application/json', JSON.stringify(block))
      }}
      onDragEnd={resetDragState}
    >
      <Card className={`w-full apple-card ${isDragging ? "border-2 border-blue-400 shadow-lg" : ""}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {getIcon()}
              <span className="font-medium text-sm">{block.type.charAt(0).toUpperCase() + block.type.slice(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    {getIcon()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="rounded-xl shadow-lg border border-gray-200 dark:border-gray-800"
                >
                  <DropdownMenuItem onClick={() => handleTypeChange("text")}>
                    <FileTextIcon className="h-4 w-4 text-blue-500 mr-2" />
                    Text
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTypeChange("file")}>
                    <FileIcon className="h-4 w-4 text-green-500 mr-2" />
                    File
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTypeChange("task")}>
                    <CheckSquareIcon className="h-4 w-4 text-orange-500 mr-2" />
                    Task
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTypeChange("video")}>
                    <VideoIcon className="h-4 w-4 text-red-500 mr-2" />
                    Video
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTypeChange("quiz")}>
                    <HelpCircleIcon className="h-4 w-4 text-purple-500 mr-2" />
                    Quiz
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTypeChange("link")}>
                    <LinkIcon className="h-4 w-4 text-cyan-500 mr-2" />
                    Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={() => setIsEditing(true)}
              >
                <Edit2Icon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-secondary transition-all duration-200"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full transition-all duration-200"
                onClick={handleDelete}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isEditing ? (
            <div className="mt-3">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[100px] apple-input"
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditedContent(block.content)
                    setIsEditing(false)
                  }}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  className="apple-button"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className={`mt-2 text-muted-foreground ${isExpanded ? "" : "line-clamp-2"}`}>{block.content}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

