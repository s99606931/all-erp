/**
 * Outbox 처리를 위한 최소한의 Prisma 인터페이스
 * Raw Query를 사용하여 특정 모델(Prisma Client 생성 여부)에 의존하지 않도록 함
 */
export interface OutboxRepository {
  $executeRawUnsafe(query: string, ...values: any[]): Promise<any>;
  $queryRawUnsafe<T = any>(query: string, ...values: any[]): Promise<T>;
}
