export type TaskStatus = "To Do" | "In Progress" | "Done"

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export interface CreateTaskRequest {
  title: string
  description?: string
  status: TaskStatus
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  status?: TaskStatus
}
