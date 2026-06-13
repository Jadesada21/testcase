import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schema/booking.schema';
import { AuditLog, AuditLogSchema } from './schema/audit-lock.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: AuditLog.name, schema: AuditLogSchema }
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }
