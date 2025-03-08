// app/login/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react"; // useRef, useEffect import
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isIdOnly, setIsIdOnly] = useState(false); // 아이디로 로그인 상태
  const usernameInputRef = useRef<HTMLInputElement>(null); // Ref for username input

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const credentials = {
      username: formData.get("username") as string,
      password: isIdOnly ? "" : (formData.get("password") as string), // 조건부 비밀번호
    };

    try {
      const result = await signIn("credentials", {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // 로그인 성공 시 홈 페이지로 리다이렉트
      router.push("/home");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "로그인 실패";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

    // Focus username input when isIdOnly becomes true
    useEffect(() => {
      if (isIdOnly) {
        usernameInputRef.current?.focus();
      }
    }, [isIdOnly]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          로그인
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              아이디
            </label>
            <input
              type="text"
              name="username"
              required
              ref={usernameInputRef}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="아이디를 입력하세요"
            />
          </div>
          <div className="relative overflow-hidden transition-all duration-500">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="비밀번호를 입력하세요"
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
              아이디로 로그인
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          아직 계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            회원가입 하기
          </Link>
        </div>
      </div>
    </div>
  );
}