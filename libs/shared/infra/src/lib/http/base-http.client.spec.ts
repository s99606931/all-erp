import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { BaseHttpClient } from './base-http.client';
import { HttpRequestInterceptor, HttpResponseInterceptor } from './http.interceptor';

describe('BaseHttpClient', () => {
  let client: BaseHttpClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        BaseHttpClient,
        HttpRequestInterceptor,
        HttpResponseInterceptor,
      ],
    }).compile();

    client = module.get<BaseHttpClient>(BaseHttpClient);
  });

  it('클라이언트가 정상적으로 생성되어야 한다', () => {
    expect(client).toBeDefined();
  });

  it('GET 메서드가 존재해야 한다', () => {
    expect(client.get).toBeDefined();
    expect(typeof client.get).toBe('function');
  });

  it('POST 메서드가 존재해야 한다', () => {
    expect(client.post).toBeDefined();
    expect(typeof client.post).toBe('function');
  });

  it('PUT 메서드가 존재해야 한다', () => {
    expect(client.put).toBeDefined();
    expect(typeof client.put).toBe('function');
  });

  it('DELETE 메서드가 존재해야 한다', () => {
    expect(client.delete).toBeDefined();
    expect(typeof client.delete).toBe('function');
  });
});
