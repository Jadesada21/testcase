import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";


export type BookingDocument = HydratedDocument<Booking>

@Schema({ timestamps: true })
export class Booking {
    @Prop({ required: true })
    bookingId!: string

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId!: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'Seat', required: true })
    seatId!: Types.ObjectId
}

export const BookingSchema = SchemaFactory.createForClass(Booking)