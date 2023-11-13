import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ResponseTimeInterceptor } from '../interceptors/response-time.interceptor';

@Controller('monitoring')
export class MonitoringController {
  @Get()
  @UseInterceptors(new ResponseTimeInterceptor('monitoring'))
  getMonitoringHell(): string {
    return 'Hello from monitoring controller!';
  }

  @UseInterceptors(new ResponseTimeInterceptor('random'))
  @Get('/random')
  getRandomRoute(): string {
    return 'Hello from Random, this should not increase the monitoring reponse time metric but should incrase the global one!';
  }
}
