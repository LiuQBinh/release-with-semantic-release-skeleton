import {
  DynamicModule,
  Global,
  Module,
} from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ThrottlerModule, ThrottlerModuleOptions, ThrottlerStorage } from '@nestjs/throttler'
import { APP_GUARD, Reflector } from '@nestjs/core'
import { RATE_LIMIT_DEFAULT } from 'app.constant'
import { GgjThrottlerIpGuard } from '../guard/GgjThrottlerIpGuard'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

@Global()
@Module({})
export class AppModule {
  static forRoot(modules): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        HttpModule,
        TypeOrmModule.forRoot({
          type: 'mongodb',
          url: process.env.MONGODB_URI,
          entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
          autoLoadEntities: true,
        }),
        ...modules,
        ThrottlerModule.forRoot([{
          limit: RATE_LIMIT_DEFAULT.LIMIT,
          ttl: RATE_LIMIT_DEFAULT.TTL,
          ignoreUserAgents: [/(Chrome-Lighthouse|bot)/i],
        }]),
      ],
      providers: [
        {
          provide: APP_GUARD,
          useFactory: (
            option: ThrottlerModuleOptions,
            storage: ThrottlerStorage,
            reflector: Reflector,
          ) => new GgjThrottlerIpGuard(option, storage, reflector),
          inject: ['THROTTLER:MODULE_OPTIONS', ThrottlerStorage, Reflector],
        },
      ],
      exports: [],
    }
  }
}
