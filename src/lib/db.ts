// lib/mongodb.ts
import { MongoClient, ServerApiVersion } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;

let clientPromise: Promise<MongoClient>; // 타입 변경, 초기값 필요 없음

if (process.env.NODE_ENV === 'development') {
  // 개발 모드에서는 전역 변수를 사용하여 연결을 재사용
  let globalWithMongo = global as {
    _mongoClientPromise?: Promise<MongoClient>; // 더 간단한 타입
  };

  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(uri, {  // options 변수 제거
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,        // strict 모드 (선택 사항)
          deprecationErrors: true, // (선택 사항)
        }
      });
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // 프로덕션 모드에서는 매번 새로운 연결을 생성
  const client = new MongoClient(uri, {  // options 변수 제거
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  clientPromise = client.connect();
}


export default clientPromise;