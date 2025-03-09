'use server';
// app/leaderboard/page.tsx
import { MongoClient, ObjectId } from 'mongodb';
import { Pray } from '@/types';
import { Flex, Progress, Skeleton } from 'antd';
import type { ProgressProps } from 'antd';

import { CarryOutOutlined, PieChartOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"


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
  const session = await getServerSession(authOptions);
  //console.log(response)
  const sortedSubmissions = Object.entries(submissionCounts).sort(
    ([, countA], [, countB]) => countB - countA
  );
  
  const currentUserSubmission = sortedSubmissions.find(([nickname]) => nickname === session?.user?.nickname); // 찾기
  const userCount = currentUserSubmission ? currentUserSubmission[1] : 0; // stat 창에서의 user count




  let rank = 0; // 현재 순위
  let prevCount = -1; // 이전 제출 횟수 (초기값은 -1 또는 다른 불가능한 값)

  const gradients: ProgressProps['strokeColor'] = {
    '0%': '#FEAC5E',
    '50%': '#C779D0',
    '100%': '#4BC0C8',
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px' }}>
      {(session) ? (
             <Row gutter={16}>
             <Col span={12}>
               <Card variant="borderless">
                 <Statistic
                   title="statistics"
                   value={'준비 중'}
                   valueStyle={{ color: '#dee2e6' }}
                   prefix={<PieChartOutlined />}
                   suffix=""
                 />
               </Card>
             </Col>
             <Col span={12}>
               <Card variant="borderless">
                 <Statistic
                   title="총 출석"
                   value={userCount}
                   precision={0}
                   valueStyle={{ color: '#3f8600' }}
                   prefix={<CarryOutOutlined />}
                   suffix="일"
                 />
               </Card>
             </Col>
           </Row>
      ): null}
 
      <div className="overflow-x-auto text-xl">
        <table className="table table-zebra">
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
                    <Progress size={[150,5]} showInfo={true} percent={count} status="active" strokeColor={gradients}/>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}