import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"


export type SeatDocument = HydratedDocument<Seat>

export enum SeatStatus {
    AVAILABLE = "AVAILABLE",
    RESERVED = "RESERVED",
    LOCKED = "LOCKED"
}

@Schema({ timestamps: true })
export class Seat {
    @Prop({ required: true, unique: true })
    seatNumber!: string

    @Prop({ required: true, default: SeatStatus.AVAILABLE, enum: SeatStatus })
    status!: SeatStatus
}

export const SeatSchema = SchemaFactory.createForClass(Seat)

