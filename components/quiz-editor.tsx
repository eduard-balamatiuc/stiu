import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { PlusIcon, MinusIcon } from "lucide-react"

interface QuizEditorProps {
  initialXml?: string
  onSave: (xml: string) => void
}

interface Question {
  type: "multichoice" | "cloze" | "shortanswer" | "truefalse" | "matching"
  name: string
  questionText: string
  answers: Answer[]
}

interface Answer {
  text: string
  feedback?: string
  fraction: "100" | "0"
}

export function QuizEditor({ initialXml, onSave }: QuizEditorProps) {
  const mockQuestions: Question[] = [
    {
      type: "multichoice",
      name: "Data Types in Programming",
      questionText: "What would be the most appropriate data type for storing a person's age?",
      answers: [
        {
          text: "Integer",
          feedback: "Correct! Age is typically represented as a whole number without decimal places.",
          fraction: "100"
        },
        {
          text: "String",
          feedback: "Incorrect. While age could be stored as text, it would make arithmetic operations more complex.",
          fraction: "0"
        },
        {
          text: "Float",
          feedback: "Incorrect. Age is typically a whole number, so a floating-point type would be unnecessary.",
          fraction: "0"
        },
        {
          text: "Boolean",
          feedback: "Incorrect. Boolean can only store true/false values, not numerical ages.",
          fraction: "0"
        }
      ]
    },
    {
      type: "truefalse",
      name: "Binary Facts",
      questionText: "In binary, 2 is represented as 10.",
      answers: [
        {
          text: "true",
          feedback: "Correct! In binary, 10 equals 1×2^1 + 0×2^0 = 2 in decimal.",
          fraction: "100"
        },
        {
          text: "false",
          feedback: "Incorrect. In binary, 10 equals 1×2^1 + 0×2^0 = 2 in decimal.",
          fraction: "0"
        }
      ]
    },
    {
      type: "shortanswer",
      name: "Programming Terminology",
      questionText: "What term describes a programming error that occurs during program execution and causes the program to terminate abnormally?",
      answers: [
        {
          text: "runtime error",
          fraction: "100"
        },
        {
          text: "runtime exception",
          fraction: "100"
        },
        {
          text: "exception",
          fraction: "100"
        }
      ]
    },
    {
      type: "matching",
      name: "Algorithm Time Complexity",
      questionText: "Match the algorithm with its typical time complexity:",
      answers: [
        {
          text: "Binary Search -> O(log n)",
          fraction: "100"
        },
        {
          text: "Bubble Sort -> O(n²)",
          fraction: "100"
        },
        {
          text: "Merge Sort -> O(n log n)",
          fraction: "100"
        },
        {
          text: "Linear Search -> O(n)",
          fraction: "100"
        }
      ]
    },
    {
      type: "cloze",
      name: "Python Prime Number Function",
      questionText: "Complete the following Python code:\n\ndef is_prime(n):\n    if n <= 1:\n        return {1:MULTICHOICE:True~=False}\n    if n <= 3:\n        return {1:MULTICHOICE:=True~False}\n    if n % 2 == 0 or n % 3 == 0:\n        return {1:MULTICHOICE:True~=False}\n    i = 5\n    while i * i <= {1:MULTICHOICE:=n~i~0~1}:\n        if n % i == 0 or n % (i + 2) == 0:\n            return {1:MULTICHOICE:True~=False}\n        i += {1:MULTICHOICE:1~2~=6~4}",
      answers: [
        {
          text: "Complete the code by selecting the correct values",
          fraction: "100"
        }
      ]
    }
  ]

  const parseXml = (xml: string): { category: string; questions: Question[] } => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xml, "text/xml")
    
    // Parse category
    const categoryElement = xmlDoc.querySelector("category text")
    const category = categoryElement ? categoryElement.textContent || "$course$/Default" : "$course$/Default"
    
    // Parse questions
    const questionElements = Array.from(xmlDoc.querySelectorAll("question")).filter(q => q.getAttribute("type") !== "category")
    const questions: Question[] = questionElements.map(q => {
      const type = q.getAttribute("type") as Question["type"]
      const name = q.querySelector("name text")?.textContent || ""
      const questionText = q.querySelector("questiontext text")?.textContent || ""
      
      const answerElements = q.querySelectorAll("answer")
      const answers: Answer[] = Array.from(answerElements).map(a => {
        const feedbackElement = a.querySelector("feedback text")
        return {
          text: a.querySelector("text")?.textContent || "",
          ...(feedbackElement?.textContent && { feedback: feedbackElement.textContent }),
          fraction: a.getAttribute("fraction") as "100" | "0" || "0"
        }
      })
      
      return {
        type,
        name,
        questionText,
        answers
      }
    })
    
    return { category, questions }
  }

  const [questions, setQuestions] = useState<Question[]>(() => {
    if (initialXml) {
      try {
        const { questions } = parseXml(initialXml)
        return questions
      } catch (error) {
        console.error("Failed to parse initial XML:", error)
        return mockQuestions
      }
    }
    return mockQuestions
  })

  const [category, setCategory] = useState(() => {
    if (initialXml) {
      try {
        const { category } = parseXml(initialXml)
        return category
      } catch (error) {
        console.error("Failed to parse initial XML category:", error)
        return "$course$/Programming Fundamentals"
      }
    }
    return "$course$/Programming Fundamentals"
  })

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: "multichoice",
        name: "",
        questionText: "",
        answers: [
          { text: "", feedback: "", fraction: "100" },
          { text: "", feedback: "", fraction: "0" },
        ],
      },
    ])
  }

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], ...updates }
    setQuestions(newQuestions)
  }

  const addAnswer = (questionIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].answers.push({
      text: "",
      feedback: "",
      fraction: "0",
    })
    setQuestions(newQuestions)
  }

  const updateAnswer = (
    questionIndex: number,
    answerIndex: number,
    updates: Partial<Answer>
  ) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].answers[answerIndex] = {
      ...newQuestions[questionIndex].answers[answerIndex],
      ...updates,
    }
    setQuestions(newQuestions)
  }

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].answers.splice(answerIndex, 1)
    setQuestions(newQuestions)
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const generateXml = () => {
    let xml = '<?xml version="1.0" ?>\n<quiz>\n'
    
    // Add category
    xml += '  <question type="category">\n'
    xml += '    <category>\n'
    xml += `      <text>${category}</text>\n`
    xml += '    </category>\n'
    xml += '  </question>\n'
    
    // Add questions
    questions.forEach((question) => {
      xml += `  <question type="${question.type}">\n`
      xml += '    <name>\n'
      xml += `      <text>${question.name}</text>\n`
      xml += '    </name>\n'
      xml += '    <questiontext format="html">\n'
      xml += `      <text>${question.questionText}</text>\n`
      xml += '    </questiontext>\n'
      
      question.answers.forEach((answer) => {
        xml += `    <answer fraction="${answer.fraction}">\n`
        xml += `      <text>${answer.text}</text>\n`
        if (answer.feedback) {
          xml += '      <feedback>\n'
          xml += `        <text>${answer.feedback}</text>\n`
          xml += '      </feedback>\n'
        }
        xml += '    </answer>\n'
      })
      
      xml += '  </question>\n'
    })
    
    xml += '</quiz>'
    return xml
  }

  const handleSave = () => {
    const xml = generateXml()
    onSave(xml)
  }

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Quiz Category</label>
        <Input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="$course$/YourCategory"
        />
      </div>

      <div className="space-y-4">
        {questions.map((question, qIndex) => (
          <Card key={qIndex} className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Question {qIndex + 1}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeQuestion(qIndex)}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Question Type</label>
              <Select
                value={question.type}
                onValueChange={(value: Question["type"]) =>
                  updateQuestion(qIndex, { type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multichoice">Multiple Choice</SelectItem>
                  <SelectItem value="cloze">Cloze</SelectItem>
                  <SelectItem value="shortanswer">Short Answer</SelectItem>
                  <SelectItem value="truefalse">True/False</SelectItem>
                  <SelectItem value="matching">Matching</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Question Name</label>
              <Input
                value={question.name}
                onChange={(e) =>
                  updateQuestion(qIndex, { name: e.target.value })
                }
                placeholder="Question name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Question Text</label>
              <Textarea
                value={question.questionText}
                onChange={(e) =>
                  updateQuestion(qIndex, { questionText: e.target.value })
                }
                placeholder="Enter your question"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Answers</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addAnswer(qIndex)}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>

              {question.answers.map((answer, aIndex) => (
                <div key={aIndex} className="space-y-2 pl-4 border-l-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">
                      Answer {aIndex + 1}
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAnswer(qIndex, aIndex)}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  <Input
                    value={answer.text}
                    onChange={(e) =>
                      updateAnswer(qIndex, aIndex, { text: e.target.value })
                    }
                    placeholder="Answer text"
                  />

                  <Input
                    value={answer.feedback || ""}
                    onChange={(e) =>
                      updateAnswer(qIndex, aIndex, {
                        feedback: e.target.value,
                      })
                    }
                    placeholder="Feedback (optional)"
                  />

                  <Select
                    value={answer.fraction}
                    onValueChange={(value: "100" | "0") =>
                      updateAnswer(qIndex, aIndex, { fraction: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select answer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">Correct</SelectItem>
                      <SelectItem value="0">Incorrect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button onClick={addQuestion}>Add Question</Button>
        <Button onClick={handleSave}>Save Quiz</Button>
      </div>
    </div>
  )
} 