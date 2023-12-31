import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { MonitoringService } from './monitoring/monitoring.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  process.on('exit', (code) => {
    console.log(`Process is exiting with code: ${code}`);
  });

  process.on('beforeExit', async () => {
    console.log('process exit...');
    const monitoringService = app.get<MonitoringService>(MonitoringService);
    await monitoringService.onExit();
  });

  process.on('SIGINT', async () => {
    console.log('Received SIGINT signal. Gracefully shutting down...');
    const monitoringService = app.get<MonitoringService>(MonitoringService);
    await monitoringService.onExit();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM signal. Gracefully shutting down...');
    const monitoringService = app.get<MonitoringService>(MonitoringService);
    await monitoringService.onExit();
    process.exit(0);
  });
  await app.listen(3000);
}
bootstrap();
