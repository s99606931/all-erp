import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';
import { TENANT_HEADER } from './constants';

export const tenantContext = new AsyncLocalStorage<string>();

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 1. Header에서 Tenant ID 확인
    let tenantId = req.headers[TENANT_HEADER] as string;

    // 2. Header에 없으면 Subdomain에서 확인 (개발 환경 등 필요 시)
    if (!tenantId) {
      const host = req.headers.host;
      if (host) {
        const parts = host.split('.');
        // 예: tenant-a.erp.com -> tenant-a
        // 로컬호스트(localhost:3000)인 경우 처리 주의
        if (parts.length > 2) {
          tenantId = parts[0];
        }
      }
    }

    // 3. Tenant ID가 없으면 에러 또는 통과 (정책에 따라 결정)
    // 여기서는 일단 통과시키고 Guard에서 막거나, Public API를 허용함
    
    if (tenantId) {
      // ALS에 저장
      tenantContext.run(tenantId, () => {
        next();
      });
    } else {
      next();
    }
  }
}
