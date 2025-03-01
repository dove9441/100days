// components/IdeaFormModal.tsx
'use client';

import { useState } from 'react';
import { User, Idea } from '@/types';

interface IdeaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIdea: (newIdea: Omit<Idea, 'id' | 'submittedAt'>, newUser?: User) => void;
  users: User[];
}

function IdeaFormModal({ isOpen, onClose, onAddIdea, users }: IdeaFormModalProps) {
  const [userName, setUserName] = useState('');
  const [ideaContent, setIdeaContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!userName) {
      alert("유저 이름을 입력해주세요.");
      return;
    }

    if (!ideaContent) {
      alert("아이디어를 입력해주세요.");
      return;
    }

    const existingUser = users.find((user) => user.name === userName);
    const userId = existingUser ? existingUser.id : Date.now().toString();
    const finalUserName = existingUser ? existingUser.name : userName;

    const newIdea: Omit<Idea, 'id' | 'submittedAt'> = {
      userId: userId,
      userName: finalUserName,
      content: ideaContent,
      isAnonymous,
      isPrivate,
    };

    onAddIdea(newIdea, existingUser ? undefined : { id: userId, name: userName });

    setIdeaContent('');
    setIsAnonymous(false);
    setIsPrivate(false);
    setUserName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">아이디어 공유하기</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="user-name" className="block text-sm font-medium text-gray-700">
              유저 이름:
            </label>
            <input
              type="text"
              id="user-name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="이름을 입력하세요"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="idea-content" className="block text-sm font-medium text-gray-700">
              아이디어:
            </label>
            <textarea
              id="idea-content"
              value={ideaContent}
              onChange={(e) => setIdeaContent(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">익명으로 표시</span>
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">공유하지 않기</span>
            </label>
          </div>
          <div className="flex justify-between">

            <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >제출</button>
            <button
              type="button"
              onClick={onClose}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"

            >
              닫기
            </button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default IdeaFormModal;