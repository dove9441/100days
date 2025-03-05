import { MongoClient, ObjectId } from 'mongodb';
import { Pray }  from '@/types';
import {format} from 'date-fns-tz';

interface Submission extends Pray {
  _id: string; // ObjectId를 string으로
}

async function getData() {
  const res = await fetch('http://localhost:3000/api/search'); // 서버 컴포넌트에서 직접 호출 시에는 절대경로
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}


export default async function List(){
    const response: Submission[] = await getData();
    const sortedResponse = response.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()); // 최신순 정렬
    console.log(response);


    return(
        <div>
        {sortedResponse.map((item) => (
            item.isPublic ? (
            <div key={item._id} className="border p-4 rounded-md shadow">
                <h2 className="text-lg font-semibold">{item.isAnonymous? "익명" : item.nickname}</h2>
                {/*<p className="text-gray-600">User ID: {item.userId}</p> {/* userId가 필요한 경우 */}
                <p>Content: {item.content}</p>
                <p>At: {format(new Date(item.submittedAt).toLocaleString(),'yyyy.MM.dd HH:mm')}</p> {/* 날짜 형식 변환 */}
            </div>
            ) : null
      ))}
        </div>
    );
}