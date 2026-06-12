import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Status } from "../enum/status.enum";


export type BookingDocument = HydratedDocument<Booking>

@Schema({ timestamps: true })
export class Booking {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId!: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'Seat', required: true })
    seatId!: Types.ObjectId

    @Prop({ required: true })
    seatNumber!: string

    @Prop({ enum: Status, default: Status.PENDING })
    status!: Status

    @Prop()
    lockedUntil!: Date

    @Prop()
    paidAt!: Date
}

export const BookingSchema = SchemaFactory.createForClass(Booking)