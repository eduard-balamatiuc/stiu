"use client"

import type { ContentBlock } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { FileTextIcon, FileIcon, CheckSquareIcon, VideoIcon, HelpCircleIcon, LinkIcon, MoveIcon } from "lucide-react"
import { useDrag } from "react-dnd"

interface GeneratedContentBlockProps {
  content: ContentBlock
  onAddToEditor: (content: ContentBlock) => void
}

export default function GeneratedContentBlock({ content, onAddToEditor }: GeneratedContentBlockProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "generated-block",
    item: content,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult()
      if (item && dropResult) {
        onAddToEditor(content)
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

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

  return (
    <div
      ref={drag}
      className={`cursor-move ${isDragging ? "opacity-50 border-2 border-dashed border-blue-300 dark:border-blue-700" : "opacity-100"}`}
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

