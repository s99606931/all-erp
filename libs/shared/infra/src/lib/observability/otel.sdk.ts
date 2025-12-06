import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { Logger } from '@nestjs/common';

export function initOpenTelemetry(serviceName: string) {
  const traceExporter = new OTLPTraceExporter({
    // Tempo gRPC Endpoint
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317',
  });

  const sdk = new NodeSDK({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: serviceName,
    }),
    traceExporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        // 너무 많은 로그가 나오지 않도록 일부 비활성화 가능
        '@opentelemetry/instrumentation-fs': { enabled: false },
        '@opentelemetry/instrumentation-net': { enabled: false },
      }),
    ],
  });

  try {
    sdk.start();
    Logger.log(`📡 [OpenTelemetry] Started for service: ${serviceName}`);
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      sdk.shutdown()
        .then(() => Logger.log('📡 [OpenTelemetry] SDK shut down successfully'))
        .catch((err) => Logger.error('📡 [OpenTelemetry] Error shutting down SDK', err))
        .finally(() => process.exit(0));
    });
  } catch (err) {
    Logger.error('📡 [OpenTelemetry] Failed to start SDK', err);
  }
}
