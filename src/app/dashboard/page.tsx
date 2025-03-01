// app/main/page.tsx
'use client';

import { useState } from 'react';
import RankingSection from '../../components/RankingSection';
import IdeaList from '../../components/IdeaList';
import IdeaFormModal from '../../components/IdeaFormModal';
import { initialUsers, initialIdeas } from '../../data';
import { User, Idea } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export default function MainPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddIdea = (newIdea: Omit<Idea, 'id' | 'submittedAt'>, newUser?: User) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const hasSubmittedToday = ideas.some(
      (idea) => idea.userId === newIdea.userId && idea.submittedAt >= today
    );

    if (hasSubmittedToday) {
      alert('오늘은 이미 제출했습니다.');
      return;
    }
    const completeNewIdea: Idea = {
      ...newIdea,
      id: uuidv4(),
      submittedAt: new Date(),
    };
    setIdeas([...ideas, completeNewIdea]);

    if (newUser) {
        setUsers([...users, newUser]);
    }
  };

  return (
    <div className="container items-center h-full mx-auto p-4">
      <RankingSection users={users} ideas={ideas} />
      <IdeaList ideas={ideas} />
      <button onClick={() => setIsModalOpen(true)} className="todaySubmitBtn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        제출
      </button>
      <IdeaFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddIdea={handleAddIdea}
        users={users}
      />
    </div>
  );
}