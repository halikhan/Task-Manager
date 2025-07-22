import { type NextRequest, NextResponse } from "next/server"
import { taskStorage } from "@/lib/storage"

export async function POST(request: NextRequest) {
  try {
    const { taskIds }: { taskIds: string[] } = await request.json()

    if (!Array.isArray(taskIds)) {
      return NextResponse.json({ error: "Invalid task IDs" }, { status: 400 })
    }

    taskStorage.reorderTasks(taskIds)
    const reorderedTasks = taskStorage.getAllTasks()

    return NextResponse.json(reorderedTasks)
  } catch (error) {
    return NextResponse.json({ error: "Failed to reorder tasks" }, { status: 400 })
  }
}
