import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeatsService } from './seats.service';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) { }

  @Get()
  findAll() {
    return this.seatsService.findAll();
  }

  @Get(':seatNumber')
  findOne(@Param('id') seatNumber: string) {
    return this.seatsService.findOne(seatNumber);
  }

  @Post('seed')
  seed() {
    return this.seatsService.seed()
  }
}
