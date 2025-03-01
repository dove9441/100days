// components/RankingSection.tsx
'use client';
import { User, Idea } from '../types';
import styles from './RankingSection.module.css'; // CSS Modules import

interface RankingSectionProps {
  users: User[];
  ideas: Idea[];
}

function calculateSubmissionCounts(users: User[], ideas: Idea[]): { [userId: string]: number } {
  const counts: { [userId: string]: number } = {};
  ideas.forEach(idea => {
    counts[idea.userId] = (counts[idea.userId] || 0) + 1;
  });
  return counts;
}

function RankingSection({ users, ideas }: RankingSectionProps) {
  const submissionCounts = calculateSubmissionCounts(users, ideas);
  const listItemHeight = 48 + 16; // <li>의 높이(padding 포함) + margin-bottom
  const maxListHeight = listItemHeight * 5;


  const rankedUsers = [...users].sort((a, b) => {
    const countA = submissionCounts[a.id] || 0;
    const countB = submissionCounts[b.id] || 0;
    return countB - countA;
  });

    return (
        <div className={styles.rankingSection} style={{ maxHeight: `${maxListHeight}px`, overflowY: 'auto', overflowX: 'hidden' }}>
        <ul id="leaderboard" className='w-full'>
            {rankedUsers.map((user, index) => (
                <li key={user.id} className={`${styles.rankCard} bg-white rounded-lg shadow-md p-4 mb-4`}>
                    <span className="font-bold text-xl"> {index + 1}</span>
                    <a className={`${styles.RankCard_userInfo}`} href='#'>
                    <img alt="user" src="/images/defaultuser.png"></img>
                    <span className='ml-5'>{user.name}</span>
                    </a>
                    <div className={styles.score}>
                         {submissionCounts[user.id] || 0 }/100 days
                    </div>

                </li>
            ))}
            </ul>
        </div>
    );
}

export default RankingSection;