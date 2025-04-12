
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = verifyToken(token) as { email: string };
    if (!payload?.email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }
  const user = await prisma.user.findUnique({ where: { email:payload.email } });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = await req.json();
  const { title, description, progress, deadline, photos } = body;
  const uploadedImages: string[] = [];

  if (photos?.length) {
    for (const base64Image of photos) {
      const uploadRes = await cloudinary.uploader.upload(base64Image, {
        folder: 'tasks',
      });
      uploadedImages.push(uploadRes.secure_url);
    }
  }
  let task;
if(user.role === "ADMIN"){
  task = await prisma.task.create({
    data: {
      title,
      description,
      deadline: new Date(deadline),
      progress,
      photo: photos.join(','),
      userId: user.id,
      approved: true
    },
  });
}else {
  task = await prisma.task.create({
    data: {
      title,
      description,
      deadline: new Date(deadline),
      progress,
      photo: photos.join(','),
      userId: user.id,
    },
  });
}

  

  return NextResponse.json(task);
}



export async function GET(req:Request){
  try{
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(token) as { email: string };
      if (!payload?.email) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
      }
  
      const user = await prisma.user.findUnique({
        where: { email: payload.email },
      });
  
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      let tasks;

      if (user.role === "ADMIN") {
        // Admin can see all tasks
        tasks = await prisma.task.findMany({
          include: {
            user: {
              select: { name: true, email: true }, 
            },
          },
        });
      } else {
        // Normal user can see only their tasks
        tasks = await prisma.task.findMany({
          where: {
            userId: user.id,
          },
        });
      }
      return NextResponse.json(tasks);
  
  }catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
 
}