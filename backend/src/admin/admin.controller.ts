import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { FilterBookingDto } from './dto/filterBooking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';


@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('bookings')
  async getAllBookings(@Query() filter: FilterBookingDto) {
    return this.adminService.getAllBookings(filter)
  }

  @Get('audit-logs')
  async getAuditLog(@Query('event') event?: string) {
    return this.adminService.getAuditLogs({ event })
  }
}
