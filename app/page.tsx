"use client"

import { useState, useEffect } from "react"
import { TaskForm } from "@/components/task-form"
import { TaskList } from "@/components/task-list"
import { FlashMessage } from "@/components/flash-message"
import { Kanban, TrendingUp, Sparkles } from "lucide-react"
import type { Task } from "@/types/task"

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [flashMessage, setFlashMessage] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks")
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      showFlashMessage("error", "Failed to load tasks. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }

  const showFlashMessage = (type: "success" | "error", message: string) => {
    setFlashMessage({ type, message })
    setTimeout(() => setFlashMessage(null), 5000)
  }

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev])
    showFlashMessage("success", "Task created successfully!")
  }

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    showFlashMessage("success", "Task updated successfully!")
  }

  const handleTaskDeleted = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
    showFlashMessage("success", "Task deleted successfully!")
  }

  const handleTasksReordered = (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="glass-morphism rounded-2xl p-8 text-center max-w-sm mx-4">
          <div className="pulse-glow w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-100 mb-2">Loading Your Tasks</h3>
          <p className="text-slate-400">Please wait while we fetch your data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12 fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mb-6 shadow-lg shadow-blue-500/25">
            <Kanban className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 bg-clip-text text-transparent mb-4">
            Task Manager Pro
          </h1>
          <p className="text-xl text-slate-400 flex items-center justify-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Organize your work, boost your productivity
          </p>
        </div>

        {/* Flash Messages */}
        {flashMessage && (
          <div className="mb-8 max-w-2xl mx-auto">
            <FlashMessage type={flashMessage.type} message={flashMessage.message} />
          </div>
        )}

        {/* Task Form */}
        <div className="mb-12">
          <div className="fade-in-up">
            <TaskForm onTaskCreated={handleTaskCreated} />
          </div>
        </div>

        {/* Task Statistics */}
        <div className="mb-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-morphism rounded-2xl p-6 text-center hover:bg-slate-800/50 transition-all duration-300">
              <div className="text-3xl font-bold text-slate-100 mb-1">{tasks.length}</div>
              <div className="text-sm text-slate-400 uppercase tracking-wide">Total Tasks</div>
            </div>
            <div className="glass-morphism rounded-2xl p-6 text-center hover:bg-slate-800/50 transition-all duration-300">
              <div className="text-3xl font-bold text-red-400 mb-1">
                {tasks.filter((t) => t.status === "To Do").length}
              </div>
              <div className="text-sm text-slate-400 uppercase tracking-wide">To Do</div>
            </div>
            <div className="glass-morphism rounded-2xl p-6 text-center hover:bg-slate-800/50 transition-all duration-300">
              <div className="text-3xl font-bold text-yellow-400 mb-1">
                {tasks.filter((t) => t.status === "In Progress").length}
              </div>
              <div className="text-sm text-slate-400 uppercase tracking-wide">In Progress</div>
            </div>
            <div className="glass-morphism rounded-2xl p-6 text-center hover:bg-slate-800/50 transition-all duration-300">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {tasks.filter((t) => t.status === "Done").length}
              </div>
              <div className="text-sm text-slate-400 uppercase tracking-wide">Completed</div>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="mb-8">
          <TaskList
            tasks={tasks}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
            onTasksReordered={handleTasksReordered}
          />
        </div>

        {/* Footer */}
        <footer className="text-center py-8">
          <div className="glass-morphism rounded-full px-6 py-3 inline-block">
            <p className="text-sm text-slate-400">❤️ Built with modern design principles</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
