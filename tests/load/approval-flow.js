/**
 * k6 부하 테스트 - 결재 흐름
 * 
 * 실행 방법:
 *   k6 run tests/load/approval-flow.js
 * 
 * 환경 변수:
 *   K6_BASE_URL: API 기본 URL (기본값: http://localhost)
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// 커스텀 메트릭
const errorRate = new Rate('errors');
const loginDuration = new Trend('login_duration');
const approvalDuration = new Trend('approval_duration');

// 테스트 옵션
export const options = {
  stages: [
    { duration: '1m', target: 100 },  // 1분 동안 100명까지 증가
    { duration: '3m', target: 100 },  // 3분 동안 100명 유지
    { duration: '1m', target: 0 },    // 1분 동안 0명으로 감소
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% 요청이 500ms 이내
    errors: ['rate<0.1'],              // 에러율 10% 미만
  },
};

const BASE_URL = __ENV.K6_BASE_URL || 'http://localhost';

// 테스트 사용자 정보
const users = [
  { email: 'test1@example.com', password: 'password123' },
  { email: 'test2@example.com', password: 'password123' },
  { email: 'test3@example.com', password: 'password123' },
  { email: 'test4@example.com', password: 'password123' },
  { email: 'test5@example.com', password: 'password123' },
];

export default function () {
  // 사용자 선택 (VU ID 기반)
  const user = users[__VU % users.length];

  group('로그인', () => {
    const startTime = new Date();
    
    const loginRes = http.post(`${BASE_URL}:3001/api/v1/auth/login`, 
      JSON.stringify({
        email: user.email,
        password: user.password,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    loginDuration.add(new Date() - startTime);
    
    const loginSuccess = check(loginRes, {
      '로그인 성공 (200)': (r) => r.status === 200,
      '토큰 반환': (r) => r.json('token') !== undefined,
    });

    errorRate.add(!loginSuccess);

    if (!loginSuccess) {
      console.log(`로그인 실패: ${loginRes.status} - ${loginRes.body}`);
      return;
    }

    const token = loginRes.json('token');
    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    sleep(1);

    group('결재 목록 조회', () => {
      const startTime = new Date();
      
      const approvalRes = http.get(`${BASE_URL}:3041/api/v1/approvals`, {
        headers: authHeaders,
      });

      approvalDuration.add(new Date() - startTime);

      const approvalSuccess = check(approvalRes, {
        '결재 목록 조회 성공 (200)': (r) => r.status === 200,
        '응답 시간 < 500ms': (r) => r.timings.duration < 500,
        '배열 형태 반환': (r) => Array.isArray(r.json()),
      });

      errorRate.add(!approvalSuccess);
    });

    sleep(1);

    group('결재 요청 생성', () => {
      const approvalData = {
        type: 'PAYROLL',
        title: `테스트 결재 요청 - VU${__VU}`,
        content: `부하 테스트 중 생성된 결재 요청 (반복 ${__ITER})`,
        requesterId: 1,
      };

      const createRes = http.post(`${BASE_URL}:3041/api/v1/approvals`,
        JSON.stringify(approvalData),
        { headers: authHeaders }
      );

      const createSuccess = check(createRes, {
        '결재 생성 성공 (201)': (r) => r.status === 201,
        'ID 반환': (r) => r.json('id') !== undefined,
      });

      errorRate.add(!createSuccess);

      if (createSuccess) {
        const approvalId = createRes.json('id');

        // 생성된 결재 조회
        const getRes = http.get(`${BASE_URL}:3041/api/v1/approvals/${approvalId}`, {
          headers: authHeaders,
        });

        check(getRes, {
          '생성된 결재 조회 성공': (r) => r.status === 200,
        });
      }
    });

    sleep(1);
  });
}

// 테스트 종료 시 요약 리포트
export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'tests/load/approval-flow-summary.json': JSON.stringify(data),
  };
}

// 텍스트 요약 함수
function textSummary(data, options) {
  const indent = options.indent || '';
  let summary = `\n${indent}=== 부하 테스트 결과 ===\n`;
  
  summary += `${indent}총 요청 수: ${data.metrics.http_reqs.values.count}\n`;
  summary += `${indent}평균 응답 시간: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms\n`;
  summary += `${indent}95% 응답 시간: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms\n`;
  summary += `${indent}에러율: ${(data.metrics.errors.values.rate * 100).toFixed(2)}%\n`;
  
  return summary;
}
