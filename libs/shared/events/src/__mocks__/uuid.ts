/**
 * uuid 모듈 모킹
 * ESM 이슈 해결을 위해 uuid를 모킹합니다
 */
export const v4 = jest.fn(() => 'test-uuid-1234-5678-90ab-cdef');
