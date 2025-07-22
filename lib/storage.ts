import type { Task } from "@/types/task"

// Shared in-memory storage
class TaskStorage {
  private tasks: Task[] = [
    {
      id: "1",
      title: "Setup project structure",
      description:
        "Create the basic folder structure and install dependencies for the task manager application. This includes setting up the proper directory structure, installing necessary packages, and configuring the development environment.",
      status: "Done",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "2",
      title: "Implement task CRUD operations",
      description:
        "Create, read, update, and delete functionality for tasks. This includes building the API endpoints, handling form submissions, and ensuring proper error handling and validation.",
      status: "In Progress",
      createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      updatedAt: new Date(Date.now() - 43200000).toISOString(),
    },
    {
      id: "3",
      title: "Add drag and drop functionality",
      description:
        "Allow users to reorder tasks by dragging and dropping them. This should include visual feedback during the drag operation and proper persistence of the new order.",
      status: "To Do",
      createdAt: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
      updatedAt: new Date(Date.now() - 21600000).toISOString(),
    },
    {
      id: "4",
      title: "Mobile responsive design",
      description:
        "Ensure the application works perfectly on mobile devices with touch-friendly interactions and responsive layout.",
      status: "To Do",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  getAllTasks(): Task[] {
    return [...this.tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id)
  }

  createTask(taskData: Omit<Task, "id" | "createdAt" | "updatedAt">): Task {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.tasks.push(newTask)
    return newTask
  }

  updateTask(id: string, updates: Partial<Omit<Task, "id" | "createdAt">>): Task | null {
    const taskIndex = this.tasks.findIndex((task) => task.id === id)
    if (taskIndex === -1) return null

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return this.tasks[taskIndex]
  }

  deleteTask(id: string): boolean {
    const taskIndex = this.tasks.findIndex((task) => task.id === id)
    if (taskIndex === -1) return false

    this.tasks.splice(taskIndex, 1)
    return true
  }

  reorderTasks(taskIds: string[]): void {
    const reorderedTasks: Task[] = []
    taskIds.forEach((id) => {
      const task = this.tasks.find((t) => t.id === id)
      if (task) reorderedTasks.push(task)
    })
    this.tasks = reorderedTasks
  }
}

// Export singleton instance
export const taskStorage = new TaskStorage()
