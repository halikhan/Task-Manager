"use client"

import type React from "react"
import { useState } from "react"
import { Plus, FileText, Flag, BookOpen, PlusCircle } from "lucide-react"
import type { Task, TaskStatus } from "@/types/task"

interface TaskFormProps {
  onTaskCreated: (task: Task) => void
}

export function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<TaskStatus>("To Do")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!title.trim()) {
      newErrors.title = "The title field is required."
    } else if (title.trim().length < 3) {
      newErrors.title = "The title must be at least 3 characters."
    } else if (title.trim().length > 255) {
      newErrors.title = "The title may not be greater than 255 characters."
    }

    if (description.trim().length > 1000) {
      newErrors.description = "The description may not be greater than 1000 characters."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          status,
        }),
      })

      if (response.ok) {
        const newTask = await response.json()
        onTaskCreated(newTask)
        setTitle("")
        setDescription("")
        setStatus("To Do")
        setErrors({})
      } else {
        const errorData = await response.json()
        if (errorData.errors) {
          setErrors(errorData.errors)
        }
      }
    } catch (error) {
      console.error("Error creating task:", error)
      setErrors({ general: "An unexpected error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-morphism rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-1">Create New Task</h2>
            <p className="text-slate-400">Add a new task to your workflow</p>
          </div>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              {errors.general}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-semibold text-slate-300 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Task Title *
              </label>
              <input
                type="text"
                className={`w-full px-4 py-3 rounded-xl form-input transition-all duration-200 ${
                  errors.title ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                }`}
                id="title"
                placeholder="Enter a descriptive task title..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (errors.title) {
                    setErrors((prev) => ({ ...prev, title: "" }))
                  }
                }}
                required
                maxLength={255}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <span>❌</span>
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-slate-300 mb-2">
                <Flag className="w-4 h-4 inline mr-2" />
                Initial Status
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl form-input transition-all duration-200"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                <option value="To Do">📋 To Do</option>
                <option value="In Progress">⚡ In Progress</option>
                <option value="Done">✅ Done</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-300 mb-2">
              <BookOpen className="w-4 h-4 inline mr-2" />
              Description
              <span className="text-slate-500 font-normal ml-2">(Optional)</span>
            </label>
            <textarea
              className={`w-full px-4 py-3 rounded-xl form-input transition-all duration-200 resize-none ${
                errors.description ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
              }`}
              id="description"
              rows={4}
              placeholder="Provide additional details about this task..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: "" }))
                }
              }}
              maxLength={1000}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <span>❌</span>
                {errors.description}
              </p>
            )}
            <p className="mt-2 text-xs text-slate-500">{description.length}/1000 characters</p>
          </div>

          <button
            type="submit"
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 btn-animate ${
              isSubmitting || !title.trim()
                ? "bg-slate-700 cursor-not-allowed"
                : "gradient-primary hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
            }`}
            disabled={isSubmitting || !title.trim()}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating Task...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <PlusCircle className="w-5 h-5" />
                Create Task
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
