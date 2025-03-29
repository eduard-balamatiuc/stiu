"use client"

import React, { useState, useRef, useEffect } from "react"
import type { Course, ContentBlock, Chapter } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DndProvider, useDragLayer } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { SearchIcon, ChevronDownIcon, ChevronRightIcon, GripVerticalIcon, FileTextIcon, FileIcon, CheckSquareIcon, VideoIcon, HelpCircleIcon, LinkIcon } from "lucide-react"
import ContentBlockComponent from "./content-block"

// Drag preview component
const DragPreview = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  if (!isDragging || !currentOffset || !item) {
    return null
  }

  const { x, y } = currentOffset
  const transform = `translate(${x}px, ${y}px)`

  const getIcon = () => {
    switch (item.type) {
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
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 100,
        left: 0,
        top: 0,
        transform,
        width: '300px',
      }}
    >
      <div 
        className="p-2 rounded-lg bg-white/90 dark:bg-slate-800/90 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="flex items-center gap-2">
          {getIcon()}
          <div className="line-clamp-1 text-sm font-medium">{item.content}</div>
        </div>
      </div>
    </div>
  )
}

interface ContentEditorProps {
  course: Course
  onUpdateCourse: (course: Course) => void
}

function ContentEditorInner({ course, onUpdateCourse }: ContentEditorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({})
  const [draggedBlockInfo, setDraggedBlockInfo] = useState<{ block: ContentBlock, chapterId: string, index: number } | null>(null)
  const [activeDropZone, setActiveDropZone] = useState<{ chapterId: string, index: number } | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  // Add this useEffect to properly handle drag end events
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      setDraggedBlockInfo(null)
      setActiveDropZone(null)
      setIsDragOver(false)
    }

    window.addEventListener('dragend', handleGlobalDragEnd)
    window.addEventListener('drop', handleGlobalDragEnd)
    
    return () => {
      window.removeEventListener('dragend', handleGlobalDragEnd)
      window.removeEventListener('drop', handleGlobalDragEnd)
    }
  }, [])

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

  // Handle dropping a generated block into the editor
  const handleEditorDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const data = e.dataTransfer.getData("text")
    try {
      const blockData = JSON.parse(data)
      if (blockData && blockData.type === 'generated-block' && course.chapters.length > 0) {
        // Ensure the block has a unique ID to avoid duplication issues
        const blockToAdd = {
          ...blockData.item,
          id: blockData.item.id || `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }
        
        // If we have an active drop zone, use it for positioning
        if (activeDropZone) {
          const { chapterId, index } = activeDropZone;
          const updatedChapters = [...course.chapters];
          
          // Find the target chapter
          const chapterIndex = updatedChapters.findIndex(ch => ch.id === chapterId);
          if (chapterIndex !== -1) {
            // Copy the chapter's blocks and insert the new block at the specified index
            const updatedBlocks = [...updatedChapters[chapterIndex].blocks];
            updatedBlocks.splice(index, 0, blockToAdd);
            
            // Update the chapter with the new blocks array
            updatedChapters[chapterIndex] = {
              ...updatedChapters[chapterIndex],
              blocks: updatedBlocks
            };
            
            // Update the course with the modified chapters
            onUpdateCourse({
              ...course,
              chapters: updatedChapters,
            });
          }
        } else {
          // Fallback: Add to the first chapter if no active drop zone
          const updatedChapters = [...course.chapters]
          updatedChapters[0] = {
            ...updatedChapters[0],
            blocks: [...updatedChapters[0].blocks, blockToAdd],
          }

          onUpdateCourse({
            ...course,
            chapters: updatedChapters,
          })
        }
      }
    } catch (error) {
      console.error("Failed to parse drop data", error)
    }
    setIsDragOver(false)
    // Reset the active drop zone after handling the drop
    setActiveDropZone(null)
  }

  // Handle starting the drag operation
  const handleDragStart = (e: React.DragEvent, block: ContentBlock, chapterId: string, index: number) => {
    setDraggedBlockInfo({ block, chapterId, index })
    e.dataTransfer.setData('text/plain', JSON.stringify({ 
      type: 'content-block', 
      item: block,
      sourceChapterId: chapterId,
      sourceIndex: index
    }))
    e.dataTransfer.effectAllowed = 'move'
    
    // Create a custom drag image
    const ghostElement = document.createElement('div')
    ghostElement.className = 'bg-white p-2 border rounded shadow-md w-48'
    ghostElement.textContent = block.content.substring(0, 30) + (block.content.length > 30 ? '...' : '')
    document.body.appendChild(ghostElement)
    e.dataTransfer.setDragImage(ghostElement, 20, 20)
    
    // Remove the element after a short delay
    setTimeout(() => {
      document.body.removeChild(ghostElement)
    }, 0)
  }

  // Handle dropping a block within the chapter list or into another chapter
  const handleBlockDrop = (e: React.DragEvent, targetChapterId: string, targetIndex: number) => {
    e.preventDefault()
    
    try {
      // Try first as text/plain (for internal blocks)
      let data = e.dataTransfer.getData('text/plain');
      
      // If that fails, try as text (for generated blocks)
      if (!data) {
        data = e.dataTransfer.getData('text');
      }
      
      // Parse the data
      const dropData = JSON.parse(data);
      
      // Handle different types of blocks
      if (dropData.type === 'content-block') {
        // Handle existing content blocks
        if (!dropData.item) return;
        
        const block = dropData.item;
        const sourceChapterId = dropData.sourceChapterId;
        const sourceIndex = dropData.sourceIndex;
        
        // Create a copy of the chapters array
        const updatedChapters = [...course.chapters];
        
        // If dropping within the same chapter
        if (sourceChapterId === targetChapterId) {
          // Get the chapter
          const chapter = updatedChapters.find(ch => ch.id === sourceChapterId);
          if (!chapter) return;
          
          // Create a copy of the blocks
          const updatedBlocks = [...chapter.blocks];
          
          // Remove the block from its original position
          updatedBlocks.splice(sourceIndex, 1);
          
          // Insert the block at the new position
          updatedBlocks.splice(targetIndex <= sourceIndex ? targetIndex : targetIndex - 1, 0, block);
          
          // Update the chapter
          const chapterIndex = updatedChapters.findIndex(ch => ch.id === sourceChapterId);
          updatedChapters[chapterIndex] = {
            ...chapter,
            blocks: updatedBlocks
          };
        } else {
          // If moving between chapters
          // Get the source and target chapters
          const sourceChapter = updatedChapters.find(ch => ch.id === sourceChapterId);
          const targetChapter = updatedChapters.find(ch => ch.id === targetChapterId);
          
          if (!sourceChapter || !targetChapter) return;
          
          // Remove the block from the source chapter
          const sourceBlocks = [...sourceChapter.blocks];
          sourceBlocks.splice(sourceIndex, 1);
          
          // Add the block to the target chapter
          const targetBlocks = [...targetChapter.blocks];
          targetBlocks.splice(targetIndex, 0, block);
          
          // Update both chapters
          const sourceChapterIndex = updatedChapters.findIndex(ch => ch.id === sourceChapterId);
          const targetChapterIndex = updatedChapters.findIndex(ch => ch.id === targetChapterId);
          
          updatedChapters[sourceChapterIndex] = {
            ...sourceChapter,
            blocks: sourceBlocks
          };
          
          updatedChapters[targetChapterIndex] = {
            ...targetChapter,
            blocks: targetBlocks
          };
        }
        
        // Update the course with the new chapters
        onUpdateCourse({
          ...course,
          chapters: updatedChapters
        });
      } else if (dropData.type === 'generated-block') {
        // Handle generated blocks
        const blockToAdd = {
          ...dropData.item,
          id: dropData.item.id || `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        
        // Find the target chapter
        const updatedChapters = [...course.chapters];
        const chapterIndex = updatedChapters.findIndex(ch => ch.id === targetChapterId);
        
        if (chapterIndex !== -1) {
          // Get the target chapter blocks
          const targetBlocks = [...updatedChapters[chapterIndex].blocks];
          
          // Insert the new block at the specified position
          targetBlocks.splice(targetIndex, 0, blockToAdd);
          
          // Update the chapter
          updatedChapters[chapterIndex] = {
            ...updatedChapters[chapterIndex],
            blocks: targetBlocks
          };
          
          // Update the course
          onUpdateCourse({
            ...course,
            chapters: updatedChapters
          });
        }
      }
    } catch (error) {
      console.error("Error handling block drop:", error)
    }
    
    // Reset states
    setDraggedBlockInfo(null)
    setActiveDropZone(null)
  }

  // Handle drag over for drop indicators
  const handleDragOver = (e: React.DragEvent, chapterId: string, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveDropZone({ chapterId, index })
  }

  // Handle drag leave to clear drop indicators
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveDropZone(null)
  }

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
        ref={editorRef}
        className={`flex-1 overflow-y-auto p-4 ${
          isDragOver
            ? "bg-blue-50/50 dark:bg-blue-900/10 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-xl"
            : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          
          // Try to detect if we're dragging over a chapter
          // This will help us find the nearest chapter when dropping
          const chaptersElements = editorRef.current?.querySelectorAll('[data-chapter-id]');
          if (chaptersElements && chaptersElements.length > 0) {
            // Get the positions of chapters
            const chaptersPositions = Array.from(chaptersElements).map(element => {
              const rect = element.getBoundingClientRect();
              return {
                chapterId: element.getAttribute('data-chapter-id'),
                top: rect.top,
                bottom: rect.bottom,
                element
              };
            });
            
            // Find the closest chapter based on mouse position
            const mouseY = e.clientY;
            let closestChapter = null;
            
            for (const chapter of chaptersPositions) {
              if (mouseY >= chapter.top && mouseY <= chapter.bottom) {
                closestChapter = chapter;
                break;
              }
            }
            
            // If we found a closest chapter, set it as active drop zone
            if (closestChapter && closestChapter.chapterId) {
              const chapter = course.chapters.find(c => c.id === closestChapter.chapterId);
              if (chapter) {
                // Default to placing at the end of the chapter
                setActiveDropZone({ 
                  chapterId: closestChapter.chapterId, 
                  index: chapter.blocks.length 
                });
              }
            }
          }
          
          setIsDragOver(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setIsDragOver(false)
        }}
        onDrop={handleEditorDrop}
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
            <div key={chapter.id} className="mb-6" data-chapter-id={chapter.id}>
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
                <div className="ml-8 space-y-0">
                  {chapter.blocks.map((block, index) => (
                    <React.Fragment key={block.id}>
                      {/* Drop zone above block */}
                      <div 
                        className={`h-2 w-full my-1 rounded transition-all duration-200 ${
                          activeDropZone?.chapterId === chapter.id && activeDropZone?.index === index 
                            ? "bg-blue-200 dark:bg-blue-800 h-4" 
                            : "bg-transparent"
                        }`}
                        onDragOver={(e) => handleDragOver(e, chapter.id, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleBlockDrop(e, chapter.id, index)}
                      ></div>
                      
                      {/* Block */}
                      <div className="flex items-start group">
                        <div 
                          className="mt-1 mr-2 opacity-0 group-hover:opacity-100 cursor-move"
                          draggable
                          onDragStart={(e) => handleDragStart(e, block, chapter.id, index)}
                        >
                          <GripVerticalIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-grow">
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
                            onDelete={(blockToDelete) => {
                              const updatedBlocks = chapter.blocks.filter((b) => b.id !== blockToDelete.id)

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
                      </div>
                    </React.Fragment>
                  ))}

                  {/* Final drop zone */}
                  <div 
                    className={`h-2 w-full my-1 rounded transition-all duration-200 ${
                      activeDropZone?.chapterId === chapter.id && activeDropZone?.index === chapter.blocks.length 
                        ? "bg-blue-200 dark:bg-blue-800 h-4" 
                        : "bg-transparent"
                    }`}
                    onDragOver={(e) => handleDragOver(e, chapter.id, chapter.blocks.length)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleBlockDrop(e, chapter.id, chapter.blocks.length)}
                  ></div>

                  <Button
                    variant="outline"
                    className="w-full mt-4 border-dashed rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200"
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
          className="w-full apple-button text-base py-6"
          onClick={handleUpdateCourse}
        >
          Update Course
        </Button>
      </div>

      {/* Add the drag preview */}
      <DragPreview />
    </div>
  )
}

// Wrap the component with DndProvider
export default function ContentEditor(props: ContentEditorProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <ContentEditorInner {...props} />
    </DndProvider>
  )
}