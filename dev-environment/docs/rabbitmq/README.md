# RabbitMQ (erp-rabbitmq)

## 1. 서비스 역할 (Service Role)
**RabbitMQ**는 **메시지 브로커**로, 서비스 간의 비동기 통신을 담당합니다.
- 서비스 간 결합도를 낮춤 (Decoupling)
- 이벤트 기반 아키텍처 구현 (예: 회원가입 완료 -> 이메일 발송 이벤트)
- 작업 큐 (Task Queue) 관리

### 아키텍처 다이어그램

```mermaid
graph LR
    subgraph "Publisher Services"
        AUTH[Auth Service]
        SYSTEM[System Service]
    end
    
    subgraph "RabbitMQ"
        EX[Exchange]
        Q1[Email Queue]
        Q2[Notification Queue]
        Q3[Analytics Queue]
    end
    
    subgraph "Consumer Services"
        EMAIL[Email Worker]
        NOTIF[Notification Worker]
        ANALYTICS[Analytics Worker]
    end
    
    AUTH -->|Publish| EX
    SYSTEM -->|Publish| EX
    
    EX -->|Route| Q1
    EX -->|Route| Q2
    EX -->|Route| Q3
    
    Q1 -->|Consume| EMAIL
    Q2 -->|Consume| NOTIF
    Q3 -->|Consume| ANALYTICS
    
    style EX fill:#FF6600,color:#fff
    style Q1 fill:#FFA500
    style Q2 fill:#FFA500
    style Q3 fill:#FFA500
```

### 메시지 흐름

```mermaid
sequenceDiagram
    participant Auth as Auth Service
    participant RMQ as RabbitMQ
    participant Worker as Email Worker
    
    Auth->>RMQ: Publish(user.registered)
    RMQ-->>Auth: ACK
    Note over Auth: 즉시 응답 반환
    
    RMQ->>Worker: Deliver Message
    Worker->>Worker: 이메일 발송
    Worker->>RMQ: ACK
```


## 2. 정상 작동 확인 (Verification)

