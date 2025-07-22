"use client"

import type React from "react"
import { useState } from "react"
import { Eye, Trash2, GripVertical, Clipboard, Clock, CheckCircle, Calendar, RotateCcw } from "lucide-react"
import type { Task, TaskStatus } from "@/types/task"

interface TaskCardProps {
  task: Task
  onTaskUpdated: (task: Task) => void
  onTaskDeleted: (taskId: string) => void
  onViewMore: (task: Task) => void
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, taskId: string) => void
  isDragging: boolean
}

export function TaskCard({
  task,
  onTaskUpdated,
  onTaskDeleted,
  onViewMore,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging,
}: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "To Do":
        return <Clipboard className="w-4 h-4" />
      case "In Progress":
        return <Clock className="w-4 h-4" />
      case "Done":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clipboard className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "To Do":
        return <span className="status-badge status-todo">{status}</span>
      case "In Progress":
        return <span className="status-badge status-progress">{status}</span>
      case "Done":
        return <span className="status-badge status-done">{status}</span>
      default:
        return <span className="status-badge status-todo">{status}</span>
    }
  }

  const handleStatusUpdate = async (newStatus: TaskStatus) => {
    if (newStatus === task.status) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...task,
          status: newStatus,
        }),
      })

      if (response.ok) {
        const updatedTask = await response.json()
        onTaskUpdated(updatedTask)
      } else {
        console.error("Failed to update task")
      }
    } catch (error) {
      console.error("Error updating task:", error)
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
      } else {
        console.error("Failed to delete task")
      }
    } catch (error) {
      console.error("Error deleting task:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div
      className={`glass-morphism rounded-2xl p-6 task-card-hover cursor-grab active:cursor-grabbing ${
        isDragging ? "dragging" : ""
      }`}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, task.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-blue-400">{getStatusIcon(task.status)}</div>
            <h3 className="text-lg font-semibold text-slate-100 truncate">{truncateText(task.title, 35)}</h3>
          </div>
          {getStatusBadge(task.status)}
        </div>
        <div className="ml-3 text-slate-500 hover:text-slate-400 transition-colors">
          <GripVertical className="w-5 h-5" />
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-slate-400 text-sm mb-4 leading-relaxed">{truncateText(task.description, 80)}</p>
      )}

      {/* Status Update */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
          <RotateCcw className="w-3 h-3 inline mr-1" />
          Update Status
        </label>
        <select
          className="w-full px-3 py-2 rounded-lg form-input text-sm transition-all duration-200"
          value={task.status}
          onChange={(e) => handleStatusUpdate(e.target.value as TaskStatus)}
          disabled={isUpdating}
        >
          <option value="To Do">📋 To Do</option>
          <option value="In Progress">⚡ In Progress</option>
          <option value="Done">✅ Done</option>
        </select>
        {isUpdating && (
          <div className="flex items-center justify-center mt-2 text-xs text-blue-400">
            <div className="w-3 h-3 border border-blue-400/30 border-t-blue-400 rounded-full animate-spin mr-2"></div>
            Updating...
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => onViewMore(task)}
          className="flex-1 px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:border-blue-500/30 transition-all duration-200 text-sm font-medium btn-animate"
        >
          <Eye className="w-4 h-4 inline mr-2" />
          Details
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/30 transition-all duration-200 text-sm font-medium btn-animate disabled:opacity-50"
        >
          {isDeleting ? (
            <div className="w-4 h-4 border border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Footer */}
      <div className="flex justify-between text-xs text-slate-500 pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDate(task.createdAt)}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDate(task.updatedAt)}
        </div>
      </div>
    </div>
  )
}
