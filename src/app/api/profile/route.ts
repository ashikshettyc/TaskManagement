// app/api/profile/route.ts
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token) as { email: string };
    if (!payload?.email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, phone } = body;


    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: payload.email },
      data: { name, email, phone },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token) as { email: string };
    if (!payload?.email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    // Fetch the user data using the email from the decoded token
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return the user data (excluding sensitive information like password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user; // Exclude password field from response
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}