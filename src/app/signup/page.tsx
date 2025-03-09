// app/signup/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react"; 
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 세션 로딩중 여부 확인
  const [isIdOnly, setIsIdOnly] = useState(false); // 아이디만 사용 여부 상태


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get("username") as string,
      nickname: formData.get("nickname") as string,
      password: isIdOnly ? "" : (formData.get("password") as string), // 조건부 비밀번호
      confirmPassword: isIdOnly ? "" : (formData.get("confirmPassword") as string), // 조건부 비밀번호 확인
      isIdOnly : isIdOnly,
    };

    // 클라이언트측 유효성 검사 (비밀번호 사용 시)
    if (!isIdOnly && data.password !== data.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error");
      }

      // 회원가입 성공 시 로그인페이지로 리다이렉트
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류 발생");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          회원가입
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              아이디(로그인 시 사용)
            </label>
            <input
              type="text"
              name="username"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="아이디를 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름 또는 별명
            </label>
            <input
              type="text"
              name="nickname"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="이름을 입력하세요"
            />
          </div>

          <div className="relative overflow-hidden transition-all duration-500">
            {/* 비밀번호 관련 필드들은 isIdOnly 상태에 따라 조건부 렌더링 및 애니메이션 적용 */}
            <div
              className={`transition-all duration-500 ${
                isIdOnly ? "max-h-0 opacity-0" : "max-h-screen opacity-100"
              }`}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  type="password"
                  name="password"
                  required={!isIdOnly}
                  minLength={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="비밀번호"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required={!isIdOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="비밀번호를 다시 입력하세요"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="idOnlyCheckbox"
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={isIdOnly}
              onChange={() => setIsIdOnly(!isIdOnly)}
            />
            <label
              htmlFor="idOnlyCheckbox"
              className="text-sm font-medium text-gray-700"
            >
              아이디만 사용하기
              <span className="text-xs text-gray-400">(비밀번호 없이 로그인)</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "처리 중..." : "가입"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            로그인 하기
          </Link>
        </div>
      </div>
    </div>
  );
}