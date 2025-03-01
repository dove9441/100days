// app/api/db-status/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

export async function GET(request: Request) { // GET 요청 처리
  try {
    const client = await clientPromise;
    await client.db().command({ ping: 1 }); // ping 명령으로 연결 확인

     return NextResponse.json({
      status: 'success',
      isConnected: true,
      message: 'MongoDB is connected',
    });

  } catch (error) {
    console.error(error);
     return NextResponse.json({
      status: 'error',
      isConnected: false, // 연결 실패
      message: 'Failed to connect to MongoDB',
    },{status: 500});

  }
}