import { type NextRequest, NextResponse } from "next/server"
import { taskStorage } from "@/lib/storage"
import type { CreateTaskRequest } from "@/types/task"

export async function GET() {
  try {
    const tasks = taskStorage.getAllTasks()
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateTaskRequest = await request.json()

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const newTask = taskStorage.createTask({
      title: body.title.trim(),
      description: body.description?.trim() || "",
      status: body.status,
    })

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 400 })
  }
}
