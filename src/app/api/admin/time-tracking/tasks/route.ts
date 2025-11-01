import { NextRequest, NextResponse } from 'next/server';

// Temporäre Task-Datenstruktur
interface Task {
  id: number;
  session_id: number;
  title: string;
  description: string;
  start_time: string;
  end_time?: string;
  status: 'in-progress' | 'completed' | 'interrupted';
  created_at: string;
  updated_at: string;
}

// Temporäre In-Memory-Speicherung
let tasks: Task[] = [];

export async function GET() {
  try {
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: 'Fehler beim Laden der Tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, title, description } = body;

    // Validierung
    if (!session_id || !title || !description) {
      return NextResponse.json(
        { error: 'Session ID, Titel und Beschreibung sind erforderlich' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) : 0;

    const newTask: Task = {
      id: maxId + 1,
      session_id,
      title,
      description,
      start_time: now,
      status: 'in-progress',
      created_at: now,
      updated_at: now,
    };

    tasks.push(newTask);

    console.log(`✅ Neue Task erstellt: ${newTask.title}`);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Task' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task nicht gefunden' },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();
    const updatedTask = {
      ...tasks[taskIndex],
      ...updateData,
      updated_at: now,
    };

    tasks[taskIndex] = updatedTask;

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren der Task' },
      { status: 500 }
    );
  }
}
