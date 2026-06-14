import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { HydratedDocument, Types } from "mongoose"


export type SeatDocument = HydratedDocument<Seat>

export enum SeatStatus {
    AVAILABLE = "AVAILABLE",
    BOOKED = "BOOKED",
    LOCKED = "LOCKED"
}

@Schema({ timestamps: true })
export class Seat {
    @Prop({ required: true, unique: true })
    seatNumber!: string

    @Prop({ required: true, default: SeatStatus.AVAILABLE, enum: SeatStatus })
    status!: SeatStatus

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
    lockedBy?: Types.ObjectId
}

export const SeatSchema = SchemaFactory.createForClass(Seat)

