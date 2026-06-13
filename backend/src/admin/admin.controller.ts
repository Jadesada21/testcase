import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { FilterBookingDto } from './dto/filterBooking.dto';


@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('bookings')
  async getAllBookings(@Query() filter: FilterBookingDto) {
    return this.adminService.getAllBookings(filter)
  }

}
