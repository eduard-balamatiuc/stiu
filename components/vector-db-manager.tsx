"use client"

import type React from "react"

import { useState } from "react"
import type { Course, VectorDbFile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FileIcon, UploadIcon, Trash2Icon } from "lucide-react"

interface VectorDbManagerProps {
  course: Course
  onClose: () => void
  onUpdateCourse: (course: Course) => void
}

export default function VectorDbManager({ course, onClose, onUpdateCourse }: VectorDbManagerProps) {
  const [files, setFiles] = useState<VectorDbFile[]>(course.vectorDb || [])
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true)

      // Simulate file upload
      setTimeout(() => {
        const newFiles: VectorDbFile[] = Array.from(e.target.files!).map((file) => ({
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: Date.now(),
        }))

        const updatedFiles = [...files, ...newFiles]
        setFiles(updatedFiles)
        setIsUploading(false)
      }, 1500)
    }
  }

  const handleDeleteFile = (fileId: string) => {
    const updatedFiles = files.filter((file) => file.id !== fileId)
    setFiles(updatedFiles)
  }

  const handleSave = () => {
    onUpdateCourse({
      ...course,
      vectorDb: files,
    })
    onClose()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB"
    else return (bytes / 1073741824).toFixed(1) + " GB"
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return "📄"
    if (fileType.includes("word") || fileType.includes("doc")) return "📝"
    if (fileType.includes("image")) return "🖼️"
    if (fileType.includes("video")) return "🎬"
    if (fileType.includes("audio")) return "🎵"
    if (fileType.includes("spreadsheet") || fileType.includes("excel")) return "📊"
    return "📁"
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[80vw] md:max-w-[600px] max-h-[80vh] flex flex-col apple-card">
        <DialogHeader>
          <DialogTitle>Vector Database Manager</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Files for {course.title}</h3>
              <div className="relative">
                <Input
                  type="file"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  className="rounded-full border border-gray-300 dark:border-gray-700 transition-colors duration-200"
                >
                  {isUploading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent mr-2" />
                  ) : (
                    <UploadIcon className="h-4 w-4 mr-2" />
                  )}
                  Upload Files
                </Button>
              </div>
            </div>

            {files.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                <FileIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p>No files uploaded yet</p>
                <p className="text-sm">Upload files to add them to the vector database</p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-xl">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getFileIcon(file.type)}</span>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors duration-200"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-full border border-gray-300 dark:border-gray-700 transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

