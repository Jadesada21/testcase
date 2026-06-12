import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Seat, SeatDocument, SeatStatus } from './schema/seats.schema';
import { Model } from 'mongoose';

@Injectable()
export class SeatsService {
  constructor(
    @InjectModel(Seat.name) private seatModel: Model<SeatDocument>
  ) { }

  findAll(): Promise<Seat[]> {
    return this.seatModel.find().exec();
  }

  async findOne(seatNumber: string): Promise<Seat> {
    const seat = await this.seatModel.findOne({ seatNumber }).exec()
    if (!seat) throw new NotFoundException(`Seat ${seatNumber} not found`)
    return seat;
  }

  async seed(): Promise<{ message: string }> {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const seats = rows.flatMap(row =>
      cols.map(col => ({ seatNumber: `${row}${col}`, status: SeatStatus.AVAILABLE }))
    )
    await this.seatModel.deleteMany({})
    await this.seatModel.insertMany(seats)
    return { message: `Seeded ${seats.length} seats` }
  }
}
