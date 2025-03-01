// app/api/signup/route.ts (회원가입 전용)
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import clientPromise from '@/lib/db';
import { User } from '@/types';

export async function POST(request: Request) {
  const { username, nickname, password, isIdOnly } = await request.json();

  // 유효성 검사
  // isIdOnly
  if (!username || !nickname || (!password && !isIdOnly)) {
    return NextResponse.json(
      { error: "모든 필드를 입력해주세요." },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  // 중복 사용자 확인
  const existingUser = await db.collection('users').findOne({ username });
  if (existingUser) {
    return NextResponse.json(
      { error: "이미 존재하는 사용자입니다." },
      { status: 409 }
    );
  }

  // 비밀번호 해싱
  const hashedPassword = await hash(password, 12);

  // 사용자 생성
  await db.collection('users').insertOne({
    username,
    nickname,
    password: hashedPassword,
    isIdOnly
  });
  
  return NextResponse.json({ success: true });
}