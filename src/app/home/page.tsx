// app/home/page.tsx
"use client";

import Typewriter from 'typewriter-effect';
import { Switch, Description, Field, Label} from '@headlessui/react';
import {useState, useEffect, useRef} from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; 

const randomComments = ["구하라 그러면 너희에게 주실 것이요 찾으라 그러면 찾을 것이요 문을 두드리라 그러면 너희에게 열릴 것이니 구하는 이마다 얻을 것이요 찾는 이가 찾을 것이요 두드리는 이에게 열릴 것이니라",
  "그러므로 내가 너희에게 말하노니 무엇이든지 기도하고 구하는 것은 받은 줄로 믿으라 그리하면 너희에게 그대로 되리라",
  "아무것도 염려하지 말고 오직 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라 그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라",
  "너희는 내게 부르짖으며 와서 내게 기도하면 내가 너희를 들을 것이요",
  "일을 행하는 여호와, 그것을 지어 성취하는 여호와, 그 이름을 여호와라 하는 자가 이같이 이르노라. 너는 내게 부르짖으라 내가 네게 응답하겠고 네가 알지 못하는 크고 비밀한 일을 네게 보이리라",
  "내 이름으로 일컫는 내 백성이 그들의 악한 길에서 떠나 스스로 낮추고 기도하여 내 얼굴을 찾으면 내가 하늘에서 듣고 그들의 죄를 사하고 그들의 땅을 고칠지라",
  "내 의의 하나님이여 내가 부를 때에 응답하소서 곤란 중에 나를 너그럽게 하셨사오니 내게 은혜를 베푸사 나의 기도를 들으소서",
  "하나님이여 내게 응답하시겠으므로 내가 불렀사오니 내게 귀를 기울여 내 말을 들으소서",
  "여호와께서는 자기에게 간구하는 모든 자 곧 진실하게 간구하는 모든 자에게 가까이 하시는도다",
  "너는 기도할 때에 네 골방에 들어가 문을 닫고 은밀한 중에 계신 네 아버지께 기도하라 은밀한 중에 보시는 네 아버지께서 갚으시리라",
  "너희가 기도할 때에 무엇이든지 믿고 구하는 것은 다 받으리라 하시니라",
  "시험에 들지 않게 깨어 있어 기도하라 마음에는 원이로되 육신이 약하도다 하시고",
  "기도를 항상 힘쓰고 기도에 감사함으로 깨어 있으라",
  "너희 중에 누구든지 지혜가 부족하거든 모든 사람에게 후히 주시고 꾸짖지 아니하시는 하나님께 구하라 그리하면 주시리라. 오직 믿음으로 구하고 조금도 의심하지 말라 의심하는 자는 마치 바람에 밀려 요동하는 바다 물결 같으니 이런 사람은 무엇이든지 주께 얻기를 생각하지 말라"
];

const randomCommentsSource = ["마태복음 7:7~8","마가복음 11:24","빌립보서 4:6~7","예레미야 29:12", "예레미야 33:2-3","역대하 7:14","시편 4:1","시편 17:6","시편 145:18","마태복음 6:6","마태복음 21:22","마태복음 26:41","골로새서 4:2","야고보서 1:5-7"];


