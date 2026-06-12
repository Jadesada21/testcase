import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Seat, SeatSchema } from './schema/seats.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Seat.name, schema: SeatSchema }])],
  controllers: [SeatsController],
  providers: [SeatsService],
  exports: [SeatsService],
})
export class SeatsModule { }
