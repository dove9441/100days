// app/api/auth/[...nextauth]/route.ts
import NextAuth, {Session, DefaultSession, AuthOptions, User as NextAuthUser} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/db"; // MongoDB 연결 설정 import
import { ObjectId } from "mongodb";
import { compare, hash } from 'bcryptjs'; //비밀번호 해싱
import { User as MyUser } from '@/types'; //types.ts에서 정의한 User와 nextjs User와 이름 충돌 때문에 구분
import { JWT } from "next-auth/jwt";
import { AdapterUser } from 'next-auth/adapters';
import { Account } from 'next-auth';

export async function getUserByUsername(username: string): Promise<MyUser | undefined> {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
  
    const user = await db.collection('users').findOne({ username: username });
    if (!user) return undefined;
  
    const { _id, password, ...rest } = user; 
  
    return {
      id: _id.toString(),
      password: password ?? undefined, 
      ...rest,
    } as MyUser;
  }


  export const authOptions : AuthOptions = {
    providers: [
      CredentialsProvider({ // 사용자 지정 인증
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          if (!credentials) return null;
  
          const { username, password } = credentials;
          const user = await getUserByUsername(username); // db에서 username으로 검색해서 doc가져옴
  
          if (!user) throw new Error("존재하지 않는 사용자입니다.");
          if (user.password && !(await compare(password, user.password))) { // 비밀번호 비교(compare는 받아온거 해싱하고 비교)
            throw new Error("비밀번호가 틀렸습니다.");
          }
          return {
            id : user.id,
            username : user.username,
            nickname : user.nickname,
            isIdOnly : user.isIdOnly
          };
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user, account }: { token: JWT; user: MyUser | NextAuthUser | AdapterUser | null; account: Account | null;}){ // User type에서 password를 빼고 받겠다는 것
        // Persist the OAuth access_token to the token right after signin
        if (user) {
              const isAdapterUser = (user: MyUser | NextAuthUser | AdapterUser | null): user is AdapterUser => { // 타입 변경
              return (user as AdapterUser)?.emailVerified !== undefined;
            }
            if(isAdapterUser(user)) {
                  //AdapterUser에 대한 로직. 여기에서는 CredentialsProvider를 사용하므로 필요없음. (근데 안하면 오류남)
                return token;
            }else{
              const myUser = user as MyUser;
                const newToken = {
                  ...token,
                  id : myUser.id as string,
                  username : myUser.username as string,
                  nickname : myUser.nickname as string
                }
                return newToken;
              }
      }
        return token;
      },
      async session({ session, token }: { session: Session; token: JWT}):Promise<Session>{
        //console.log(session);
        const newSession : Session = {
          ...session,
          user: {
              ...session.user,
              id: token.id as string,
              username: token.username as string,
              nickname: token.nickname as string
          }
      } 
      return newSession;
      } // jwt콜백에서 리턴한 토큰이 session 콜백으로 넘어가고 session에서 리턴한 데이터가 세션에 저장됨. (getSession 등으로 보는 거)
    }
  };


  
const handler = NextAuth(authOptions);


export { handler as GET, handler as POST };