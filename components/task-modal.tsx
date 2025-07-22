"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, FileText, Flag, BookOpen, Check, Trash2, Calendar, Clock, Info } from "lucide-react"
import type { Task, TaskStatus } from "@/types/task"

interface TaskModalProps {
  task: Task
  onClose: () => void
  onTaskUpdated: (task: Task) => void
  onTaskDeleted: (taskId: string) => void
}

export function TaskModal({ task, onClose, onTaskUpdated, onTaskDeleted }: TaskModalProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || "")
  const [status, setStatus] = useState(task.status)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
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
        const updatedTask = await response.json()
        onTaskUpdated(updatedTask)
        onClose()
      } else {
        const errorData = await response.json()
        if (errorData.errors) {
          setErrors(errorData.errors)
        }
      }
    } catch (error) {
      console.error("Error updating task:", error)
      setErrors({ general: "An unexpected error occurred. Please try again." })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task? This action cannot be undone.")) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onTaskDeleted(task.id)
        onClose()
      } else {
        console.error("Failed to delete task")
      }
    } catch (error) {
      console.error("Error deleting task:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "To Do":
        return <span className="status-badge status-todo text-sm">{status}</span>
      case "In Progress":
        return <span className="status-badge status-progress text-sm">{status}</span>
      case "Done":
        return <span className="status-badge status-done text-sm">{status}</span>
      default:
        return <span className="status-badge status-todo text-sm">{status}</span>
    }
  }

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 modal-backdrop-custom z-50" onClick={onClose}></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="glass-morphism rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="gradient-primary p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Task Details</h2>
                {getStatusBadge(task.status)}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {errors.general && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
                <div className="flex items-center gap-2">
                  <span>⚠️</span>
                  {errors.general}
                </div>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3">
                  <label htmlFor="modalTitle" className="block text-sm font-semibold text-slate-300 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Task Title *
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl form-input transition-all duration-200 ${
                      errors.title ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                    }`}
                    id="modalTitle"
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
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    <Info className="w-4 h-4 inline mr-2" />
                    Task ID
                  </label>
                  <div className="px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700">
                    <code className="text-slate-400 text-sm">#{task.id}</code>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="modalDescription" className="block text-sm font-semibold text-slate-300 mb-2">
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Description
                </label>
                <textarea
                  className={`w-full px-4 py-3 rounded-xl form-input transition-all duration-200 resize-none ${
                    errors.description ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                  }`}
                  id="modalDescription"
                  rows={6}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    if (errors.description) {
                      setErrors((prev) => ({ ...prev, description: "" }))
                    }
                  }}
                  placeholder="Provide detailed information about this task..."
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

              <div>
                <label htmlFor="modalStatus" className="block text-sm font-semibold text-slate-300 mb-2">
                  <Flag className="w-4 h-4 inline mr-2" />
                  Status
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl form-input transition-all duration-200"
                  id="modalStatus"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                >
                  <option value="To Do">📋 To Do</option>
                  <option value="In Progress">⚡ In Progress</option>
                  <option value="Done">✅ Done</option>
                </select>
              </div>

              {/* Task Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-morphism rounded-xl p-4">
                  <div className="text-xs text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Created
                  </div>
                  <div className="text-slate-200 font-medium">{new Date(task.createdAt).toLocaleString()}</div>
                </div>
                <div className="glass-morphism rounded-xl p-4">
                  <div className="text-xs text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Last Updated
                  </div>
                  <div className="text-slate-200 font-medium">{new Date(task.updatedAt).toLocaleString()}</div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-700/50 flex gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isUpdating}
              className="px-6 py-3 rounded-xl gradient-danger text-white font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 btn-animate disabled:opacity-50"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Deleting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete Task
                </div>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating || isDeleting}
              className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold transition-all duration-300"
            >
              <X className="w-4 h-4 inline mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleUpdate}
              disabled={isUpdating || isDeleting || !title.trim()}
              className="flex-1 px-6 py-3 rounded-xl gradient-primary text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 btn-animate disabled:opacity-50"
            >
              {isUpdating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Updating...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  Update Task
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
