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
          title: "Chapter 1: Fundamentals of Computing",
          blocks: [
            {
              id: "b1",
              type: "text",
              content: "# Introduction to Computer Science\n\nComputer Science is the study of computers and computational systems. This course introduces the basic concepts, principles, and applications of computer science, covering both theoretical foundations and practical implementations.\n\nIn this course, you will learn about algorithms, data structures, programming paradigms, and computational thinking.",
            },
            {
              id: "b2",
              type: "file",
              content: "course_syllabus.pdf",
              metadata: {
                fileType: "pdf",
                size: 2450000,
                uploadedAt: 1689325200000
              }
            },
            {
              id: "b3",
              type: "text",
              content: "## Historical Context\n\nThe history of computing dates back to ancient calculation devices like the abacus. Modern computer science emerged in the mid-20th century with pioneers like Alan Turing, John von Neumann, and Ada Lovelace making significant contributions to the field.\n\nThe evolution of computers has seen several generations:\n- First generation: Vacuum tubes (1940s-1950s)\n- Second generation: Transistors (1950s-1960s)\n- Third generation: Integrated circuits (1960s-1970s)\n- Fourth generation: Microprocessors (1970s-present)\n- Fifth generation: Artificial Intelligence (emerging)",
            },
            {
              id: "b4",
              type: "task",
              content: "Research the history of computing and write a 500-word summary. Focus on a key innovation or inventor that you find particularly interesting and explain their impact on modern computing.",
            },
            {
              id: "b5",
              type: "video",
              content: "https://www.example.com/intro_to_cs_lecture1.mp4",
              metadata: {
                duration: 1845,
                title: "Lecture 1: Introduction to Computer Science",
                presenter: "Dr. Jane Smith"
              }
            },
            {
              id: "b6",
              type: "text",
              content: "## Binary and Data Representation\n\nAt the most fundamental level, computers store and process data in binary form (0s and 1s). Understanding binary representation is essential for computer scientists.\n\n### Binary Number System\n\nThe binary number system is a base-2 numeral system that uses only two digits: 0 and 1. Each digit position represents a power of 2, starting from the rightmost digit (2^0 = 1).\n\n**Examples:**\n- Binary 101 = 1×2^2 + 0×2^1 + 1×2^0 = 4 + 0 + 1 = 5 in decimal\n- Binary 1101 = 1×2^3 + 1×2^2 + 0×2^1 + 1×2^0 = 8 + 4 + 0 + 1 = 13 in decimal",
            },
            {
              id: "b7",
              type: "quiz",
              content: "binary_basics_quiz",
              metadata: {
                xmlContent: "<?xml version=\"1.0\" ?>\n<quiz>\n  <question type=\"category\">\n    <category>\n      <text>$course$/Computer Science Fundamentals</text>\n    </category>\n  </question>\n  <question type=\"multichoice\">\n    <name>\n      <text>Binary Conversion Question</text>\n    </name>\n    <questiontext format=\"html\">\n      <text>What is the decimal value of the binary number 1010?</text>\n    </questiontext>\n    <answer fraction=\"100\">\n      <text>10</text>\n      <feedback>\n        <text>Correct! 1×2^3 + 0×2^2 + 1×2^1 + 0×2^0 = 8 + 0 + 2 + 0 = 10</text>\n      </feedback>\n    </answer>\n    <answer fraction=\"0\">\n      <text>2</text>\n      <feedback>\n        <text>Incorrect. Try calculating the value of each bit position.</text>\n      </feedback>\n    </answer>\n    <answer fraction=\"0\">\n      <text>8</text>\n      <feedback>\n        <text>Incorrect. You might be missing some bit values.</text>\n      </feedback>\n    </answer>\n    <answer fraction=\"0\">\n      <text>12</text>\n      <feedback>\n        <text>Incorrect. Check your calculation again.</text>\n      </feedback>\n    </answer>\n  </question>\n  <question type=\"truefalse\">\n    <name>\n      <text>Binary Facts</text>\n    </name>\n    <questiontext format=\"html\">\n      <text>In binary, 2 is represented as 10.</text>\n    </questiontext>\n    <answer fraction=\"100\">\n      <text>true</text>\n      <feedback>\n        <text>Correct! In binary, 10 equals 1×2^1 + 0×2^0 = 2 in decimal.</text>\n      </feedback>\n    </answer>\n    <answer fraction=\"0\">\n      <text>false</text>\n      <feedback>\n        <text>Incorrect. In binary, 10 equals 1×2^1 + 0×2^0 = 2 in decimal.</text>\n      </feedback>\n    </answer>\n  </question>\n  <question type=\"numerical\">\n    <name>\n      <text>Binary Addition</text>\n    </name>\n    <questiontext format=\"html\">\n      <text>What is the decimal equivalent of the binary sum 101 + 011?</text>\n    </questiontext>\n    <answer fraction=\"100\">\n      <text>8</text>\n      <feedback>\n        <text>Correct! 101 (5 in decimal) + 011 (3 in decimal) = 1000 (8 in decimal)</text>\n      </feedback>\n    </answer>\n    <tolerance>0</tolerance>\n  </question>\n</quiz>"
              }
            }
          ],
        },
        {
          id: "ch2",
          title: "Chapter 2: Introduction to Algorithms",
          blocks: [
            {
              id: "ch2b1",
              type: "text",
              content: "# Introduction to Algorithms\n\nAn algorithm is a step-by-step procedure for solving a problem or accomplishing a task. Algorithms are the foundation of computer programming and are essential for creating efficient and effective software.\n\n## Key Characteristics of Algorithms\n\n1. **Finiteness**: An algorithm must terminate after a finite number of steps.\n2. **Definiteness**: Each step must be precisely defined.\n3. **Input**: An algorithm takes zero or more inputs.\n4. **Output**: An algorithm produces one or more outputs.\n5. **Effectiveness**: Each step must be simple enough to be carried out."
            },
            {
              id: "ch2b2",
              type: "text",
              content: "## Algorithm Analysis\n\nAlgorithm analysis is the process of determining the computational complexity of algorithms – the amount of time, storage, or other resources needed to execute them.\n\n### Big O Notation\n\nBig O notation is used to classify algorithms according to how their run time or space requirements grow as the input size grows.\n\nCommon time complexities:\n\n- O(1): Constant time - the algorithm takes the same amount of time regardless of input size\n- O(log n): Logarithmic time - common in divide and conquer algorithms\n- O(n): Linear time - the time grows linearly with input size\n- O(n log n): Log-linear time - common in efficient sorting algorithms like mergesort\n- O(n²): Quadratic time - common in nested loops and simple sorting algorithms\n- O(2^n): Exponential time - often seen in brute force algorithms"
            },
            {
              id: "ch2b3",
              type: "file",
              content: "algorithm_cheatsheet.pdf",
              metadata: {
                fileType: "pdf",
                size: 1750000,
                uploadedAt: 1689411600000
              }
            },
            {
              id: "ch2b4",
              type: "task",
              content: "Implement a simple sorting algorithm (such as bubble sort or insertion sort) in a programming language of your choice. Analyze its time complexity and explain how it performs with different input sizes."
            },
            {
              id: "ch2b5",
              type: "link",
              content: "https://visualgo.net/en/sorting",
              metadata: {
                title: "VisuAlgo - Sorting Algorithm Visualization",
                description: "Interactive visualization of various sorting algorithms"
              }
            },
            {
              id: "ch2b6",
              type: "quiz",
              content: "algorithm_basics_quiz",
              metadata: {
                xmlContent: "<?xml version=\"1.0\" ?>\n<quiz>\n  <question type=\"category\">\n    <category>\n      <text>$course$/Algorithm Fundamentals</text>\n    </category>\n  </question>\n  <question type=\"matching\">\n    <name>\n      <text>Algorithm Time Complexity Matching</text>\n    </name>\n    <questiontext format=\"html\">\n      <text>Match the algorithm with its typical time complexity:</text>\n    </questiontext>\n    <subquestion>\n      <text>Binary Search</text>\n      <answer>O(log n)</answer>\n    </subquestion>\n    <subquestion>\n      <text>Bubble Sort</text>\n      <answer>O(n²)</answer>\n    </subquestion>\n    <subquestion>\n      <text>Merge Sort</text>\n      <answer>O(n log n)</answer>\n    </subquestion>\n    <subquestion>\n      <text>Linear Search</text>\n      <answer>O(n)</answer>\n    </subquestion>\n  </question>\n  <question type=\"multichoice\">\n    <name>\n      <text>Algorithm Properties</text>\n    </name>\n    <questiontext format=\"html\">\n      <text>Which of the following is NOT a required property of an algorithm?</text>\n    </questiontext>\n    <answer fraction=\"100\">\n      <text>It must be recursive</text>\n      <feedback>\n        <text>Correct! Algorithms do not need to be recursive to be valid.</text>\n      </feedback>\n    </answer>\n    <answer fraction=\"0\">\n      <text>It must be finite</text>\n      <feedback>\n        <text>Incorrect. An algorithm must terminate after a finite number of steps.</text>\n      </feedback>\n    </answer>\n    <answer fraction=\"0\">\n      <text>It must have definite steps</text>\n      <feedback>\n        <text>Incorrect. Each step in an algorithm must be precisely defined.</text>\n      </feedback>\n    </answer>\n    <answer fraction=\"0\">\n      <text>It must produce output</text>\n      <feedback>\n        <text>Incorrect. An algorithm must produce one or more outputs.</text>\n      </feedback>\n    </answer>\n  </question>\n  <question type=\"essay\">\n    <name>\n      <text>Algorithm Design</text>\n    </name>\n    <questiontext format=\"html\">\n      <text>Describe an algorithm to find the maximum element in an array of integers. Include step-by-step instructions and analyze its time complexity.</text>\n    </questiontext>\n    <generalfeedback format=\"html\">\n      <text>A good answer would include initializing a variable to track the maximum value, iterating through the array once to compare each element with the current maximum, and updating the maximum when a larger value is found. The time complexity would be O(n) as we need to examine each element once.</text>\n    </generalfeedback>\n  </question>\n</quiz>"
              }
            }
          ]
        },
        {
          id: "ch3",
          title: "Chapter 3: Programming Basics",
          blocks: [
            {
              id: "ch3b1",
              type: "text",
              content: "# Introduction to Programming\n\nProgramming is the process of creating a set of instructions that tell a computer how to perform a task. Programming languages are formal languages that programmers use to communicate with computers.\n\n## Programming Paradigms\n\n1. **Imperative Programming**: Focuses on how to execute, defines control flow as statements that change program state\n   - Examples: C, Pascal, Basic\n\n2. **Object-Oriented Programming**: Based on the concept of objects, which contain data and code\n   - Examples: Java, C++, Python, C#\n\n3. **Functional Programming**: Treats computation as the evaluation of mathematical functions, avoids state and mutable data\n   - Examples: Haskell, Lisp, Scala, Clojure\n\n4. **Declarative Programming**: Focuses on what the program should accomplish without specifying how\n   - Examples: SQL, Prolog"
            },
            {
              id: "ch3b2",
              type: "video",
              content: "https://www.example.com/intro_to_programming.mp4",
              metadata: {
                duration: 2130,
                title: "Programming Fundamentals",
                presenter: "Prof. Robert Johnson"
              }
            },
            {
              id: "ch3b3",
              type: "text",
              content: "## Basic Programming Concepts\n\n### Variables and Data Types\n\nVariables are used to store data that can be modified later in the program. Different programming languages support different data types:\n\n- **Integers**: Whole numbers (e.g., 42, -7)\n- **Floating-point numbers**: Numbers with decimal points (e.g., 3.14, -2.5)\n- **Strings**: Text (e.g., \"Hello, World!\")\n- **Booleans**: True/False values\n- **Arrays/Lists**: Collections of items\n\n### Control Structures\n\n1. **Conditionals**: Make decisions (if, else, switch statements)\n2. **Loops**: Repeat actions (for, while, do-while loops)\n3. **Functions/Methods**: Reusable blocks of code"
            },
            {
              id: "ch3b4",
              type: "task",
              content: "Write a simple program in a language of your choice that accepts a number from the user and determines whether it is prime. Include comments to explain your code."
            },
            {
              id: "ch3b5",
              type: "quiz",
              content: "programming_basics_quiz",
              metadata: {
                xmlContent: "<?xml version=\"1.0\" ?>\n<quiz>\n  <question type=\"category\">\n    <category>\n      <text>$course$/Programming Fundamentals</text>\n    </category>\n  </question>\n  <question type=\"multichoice\">\n    <name>\n      <text>Variable Types</text>\n    </name>\n    <questiontext format=\"html\">\n      <text>What would be the most appropriate data type for storing a person's age?</text>\n    </questiontext>\n    <answer fraction=\"100\">\n      <text>Integer</text>\n      <feedback>\n        <text>Correct! Age is typically represented as a whole number without decimal places.</text>\n      </feedback>\n    </answer>\n    <answer fraction=\"0\">\n      <text>String</text>\n      <feedback>\n        <text>Incorrect. While age could be stored as text, it would make arithmetic operations more complex.</text>\n      </feedback>\n    </answer>\n    <answer fraction=\"0\">\n      <text>Float</text>\n      <feedback>\n        <text>Incorrect. Age is typically a whole number, so a floating-point type would be unnecessary.</text>\n      </feedback>\n    </answer>\n    <answer fraction=\"0\">\n      <text>Boolean</text>\n      <feedback>\n        <text>Incorrect. Boolean can only store true/false values, not numerical ages.</text>\n      </feedback>\n    </answer>\n  </question>\n  <question type=\"cloze\">\n    <name>\n      <text>Programming Syntax</text>\n    </name>\n    <questiontext format=\"html\">\n      <text>Complete the following Python code:\n\ndef is_prime(n):\n    if n <= 1:\n        return {1:MULTICHOICE:True~=False}\n    if n <= 3:\n        return {1:MULTICHOICE:=True~False}\n    if n % 2 == 0 or n % 3 == 0:\n        return {1:MULTICHOICE:True~=False}\n    i = 5\n    while i * i <= {1:MULTICHOICE:=n~i~0~1}:\n        if n % i == 0 or n % (i + 2) == 0:\n            return {1:MULTICHOICE:True~=False}\n        i += {1:MULTICHOICE:1~2~=6~4}</text>\n    </questiontext>\n  </question>\n  <question type=\"shortanswer\">\n    <name>\n      <text>Programming Terminology</text>\n    </name>\n    <questiontext format=\"html\">\n      <text>What term describes a programming error that occurs during program execution and causes the program to terminate abnormally?</text>\n    </questiontext>\n    <answer fraction=\"100\">\n      <text>runtime error</text>\n    </answer>\n    <answer fraction=\"100\">\n      <text>runtime exception</text>\n    </answer>\n    <answer fraction=\"100\">\n      <text>exception</text>\n    </answer>\n  </question>\n</quiz>"
              }
            }
          ]
        }
      ],
      chats: [
        {
          id: "chat1",
          name: "General",
          messages: [
          
          ],
        },
      ],
      vectorDb: [
        {
          id: "vdb1",
          name: "CS Fundamentals Textbook",
          type: "pdf",
          size: 15600000,
          uploadedAt: 1689152400000
        },
        {
          id: "vdb2",
          name: "Algorithm Cheat Sheet",
          type: "pdf",
          size: 2300000,
          uploadedAt: 1689238800000
        }
      ],
      selectedModel: "llama",
    },
    {
      id: "2",
      title: "Data Science Essentials",
      chapters: [
        {
          id: "ds-ch1",
          title: "Chapter 1: Introduction to Data Science",
          blocks: [
            {
              id: "ds-b1",
              type: "text",
              content: "# Data Science Essentials\n\nData Science is an interdisciplinary field that uses scientific methods, processes, algorithms, and systems to extract knowledge and insights from structured and unstructured data.\n\n## Core Components of Data Science\n\n1. **Statistics and Mathematics**: The foundation of data analysis and modeling\n2. **Computer Science**: Programming, algorithms, and data structures\n3. **Domain Expertise**: Understanding the context and relevance of data in a specific field"
            },
            {
              id: "ds-b2",
              type: "task",
              content: "Install Python and the essential data science libraries (NumPy, pandas, matplotlib, scikit-learn). Create a simple data visualization using a dataset of your choice."
            }
          ]
        }
      ],
      chats: [
        {
          id: "ds-chat1",
          name: "General",
          messages: [],
        }
      ],
      vectorDb: [],
      selectedModel: "mistral",
    }
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
      // Ensure the content has a unique ID
      const uniqueContent = {
        ...content,
        id: content.id || `unique-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      const updatedCourse = { ...selectedCourse }
      updatedCourse.chapters[0].blocks.push(uniqueContent)
      handleUpdateCourse(updatedCourse)

      // Remove from generated content only if it exists there
      const existingIndex = generatedContent.findIndex(c => c.id === content.id);
      if (existingIndex >= 0) {
        setGeneratedContent(generatedContent.filter((c) => c.id !== content.id))
      }
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