### 웹 관리 도구 (Management UI)
- 브라우저에서 접속: [http://localhost:15672](http://localhost:15672)
- **계정**: `admin` / `admin`

### 상태 확인
```bash
docker ps | grep erp-rabbitmq
```

## 3. 사용 가이드 (Usage Guide)

### 접속 정보
- **AMQP Port**: `5672` (애플리케이션 연결용)
- **Management Port**: `15672` (웹 관리용)
- **User**: `admin`
- **Password**: `admin`

### 주요 개념

#### Exchange (교환기)
메시지를 받아서 큐로 라우팅합니다.
- **Direct**: 정확한 라우팅 키 매칭
- **Topic**: 패턴 매칭 (예: `user.*`, `order.#`)
- **Fanout**: 모든 바인딩된 큐로 브로드캐스트
- **Headers**: 헤더 정보 기반 라우팅

#### Queue (큐)
메시지가 저장되는 버퍼입니다.

#### Binding (바인딩)
Exchange와 Queue를 연결하는 규칙입니다.

### 웹 UI 사용법

#### 큐 생성
1. **Queues** 탭 클릭
2. **Add a new queue** 섹션에서 이름 입력 (예: `email-queue`)
3. **Add queue** 버튼 클릭

#### Exchange 생성
1. **Exchanges** 탭 클릭
2. **Add a new exchange** 섹션에서:
   - Name: `user.events`
   - Type: `topic` 선택
3. **Add exchange** 버튼 클릭

#### Binding 생성
1. Exchange 상세 페이지로 이동
2. **Bindings** 섹션에서:
   - To queue: `email-queue` 선택
   - Routing key: `user.registered` 입력
3. **Bind** 버튼 클릭

### 애플리케이션에서 사용하기

#### Node.js (amqplib)
```javascript
const amqp = require('amqplib');

// 연결
const connection = await amqp.connect('amqp://admin:admin@localhost:5672');
const channel = await connection.createChannel();

// 큐 생성
await channel.assertQueue('email-queue', { durable: true });

// 메시지 발행
channel.sendToQueue(
  'email-queue',
  Buffer.from(JSON.stringify({
    to: 'user@example.com',
    subject: '회원가입 완료',
    body: '환영합니다!'
  })),
  { persistent: true }
);

// 메시지 소비
channel.consume('email-queue', async (msg) => {
  const data = JSON.parse(msg.content.toString());
  console.log('Received:', data);
  
  // 이메일 발송 로직
  await sendEmail(data);
  
  // 메시지 확인 (ACK)
  channel.ack(msg);
});
```

#### Exchange를 사용한 Pub/Sub 패턴
```javascript
// Publisher
const exchange = 'user.events';
const routingKey = 'user.registered';

await channel.assertExchange(exchange, 'topic', { durable: true });

channel.publish(
  exchange,
  routingKey,
  Buffer.from(JSON.stringify({ userId: 123, email: 'user@example.com' })),
  { persistent: true }
);

// Subscriber 1 (이메일 발송)
await channel.assertQueue('email-service', { durable: true });
await channel.bindQueue('email-service', exchange, 'user.registered');

channel.consume('email-service', async (msg) => {
  const data = JSON.parse(msg.content.toString());
  await sendWelcomeEmail(data);
  channel.ack(msg);
});

// Subscriber 2 (통계 수집)
await channel.assertQueue('analytics-service', { durable: true });
await channel.bindQueue('analytics-service', exchange, 'user.*');

channel.consume('analytics-service', async (msg) => {
  const data = JSON.parse(msg.content.toString());
  await updateStatistics(data);
  channel.ack(msg);
});
```

#### Python (pika)
```python
import pika
import json

# 연결
credentials = pika.PlainCredentials('admin', 'admin')
connection = pika.BlockingConnection(
    pika.ConnectionParameters('localhost', 5672, '/', credentials)
)
channel = connection.channel()

# 큐 생성
channel.queue_declare(queue='email-queue', durable=True)

# 메시지 발행
message = {
    'to': 'user@example.com',
    'subject': '회원가입 완료',
    'body': '환영합니다!'
}

channel.basic_publish(
    exchange='',
    routing_key='email-queue',
    body=json.dumps(message),
    properties=pika.BasicProperties(delivery_mode=2)  # persistent
)

# 메시지 소비
def callback(ch, method, properties, body):
    data = json.loads(body)
    print(f"Received: {data}")
    # 이메일 발송 로직
    send_email(data)
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_consume(queue='email-queue', on_message_callback=callback)
channel.start_consuming()
```

### 실전 예제: 이메일 발송 시스템

#### 1. 메시지 발행자 (API 서버)
```javascript
// 회원가입 처리
router.post('/register', async (req, res) => {
  const user = await createUser(req.body);
  
  // RabbitMQ로 이메일 발송 요청
  await publishMessage('email-queue', {
    type: 'welcome',
    to: user.email,
    data: { name: user.name }
  });
  
  res.json({ success: true });
});
```

#### 2. 메시지 소비자 (이메일 워커)
```javascript
// email-worker.js
channel.consume('email-queue', async (msg) => {
  const { type, to, data } = JSON.parse(msg.content.toString());
  
  try {
    if (type === 'welcome') {
      await sendWelcomeEmail(to, data);
    }
    channel.ack(msg);  // 성공
  } catch (error) {
    console.error('Email failed:', error);
    channel.nack(msg, false, true);  // 재시도
  }
});
```

### 모니터링 및 관리

#### 큐 상태 확인
웹 UI에서 **Queues** 탭에서 확인:
- **Ready**: 대기 중인 메시지 수
- **Unacked**: 처리 중인 메시지 수
- **Total**: 전체 메시지 수

#### 메시지 수동 발행 (테스트용)
1. 큐 상세 페이지로 이동
2. **Publish message** 섹션에서 메시지 입력
3. **Publish message** 버튼 클릭

### 문제 해결

#### 메시지가 쌓이기만 하고 소비되지 않을 때
- Consumer가 실행 중인지 확인
- Consumer 로그에서 에러 확인
- Dead Letter Queue 설정 고려

#### 연결이 끊길 때
```bash
# RabbitMQ 재시작
docker restart erp-rabbitmq

# 로그 확인
docker logs erp-rabbitmq --tail 50
```
