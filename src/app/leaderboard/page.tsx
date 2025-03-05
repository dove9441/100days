import { MongoClient, ObjectId } from 'mongodb';
import { Pray }  from '@/types';

interface Submission extends Pray{
  _id: string; // ObjectId를 string으로
}

async function getData() {
  const res = await fetch('http://localhost:3000/api/search'); // 서버 컴포넌트에서 직접 호출 시에는 절대경로
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

// 제출 횟수를 계산하는 함수
function countSubmissions(data: Submission[]): { [nickname: string]: number } { //return값은 {nickname : number}의 dict
  const counts: { [nickname: string]: number } = {};
  data.forEach((item) => {
    counts[item.nickname] = (counts[item.username] || 0) + 1;
  });
  return counts;
}




export default async function Leaderboard() {
  const response: Submission[] = await getData(); // 타입 명시
  //console.log(response);
  const submissionCounts = countSubmissions(response);

  const sortedSubmissions = Object.entries(submissionCounts).sort(
    ([, countA], [, countB]) => countB - countA
  );

  return (
    <div className="p-4 text-white" style={{
      backgroundImage: "url(" + "images/bg.jpg" + ")",
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    }}>
      <div className="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32" style={{ fontFamily: 'Jeju Gothic' }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            <div className="max-w-xl lg:max-w-lg">
              <h2 className="text-4xl font-semibold tracking-tight text-white" id="target" style={{ fontFamily: 'Jeju Gothic', fontSize: '1.5rem', fontWeight: '500' }} >
                Leaderboard
              </h2>
            </div>
          </div>
        </div>
        {/* end of title area */}
        {/** start of list area */}
        <div className="mt-5 bg-gray-700">
          {sortedSubmissions.map(([nickname, count],index) => (
              <div key={nickname} className="border p-4 rounded-md shadow">
                  <h1 className='inline'>{index}  </h1>
                  <h2 className="inline text-lg font-semibold">{nickname}</h2>
                  <p>{count}/100</p> 
              </div>
        ))}
        </div>
        {/*end of list area */}
      </div>
    </div>
  );
}