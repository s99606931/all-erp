//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * Next.js 설정
 *
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 *
 * @description
 * Nx 모노레포 환경에서 Next.js 애플리케이션을 구성합니다.
 * withNx 플러그인은 Nx 워크스페이스와의 통합을 제공합니다.
 **/
const nextConfig = {
  // Nx 관련 옵션 설정
  // 자세한 내용: https://nx.dev/recipes/next/next-config-setup
  nx: {},
};

// Next.js 플러그인 목록
const plugins = [
  // 추가 플러그인이 필요한 경우 여기에 추가
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
