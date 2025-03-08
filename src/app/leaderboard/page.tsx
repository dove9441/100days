// app/leaderboard/page.tsx
import { MongoClient, ObjectId } from 'mongodb';
import { Pray } from '@/types';
import { Flex, Progress } from 'antd';
import type { ProgressProps } from 'antd';

interface Submission extends Pray {
  _id: string;
}

async function getData() {
  const res = await fetch('http://localhost:3000/api/search', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

function countSubmissions(data: Submission[]): { [nickname: string]: number } {
  const counts: { [nickname: string]: number } = {};
  data.forEach((item) => {
    counts[item.nickname] = (counts[item.nickname] || 0) + 1;
  });
  return counts;
}

export default async function Leaderboard() {
  const response: Submission[] = await getData();
  const submissionCounts = countSubmissions(response);

  const sortedSubmissions = Object.entries(submissionCounts).sort(
    ([, countA], [, countB]) => countB - countA
  );

  let rank = 0; // 현재 순위
  let prevCount = -1; // 이전 제출 횟수 (초기값은 -1 또는 다른 불가능한 값)

  const colors50 = [
    "#108ee9", "#1390e8", "#1692e6", "#1994e5", "#1c96e4", "#1f98e2",
    "#229ae1", "#259ce0", "#289edf", "#2ba0de", "#2ea2dd", "#31a4db",
    "#34a6da", "#37a8d9", "#3aaad7", "#3daed6", "#40b0d4", "#43b2d3",
    "#46b4d1", "#49b6d0", "#4cb8cf", "#4fbacd", "#52bddc", "#55bfdb",
    "#58c1da", "#5bc3d8", "#5ec5d7", "#61c7d5", "#64c9d4", "#67cbd2",
    "#6acdd1", "#6dcfd0", "#70d1ce", "#73d3cd", "#76d5cc", "#79d7ca",
    "#7cd9c9", "#7fdcc8", "#82dec6", "#85e0c5", "#88e2c4", "#8be4c2",
    "#8ee6c1", "#91e8bf", "#94e9be", "#96ebbd", "#99edbb", "#9cefaa",
    "#9ff2a9", "#a2f4a7", "#a5f6a6", "#a8f8a4", "#abfaa3", "#aefca1",
    "#b1fea0", "#b4ff9e", "#b7ff9d", "#baff9b", "#beff9a", "#c1ff98",
    "#c4ff96", "#c7ff95", "#caff93", "#cdff91", "#d0ff8f", "#d3ff8d",
    "#d6ff8c", "#d9ff8a", "#dcff88", "#dfff86", "#e2ff84", "#e5ff82",
    "#e8ff80", "#ebff7e", "#eeff7c", "#f1ff7a", "#f4ff78", "#f7ff76",
    "#faff74", "#fdff72", "#ffff70", "#fff16e", "#ffe36c", "#ffd56a",
    "#ffc767", "#ffb965", "#ffab63", "#ff9d61", "#ff8f5e", "#ff805c",
    "#ff7259", "#ff6457", "#ff5654", "#ff4852", "#ff3a4f", "#ff2c4d",
    "#ff1e4a", "#ff1048", "#ff0245", "#ff0043", "#87d068"
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px' }}>
      <div className="overflow-x-auto text-xl">
        <table className="table">
          <thead>
            <tr>
              <th>순위</th>
              <th>이름</th>
              <th>진행률</th>
            </tr>
          </thead>
          <tbody>
            {sortedSubmissions.map(([nickname, count], index) => {
              // 순위 계산
              if (count !== prevCount) {
                rank = index + 1; // 이전 횟수와 다르면 현재 인덱스 + 1을 순위로
              }
              prevCount = count; // 이전 횟수 업데이트


              return (
                <tr key={nickname}>
                  <th>{rank}</th>
                  <td>{nickname}</td>
                  <td>
                    <Progress steps={50} size='small' showInfo={false} percent={count} status="active" strokeColor={colors50.slice(0, count)} /><br></br>{count}&nbsp;/&nbsp;100일
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>

    // <div className="p-4 text-white" style={{
    //   backgroundImage: "url(" + "images/bg.jpg" + ")",
    //   backgroundPosition: 'center',
    //   backgroundSize: 'cover',
    // }}>
    //   <div className="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32" style={{ fontFamily: 'Jeju Gothic' }}>
    //     <div className="mx-auto max-w-7xl px-6 lg:px-8">
    //       <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
    //         <div className="max-w-xl lg:max-w-lg">
    //           <h2 className="text-4xl font-semibold tracking-tight text-white" id="target" style={{ fontFamily: 'Jeju Gothic', fontSize: '1.5rem', fontWeight: '500' }} >
    //             Leaderboard
    //           </h2>
    //         </div>
    //       </div>
    //     </div>
    //     {/* end of title area */}
    //     {/** start of list area */}
    //     <div className="mt-5 bg-gray-700">
    //       {sortedSubmissions.map(([nickname, count],index) => (
    //           <div key={nickname} className="border p-4 rounded-md shadow">
    //               <h1 className='inline'>{index}  </h1>
    //               <h2 className="inline text-lg font-semibold">{nickname}</h2>
    //               <p>{count}/100</p> 
    //           </div>
    //     ))}
    //     </div>
    //     {/*end of list area */}
    //   </div>
    // </div>
  );
}