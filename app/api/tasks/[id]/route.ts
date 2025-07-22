import { type NextRequest, NextResponse } from "next/server"
import { taskStorage } from "@/lib/storage"
import type { UpdateTaskRequest } from "@/types/task"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body: UpdateTaskRequest = await request.json()

    const updatedTask = taskStorage.updateTask(id, body)

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(updatedTask)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const deleted = taskStorage.deleteTask(id)

    if (!deleted) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 400 })
  }
}
