'use client';

import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {useSession, signOut} from 'next-auth/react';
import Link from 'next/link';
import { Session } from "inspector/promises";
import { usePathname } from 'next/navigation';


function classNames(...classes : (string | boolean | null | undefined)[]): string{
  return classes.filter(Boolean).join(' ')
}

export default function Nav() {
    const {data: session, status} = useSession(); // 세션 정보 가져오기
    const pathname = usePathname(); // 현재 경로 가져오기

    const navigation = [
      { name: 'Home', href: '/home', current: pathname === '/home' },
      { name: 'Leaderboard', href: '/leaderboard', current: pathname === '/leaderboard' },
      { name: '오늘의 묵상', href: '/today_qt', current: pathname === '/today_qt' }, 
      { name: '나눔터', href: '/list', current: pathname === '/list' },
    ]
  return (
    <div className="bg-white-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
        <div role="tablist" className="tabs tabs-border">
                <Link role="tab" className={(classNames(pathname === '/home' ? 'tab tab-active' : 'tab'))} href='/home'>Home</Link>
                <Link role="tab" className={(classNames(pathname === '/leaderboard' ? 'tab tab-active' : 'tab'))} href='/leaderboard'>리더보드</Link>
                <Link role="tab" className={(classNames(pathname === '/today_qt' ? 'tab tab-active' : 'tab'))} href='/today_qt'>오늘의 묵상</Link>
                <Link role="tab" className={(classNames(pathname === '/list' ? 'tab tab-active' : 'tab'))} href='list'>나눔터</Link>
            </div>
            {session ? (
                        <a href="#" className='mr-5'

                        onClick={(e) => {
                            e.preventDefault();
                            signOut();
                        }}
                        >
                        <img src='/logout.svg' width='30px' height='30px'></img>
                        </a>
                    ) : (
                      <Link className="mr-5" href="/login"><img src='/login.svg' width='30px' height='30px'></img></Link>
                    )}
          </div>

        </div>
    </div>
  )
}
