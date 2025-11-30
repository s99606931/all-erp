import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { tenantContext } from './tenant.middleware';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const tenantId = tenantContext.getStore();

    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is missing in the context');
    }

    return true;
  }
}
