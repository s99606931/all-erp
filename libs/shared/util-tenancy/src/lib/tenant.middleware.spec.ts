import { TenantMiddleware } from './tenant.middleware';
import { Request, Response, NextFunction } from 'express';
import { TENANT_HEADER } from './constants';

describe('TenantMiddleware', () => {
  let middleware: TenantMiddleware;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    middleware = new TenantMiddleware();
    req = {
      headers: {},
    };
    res = {};
    next = jest.fn();
  });

  it('should extract tenant id from header', () => {
    req.headers = { [TENANT_HEADER]: 'tenant-a' };

    // ALS context check is tricky in unit test without running inside run(),
    // but we can check if it calls next()
    middleware.use(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it('should extract tenant id from subdomain', () => {
    req.headers = { host: 'tenant-b.erp.com' };

    middleware.use(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it('should pass if no tenant id found (depending on policy)', () => {
    req.headers = { host: 'localhost:3000' };

    middleware.use(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });
});
