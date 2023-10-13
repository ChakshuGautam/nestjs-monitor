import { Module, OnModuleInit, Global, DynamicModule } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { CacheModule } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import { MonitoringController } from './monitoring.controller';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6359,
    }),
  ],
  providers: [MonitoringService],
  exports: [MonitoringService],
  controllers: [MonitoringController],
})
export class MonitoringModule implements OnModuleInit {
  constructor(private readonly monitoringService: MonitoringService) {}

  async onModuleInit() {
    await this.monitoringService.initializeAsync();
  }

  static forRoot(options?: any): DynamicModule {
    return {
      module: MonitoringModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
      ],
      exports: [MonitoringService],
    };
  }
}
