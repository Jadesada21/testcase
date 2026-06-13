import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from './schema/booking.schema';
import { Model } from 'mongoose';
import { FilterBookingDto } from './dto/filterBooking.dto';


@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>
  ) { }


  async getAllBookings(filter: FilterBookingDto): Promise<Booking[]> {
    const query: any = {}
    if (filter.status) query.status = filter.status
    if (filter.userId) query.userId = filter.userId
    if (filter.seatNumber) query.seatNumber = filter.seatNumber
    return this.bookingModel.find(query).sort({ createdAt: - 1 }).exec()
  }

}
