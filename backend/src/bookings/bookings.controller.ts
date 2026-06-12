import { Controller, Get, Post, Body, Request, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    const booking = await this.bookingsService.createBooking(
      req.user.userId,
      createBookingDto,
    )
    return {
      message: 'Booking succesful',
      booking,
    };
  }

  @Get()
  async getMyBookings(@Request() req) {
    return this.bookingsService.getUserBookings(req.user.userId);
  }


}
