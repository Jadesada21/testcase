import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingSchema } from './schema/booking.schema';


@Module({
  imports: [
    MongooseModule.forFeature([])
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }
