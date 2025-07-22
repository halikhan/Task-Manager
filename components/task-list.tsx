"use client"

import type React from "react"
import { useState } from "react"
import { TaskCard } from "@/components/task-card"
import { TaskModal } from "@/components/task-modal"
import { ClipboardX, Plus, RotateCcw, CheckCircle } from "lucide-react"
import type { Task } from "@/types/task"

interface TaskListProps {
  tasks: Task[]
  onTaskUpdated: (task: Task) => void
  onTaskDeleted: (taskId: string) => void
  onTasksReordered: (tasks: Task[]) => void
}

export function TaskList({ tasks, onTaskUpdated, onTaskDeleted, onTasksReordered }: TaskListProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/html", taskId)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetTaskId: string) => {
    e.preventDefault()
    const draggedTaskId = e.dataTransfer.getData("text/html")

    if (draggedTaskId !== targetTaskId) {
      const draggedIndex = tasks.findIndex((task) => task.id === draggedTaskId)
      const targetIndex = tasks.findIndex((task) => task.id === targetTaskId)

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newTasks = [...tasks]
        const [draggedTask] = newTasks.splice(draggedIndex, 1)
        newTasks.splice(targetIndex, 0, draggedTask)
        onTasksReordered(newTasks)
      }
    }
    setDraggedTask(null)
  }

  const handleViewMore = (task: Task) => {
    setSelectedTask(task)
  }

  const handleCloseModal = () => {
    setSelectedTask(null)
  }

  if (tasks.length === 0) {
    return (
      <div className="flex justify-center">
        <div className="max-w-md mx-auto">
          <div className="glass-morphism rounded-2xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-800/50 flex items-center justify-center">
              <ClipboardX className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">No Tasks Yet</h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Ready to boost your productivity? Create your first task above and start organizing your workflow!
            </p>
            <div className="flex justify-center gap-6 text-slate-500">
              <div className="flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" />
                Create
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="w-4 h-4" />
                Update
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4" />
                Complete
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="task-list">
        {tasks.map((task, index) => (
          <div key={task.id} className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <TaskCard
              task={task}
              onTaskUpdated={onTaskUpdated}
              onTaskDeleted={onTaskDeleted}
              onViewMore={handleViewMore}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isDragging={draggedTask === task.id}
            />
          </div>
        ))}
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={handleCloseModal}
          onTaskUpdated={onTaskUpdated}
          onTaskDeleted={onTaskDeleted}
        />
      )}
    </>
  )
}
