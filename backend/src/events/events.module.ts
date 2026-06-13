import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';
import { RedisModule } from '../redis/redis.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLog, AuditLogSchema } from '../admin/schema/audit-lock.schema';

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
  ],
  providers: [EventsService, EventsGateway],
  exports: [EventsGateway]
})
export class EventsModule { }
