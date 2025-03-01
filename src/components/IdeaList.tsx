// components/IdeaList.tsx
'use client'
import { Idea } from '@/types';
import styles from './IdeaList.module.css'; // CSS Modules import

interface IdeaListProps {
  ideas: Idea[];
}

function IdeaList({ ideas }: IdeaListProps) {
  const publicIdeas = ideas.filter((idea) => !idea.isPrivate);

  return (
    <div className="idea-list mb-8">
      <h2 className="text-2xl font-bold mb-4 text-center">제출 목록</h2>
      <ul className="w-full">
        {publicIdeas.map((idea) => (
          <li key={idea.id} className={`${styles.idea} bg-white rounded-lg shadow-md p-4 mb-4`}>
            <p className="font-bold text-gray-800">
              {idea.isAnonymous ? '익명' : idea.userName}
            </p>
            <p className="text-gray-600">{idea.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IdeaList;