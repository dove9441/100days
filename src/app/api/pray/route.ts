// Form Submit api 서버
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/db';
import { Pray } from '@/types';
import { ObjectId } from 'mongodb';

// UTC로 기본적으로 저장돼서 서울시간으로 바꿔줘야함
import { format, toZonedTime } from 'date-fns-tz';
import { ko } from 'date-fns/locale';

export async function POST(request : Request){
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // 또는 리디렉션
    }
    const userId = session.user.id;
    const formData = await request.json();

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const submissions = db.collection('prays');

    const lastSubmission = await submissions.findOne(
        { userId: userId },
        { sort: { submittedAt: -1 } } // 최신 순으로 정렬
      );
  
    // 날짜 기준 1일 1회 제출 검증
    const today = new Date();
    const todayKST = toZonedTime(today, 'Asia/Seoul');
    todayKST.setHours(0, 0, 0, 0); // 시간, 분, 초, 밀리초를 0으로 설정

    // 2. 해당 사용자의 오늘 날짜 제출 기록 조회.  $gte (보다 크거나 같음) 연산자 사용
    const todaysSubmission = await submissions.findOne({
        userId: new ObjectId(userId),
        submittedAt: { $gte: todayKST },
    });
    if (todaysSubmission) {
        return NextResponse.json(
        { error: "You can only submit once per day." },
        { status: 400 }
        );
    }

    const KST = toZonedTime(new Date(), 'Asia/Seoul'); // UTC -> KST

    
    // userId는 type.ts에서 string인데 바꿔주기 위함
    const pray: Omit<Pray, 'userId'> & { userId : ObjectId } = {
        userId: new ObjectId(userId), // ObjectId로 저장
        username: session.user.username,
        nickname: session.user.nickname,
        content: formData.content,
        isAnonymous: formData.isAnonymous,
        isPublic: formData.isPublic,
        submittedAt: KST, // 2025-03-01T19:19:26.228+09:00 형식 string
    };
    await submissions.insertOne(pray);



    console.log("Form data:", formData, "submitted by:", session.user);

  
  
    return NextResponse.json({ message: "stored successfully!" });
}