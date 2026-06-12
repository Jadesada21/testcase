import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './schema/bookings.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Seat, SeatStatus } from '../seats/schema/seats.schema';
import { RedisService } from '../redis/redis.service';
import { ResponseDto } from './schema/response.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Seat.name) private seatModel: Model<Seat>,
    private redisService: RedisService,
  ) { }


  async createBooking(userId: string, createBookingDto: CreateBookingDto): Promise<ResponseDto> {
    const { seatNumber } = createBookingDto

    const lockKey = `lock:seat:${seatNumber}`
    const lockValue = `${userId}-${Date.now()}`
    const lockTTL = 5

    const acquired = await this.redisService.acquireLock(
      lockKey,
      lockValue,
      lockTTL,
    )

    if (!acquired) {
      throw new BadRequestException('Seat has been Locked , Please wait a minute')
    }

    try {
      const seat = await this.seatModel.findOne({ seatNumber })
      if (!seat) {
        throw new BadRequestException('Not found seat')
      }

      if (seat.status !== SeatStatus.AVAILABLE) {
        throw new BadRequestException('Seat not available')
      }

      seat.status = SeatStatus.RESERVED
      await seat.save()

      const booking = await this.bookingModel.create({
        userId,
        seatId: seat._id,
      })

      return {
        bookingId: booking._id.toString(),
        seatNumber,
        status: 'RESERVED'
      }
    } finally {
      await this.redisService.releaseLock(lockKey, lockValue)
    }
  }


  async getUserBookings(userId: string): Promise<Booking[]> {
    return this.bookingModel.find({ userId }).populate('seatId').exec()
  }
}
