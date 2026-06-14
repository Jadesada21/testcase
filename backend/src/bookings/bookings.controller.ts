import { Controller, Get, Post, Body, Request, UseGuards, HttpCode, HttpStatus, Param, Patch, UnauthorizedException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';
import type { RequestWithUser } from '../auth/type/jwt-payload.type';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req: RequestWithUser,
    @Body() createBookingDto: CreateBookingDto
  ) {
    const userId = req.user?.userId ?? (process.env.NODE_ENV === 'dev' ? process.env.TEST_USER_ID : undefined)
    if (!userId) throw new UnauthorizedException()

    const booking = await this.bookingsService.createBooking(
      userId,
      createBookingDto,
    )
    return {
      message: 'Seat lock succesfully , you have 5 minutes to complete payment',
      booking,
    };
  }

  @Patch(':id/confirm')
  async confirm(@Param('id') id: string, @Request() req: RequestWithUser) {
    const booking = await this.bookingsService.confirmPayment(id, req.user.userId)
    return { message: 'Payment successful', booking }
  }

  @Get('my')
  async getMyBookings(@Request() req: RequestWithUser) {
    return this.bookingsService.getUserBookings(req.user.userId);
  }
}
