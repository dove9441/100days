// data.js (초기 데이터 - 예시)
import { User, Idea } from './types';


export const initialUsers: User[] = [
    { id: 'user1', name: 'Alice' },
    { id: 'user2', name: 'Bob' },
    { id: 'user3', name: 'Charlie' },
];

export const initialIdeas: Idea[] = [
  {
    id: 'idea1',
    userId: 'user1',
    userName: 'Alice',
    content: '첫 번째 아이디어입니다.',
    isAnonymous: false,
    isPrivate: false,
    submittedAt: new Date('2024-02-25T10:00:00'),
  },
    {
    id: 'idea2',
    userId: 'user2',
    userName: 'Bob',
    content: '두 번째 아이디어입니다.',
    isAnonymous: true,
    isPrivate: false,
    submittedAt: new Date('2024-03-01T12:00:00'),
  },
    {
    id: 'idea3',
    userId: 'user1',
    userName: 'Alice',
    content: '세 번째 아이디어',
    isAnonymous: false,
    isPrivate: false,
    submittedAt: new Date('2024-02-05T12:00:00')
  }
];