import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type BookingDocument = HydratedDocument<Booking>

@Schema({ timestamps: true })
export class Booking {
    @Prop({ required: true })
    userId!: string

    @Prop({ required: true })
    showId!: string

    @Prop({ required: true })
    seatId!: string

    @Prop({ default: 'BOOKED' })
    status!: string
}

export const BookingSchema = SchemaFactory.createForClass(Booking)