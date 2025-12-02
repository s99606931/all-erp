import { Injectable, NestMiddleware, BadRequestException, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import '../types/express'; // Express Request 타입 확장

/**
 * 테넌트 미들웨어
 * 
 * 모든 HTTP 요청에서 테넌트 ID를 추출하여 요청 객체에 설정합니다.
 * 
 * 테넌트 ID 추출 방법:
 * 1. HTTP 헤더: X-Tenant-ID
 * 2. Subdomain: tenantA.erp.com → "tenantA"
 * 
 * 설정 옵션:
 * - requireTenantId: true이면 테넌트 ID가 없을 경우 400 에러 발생
 */

/**
 * 테넌트 미들웨어
 * 
 * 모든 HTTP 요청에서 테넌트 ID를 추출하여 요청 객체에 설정합니다.
 * 
 * 테넌트 ID 추출 방법:
 * 1. HTTP 헤더: X-Tenant-ID
 * 2. Subdomain: tenantA.erp.com → "tenantA"
 * 
 * 설정 옵션:
 * - requireTenantId: true이면 테넌트 ID가 없을 경우 400 에러 발생
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);
  
  // 테넌트 ID 필수 여부 (환경 변수로 제어 가능)
  private readonly requireTenantId = process.env['REQUIRE_TENANT_ID'] === 'true';

  use(req: Request, res: Response, next: NextFunction): void {
    let tenantId: string | undefined;

    // 1. HTTP 헤더에서 테넌트 ID 추출
    const headerTenantId = req.headers['x-tenant-id'] as string;
    if (headerTenantId) {
      tenantId = headerTenantId;
      this.logger.debug(`Tenant ID from header: ${tenantId}`);
    }

    // 2. Subdomain에서 테넌트 ID 추출 (헤더가 없는 경우)
    if (!tenantId) {
      const host = req.headers.host || '';
      const subdomain = this.extractSubdomain(host);
      
      if (subdomain && subdomain !== 'www') {
        tenantId = subdomain;
        this.logger.debug(`Tenant ID from subdomain: ${tenantId}`);
      }
    }

    // 테넌트 ID 설정
    if (tenantId) {
      req.tenantId = tenantId;
      this.logger.debug(`Request assigned to tenant: ${tenantId}`);
    } else if (this.requireTenantId) {
      // 테넌트 ID가 필수인데 없는 경우 에러 발생
      this.logger.error('Tenant ID is required but not provided');
      throw new BadRequestException('Tenant ID is required. Provide it via X-Tenant-ID header or subdomain.');
    }

    next();
  }

  /**
   * 호스트명에서 서브도메인 추출
   * 예: "tenantA.erp.com" → "tenantA"
   * @param host 호스트명
   * @returns 서브도메인 또는 undefined
   */
  private extractSubdomain(host: string): string | undefined {
    // localhost나 IP 주소는 서브도메인이 없음
    if (host.includes('localhost') || /^\d+\.\d+\.\d+\.\d+/.test(host)) {
      return undefined;
    }

    const parts = host.split('.');
    
    // 최소 3개 이상의 부분이 있어야 서브도메인이 있음
    // 예: subdomain.domain.com
    if (parts.length >= 3) {
      return parts[0];
    }

    return undefined;
  }
}

