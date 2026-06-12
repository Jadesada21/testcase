import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schema/bookings.schema';
import { Seat, SeatSchema } from '../seats/schema/seats.schema';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Seat.name, schema: SeatSchema }
    ]),
    RedisModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule { }
