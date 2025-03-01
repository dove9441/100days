// leaderboard 조회 및 search
// app/api/search/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';


export async function GET(request:Request){
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection('prays'); // 컬렉션 이름

    const prayList = await collection.find({}).toArray();
    //console.log(JSON.stringify(prayList,null,2));
    return NextResponse.json(prayList);
}