export default function HomePage() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [successMessage, setSuccessMessage] = useState(''); // 성공 메시지
  const [error, setError] = useState<string | null>(null);
  //const [content, setContent] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [submitted, setSubmitted] = useState(false);
  // hydration 오류가 나서 써야함. 
  const [rand, setRand] = useState<number | null>(null);

  useEffect(() => {
    setRand(Math.floor(Math.random()*15));

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://unpkg.com/type-hangul";
    document.head.appendChild(script);

    script.onload = () => {
      const TypeHangul: any = (window as any).TypeHangul; 
      TypeHangul.type('#target', {intervalType : 90});
  }

  }, []);

  // 폼 제출 Handling  영역
  const {data: session, status} = useSession();
  const router = useRouter();
  //console.log(session);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 기본 폼 제출 동작 방지
    if (status === "loading") {
        return; 
    }

    if (!session) {
      // 로그인되지 않았으면 /login으로 리다이렉트
      router.push('/login');
      return;
    }

    try {
      // 유저 id, username 체크는 api서버에서 하도록
      var content = '';
      if(inputRef.current){
        content = inputRef.current.value
        const response = await fetch('/api/pray', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content,
            isAnonymous,
            isPublic,
          }),
        });
  
        if(response.ok){
          setSuccessMessage('제출되었습니다.');
          inputRef.current.value = '';
          setSubmitted(true);

        }else{
          const errorData = await response.json();
          throw new Error(errorData.error || '제출 실패');
        }


      }

      // 다른 성공 처리 (예: 입력 필드 초기화, 성공 메시지 표시)
    } catch (error : any) {
        setError(error instanceof Error ? error.message : "알 수 없는 오류 발생");
        setSuccessMessage('');
    }

  };


  return (
    <div className="p-4" style={{  
        backgroundImage: "url(" + "images/bg.jpg" + ")",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: "100vh",
      }}>
<div className="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32" style={{fontFamily : 'Jeju Gothic'}}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-4xl font-semibold tracking-tight text-white" id="target" style={{fontFamily : 'Jeju Gothic', fontSize : '1.5rem', fontWeight : '500'}} > 
             오늘의 기도제목은 무엇인가요?
          </h2>
            <div id="comment" className="mt-4 text-lg text-gray-300" style={{fontFamily : 'Jeju Myeongjo'}}>
            <Typewriter
          options={{
              strings: rand !== null && randomComments[rand] ? randomComments[rand] : '',
              autoStart: true,
              delay: rand !== null && randomComments[rand] ? 3500 / (randomComments[rand].length - 1) : 100,
          }}/>
            </div>
            <span className="mt-4 text-lg text-gray-300" style={{fontFamily : 'Jeju Myeongjo'}}>{ rand !== null && randomCommentsSource[rand] ? randomCommentsSource[rand] : '' }</span>
            {/* form 영역 */}
            <div className="mt-6 w-full gap-x-4 mb-2">
              <form onSubmit={handleSubmit} className='flex flex-row'>
                <label htmlFor="prayInput" className="sr-only">
                    Text
                  </label>
                  <textarea
                    id="prayInput"
                    name="pray"
                    ref={inputRef}
                    required
                    placeholder="Enter yours"
                    className="min-w-0 max-w-[100%] rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 flex-grow"
                  />
        <button
          type="submit"
          className={`
            inline-flex items-center justify-center
            rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500
            disabled:bg-gray-500
            transition-colors duration-300 ease-linear
            ${submitted ? 'bg-green-500 hover:bg-green-600 focus-visible:outline-green-500' : 'bg-indigo-500 hover:bg-indigo-400 focus-visible:outline-indigo-500'}
          `}
        >
          {submitted ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
          </svg>

          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z" clipRule="evenodd" />
            </svg>
          )}
        </button>

              </form>
            </div>
                {/* 성공 메시지 표시 */}
                    {successMessage && (
                        <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm mb-4">
                          {successMessage}
                        </div>
                )}

                {/* 에러 메시지 표시 */}
                {error && (
                  <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm mb-4">
                    {error}
                  </div>
                )}
            {/* 제출한 답을 공유할지, 한다면 익명으로 할지 선택하는 스위치 영역*/}
            <Disclosure as="div" className="p-3" defaultOpen={false}>
          <DisclosureButton className="group flex w-full items-center justify-between">
            <ChevronDownIcon className="size-5 fill-white/60 group-data-[hover]:fill-white/50 group-data-[open]:rotate-180 m-auto mb-2" />
          </DisclosureButton>
          <DisclosurePanel className="mt-2 text-sm/5 text-white/50">
              <Field className="flex items-center mb-2">
                  <Label className="mr-5 pt-1 font-thin text-gray-200 flex items-center">기도제목 공유하기</Label>
                      <Switch
                          checked={isPublic}
                          onChange={setIsPublic}
                          className={`${
                            isPublic ? 'bg-blue-600' : 'bg-gray-200'
                          } relative inline-flex h-5 w-11 items-center rounded-full`}
                        >
                          <span className="sr-only">Enable notifications</span>
                          <span
                            className={`${
                              isPublic ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                          />
                      </Switch>
                </Field>
                <Field className="flex items-center">
                  <Label className="mr-5 pt-1 font-thin text-gray-200 flex items-center">익명으로 표시하기</Label>
                      <Switch
                          checked={isAnonymous}
                          onChange={setIsAnonymous}
                          className={`${
                            isAnonymous ? 'bg-blue-600' : 'bg-gray-200'
                          } relative inline-flex h-5 w-11 items-center rounded-full`}
                        >
                          <span className="sr-only">Enable notifications</span>
                          <span
                            className={`${
                              isAnonymous ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                          />
                      </Switch>
                </Field>
          </DisclosurePanel>
        </Disclosure>


          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <div className="flex flex-col items-start">
              <dt className="mt-4 text-base font-semibold text-white">{/*placeholder*/}</dt>
              <dd className="mt-2 text-base/7 text-gray-400">
                    {/*다람쥐 헌 쳇바퀴에 타고파*/}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div aria-hidden="true" className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 blur-3xl xl:-top-6">
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="aspect-1155/678 w-[72.1875rem] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
    </div>

    </div>
  );
}