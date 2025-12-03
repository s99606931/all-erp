import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { tenantContext } from './tenant.middleware';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(): boolean {
    const tenantId = tenantContext.getStore();

    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is missing in the context');
    }

    return true;
  }
}
