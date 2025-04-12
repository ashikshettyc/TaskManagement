// app/api/login/route.ts
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

const ADMIN = {
  name:'admin',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'Admin',
};

export async function POST(req: Request) {
  const {name, email, password } = await req.json();

  if (email === ADMIN.email && password === ADMIN.password) {
    const token = signToken({ email, role: 'ADMIN', name: ADMIN.name });
    return NextResponse.json({ token, user: { name: ADMIN.name, email, role: 'ADMIN' } });
  }

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user ) {
    user = await prisma.user.create({
data:{
  email,
  name,
  password,
  role:"USER"
}
    })
  }

  const token = signToken({ email: user.email, role: user.role, name: user.name });
  return NextResponse.json({ token, user });
}
