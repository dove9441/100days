// app/api/revalidate/route.ts
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
    // today_qt revalidation(서버 crontab으로 crul -X 링크로 스케줄링해줘야함)

  try {
    revalidatePath('/today_qt')
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}