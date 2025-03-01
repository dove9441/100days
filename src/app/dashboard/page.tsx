// app/leaderboard/page.tsx
import { MongoClient, ObjectId } from 'mongodb';

interface Submission {
  _id: string; // ObjectId를 string으로
  userId: string; // ObjectId를 string으로
  username: string;
  nickname: string;
  content: string;
  isAnonymous: boolean;
  isPublic: boolean;
  submittedAt: string; // ISO string
}

async function getData() {
  const res = await fetch('http://localhost:3000/api/search'); // 서버 컴포넌트에서 직접 호출 시에는 절대경로
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

// 제출 횟수를 계산하는 함수
function countSubmissions(data: Submission[]): { [nickname: string]: number } {
  const counts: { [nickname: string]: number } = {};
  data.forEach((item) => {
    counts[item.nickname] = (counts[item.nickname] || 0) + 1;
  });
  return counts;
}


export default async function Leaderboard() {
  const response: Submission[] = await getData(); // 타입 명시
  const submissionCounts = countSubmissions(response);

  const sortedSubmissions = Object.entries(submissionCounts).sort(
    ([, countA], [, countB]) => countB - countA
  );


  return (
    <div className="p-4 text-white" style={{
      backgroundImage: "url(" + "images/bg.jpg" + ")",
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      height: "100vh",
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
        <div className="mt-5 bg-green-400">
        <ul role="list" className="divide-y divide-gray-100">
          {sortedSubmissions.map(([nickname, count]) => (
            <li key={nickname}>
              <div className="flex min-w-0 gap-x-4 ml-3">
                <div className="min-w-0 flex-auto">
                  <p className="text-xl font-semibold text-white-900">{nickname}</p>
                  <p className="mt-1 truncate text-xs/5 text-gray-500">
                    제출 횟수: {count}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      </div>

      
    </div>
  );
}