// types.ts (타입 정의 - TypeScript를 사용하는 경우)

export interface User {
    id: string;
    username: string;
    nickname : string;
    password? : string; // ?은 optional. 없어도 된다는 뜻
    isIdOnly? : boolean;
  }
  
  export interface Pray {
    userId: string;
    username: string;
    nickname: string; // 또는 User 객체 참조
    content: string;
    isAnonymous: boolean;
    isPublic: boolean;
    submittedAt: Date;
  }