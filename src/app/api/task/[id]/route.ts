// app/api/task/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token) as { role: 'ADMIN' | 'USER' };

    const { submitted, approved, rejected } = await req.json();
  
    let updateData = {};

if (decoded.role === 'ADMIN') {
  if (approved !== undefined) {
    updateData = { approved: Boolean(approved) };
  } else if (rejected !== undefined) {
    updateData = { rejected: Boolean(rejected) };
  } else {
    return NextResponse.json({ error: 'Invalid field for ADMIN' }, { status: 400 });
  }
} else {
  if (submitted !== undefined) {
    updateData = { submitted: Boolean(submitted) };
  } else {
    return NextResponse.json({ error: 'Invalid field for USER' }, { status: 400 });
  }
}
     
    const updatedTask = await prisma.task.update({
      where: { id:  (await params).id },
      data: updateData,
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error('PATCH /task/:id error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}



export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token) as { role: 'ADMIN' | 'USER' };
    
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only admins can delete tasks' }, { status: 403 });
    }

    const taskId = (await params).id;
    
    const deletedTask = await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json(deletedTask, { status: 200 });
  } catch (error) {
    console.error('DELETE /task/:id error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}