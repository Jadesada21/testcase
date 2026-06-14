import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './schema/bookings.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Seat, SeatStatus } from '../seats/schema/seats.schema';
import { RedisService } from '../redis/redis.service';
import { ResponseDto } from './schema/response.dto';
import { Status } from './enum/status.enum';

const LOCK_TTL_SECONDS = 300

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

    const acquired = await this.redisService.acquireLock(
      lockKey,
      lockValue,
      LOCK_TTL_SECONDS,
    )

    if (!acquired) {
      await this.redisService.publishAuditLog({
        event: 'LOCK_FAIL',
        seatNumber,
        userId,
      })
      throw new BadRequestException('Seat has been Locked , Please wait a minute')
    }

    try {
      const seat = await this.seatModel.findOne({ seatNumber })
      if (!seat) throw new BadRequestException('Not found seat')
      if (seat.status !== SeatStatus.AVAILABLE) {
        throw new BadRequestException('Seat not available')
      }

      seat.status = SeatStatus.LOCKED
      seat.lockedBy = new Types.ObjectId(userId)
      await seat.save()

      const lockedUntil = new Date(Date.now() + LOCK_TTL_SECONDS * 1000)
      const booking = await this.bookingModel.create({
        userId,
        seatId: seat._id,
        seatNumber,
        status: Status.PENDING,
        lockedUntil,
      })

      await this.redisService.publishSeatUpdate({ seatNumber, status: SeatStatus.LOCKED, userId })
      await this.redisService.publishAuditLog({
        event: 'SEAT_LOCKED',
        seatNumber,
        userId,
        bookingId: booking._id,
        lockedUntil,
      })

      this.scheduleAutoRelease(booking._id.toString(), seatNumber, lockKey, lockValue)

      return {
        bookingId: booking._id.toString(),
        seatNumber: booking.seatNumber,
        status: booking.status
      }
    } catch (err) {
      await this.redisService.releaseLock(lockKey, lockValue)
      throw err
    }
  }

  async confirmPayment(bookingId: string, userId: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(bookingId)
    if (!booking) throw new NotFoundException('Not found booking')
    if (booking.userId.toString() !== userId) throw new ForbiddenException()
    if (booking.status !== Status.PENDING) {
      throw new BadRequestException(`Booking status is already ${booking.status}`)
    }

    if (new Date() > booking.lockedUntil) {
      throw new BadRequestException(`Timeout Please renew book seat again`)
    }

    booking.status = Status.BOOKED
    booking.paidAt = new Date()
    await booking.save()

    await this.seatModel.findOneAndUpdate(
      { seatNumber: booking.seatNumber },
      { status: SeatStatus.BOOKED, lockedBy: null }
    )

    await this.redisService.publishSeatUpdate({ seatNumber: booking.seatNumber, status: SeatStatus.BOOKED })
    await this.redisService.publishAuditLog({
      event: 'BOOKING_SUCCESSFUL',
      seatNumber: booking.seatNumber,
      userId,
      bookingId,
    })

    return booking
  }

  private scheduleAutoRelease(bookingId: string, seatNumber: string, lockKey: string, lockValue: string) {
    setTimeout(async () => {
      const booking = await this.bookingModel.findById(bookingId)
      if (booking && booking.status === Status.PENDING) {
        booking.status = Status.TIMEOUT
        await booking.save()

        await this.seatModel.findOneAndUpdate(
          { seatNumber },
          { status: SeatStatus.AVAILABLE, lockedBy: null }
        )
        await this.redisService.releaseLock(lockKey, lockValue)
        await this.redisService.publishSeatUpdate({ seatNumber, status: SeatStatus.AVAILABLE })
        await this.redisService.publishAuditLog({
          event: 'BOOKING_TIMEOUT',
          seatNumber,
          bookingId,
        })
      }
    }, LOCK_TTL_SECONDS * 1000)
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return this.bookingModel.find({ userId }).populate('seatId').sort({ createdAt: -1 }).exec()
  }


  async getAllBookings(filter: { status?: string; seatNumber?: string; userId?: string }): Promise<Booking[]> {
    const query: any = {}
    if (filter.status) query.status = filter.status
    if (filter.seatNumber) query.seatNumber = filter.seatNumber
    if (filter.userId) query.userId = filter.userId
    return this.bookingModel.find(query).sort({ createdAt: -1 }).exec()
  }
}
