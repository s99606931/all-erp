/**
 * Express Request 타입 확장
 * 
 * Express Request 객체에 tenantId 필드를 추가합니다.
 * 이 파일은 TypeScript의 module augmentation 기능을 사용하여
 * 전역 타입을 확장합니다.
 */

declare global {
  namespace Express {
    interface Request {
      /**
       * 현재 요청의 테넌트 ID
       * TenantMiddleware에서 설정됩니다
       */
      tenantId?: string;
    }
  }
}

export {};
