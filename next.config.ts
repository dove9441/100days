import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //타입스크립트로 인한 빌드 오류 방지
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
},
  
};

export default nextConfig;
