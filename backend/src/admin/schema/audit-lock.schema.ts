import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type AuditLogDocument = HydratedDocument<Auditlog>

@Schema({ timestamps: true })
export class Auditlog {
    @Prop({ required: true })
    event!: string

    @Prop()
    seatNumber?: string

    @Prop()
    userId?: string

    @Prop()
    bookingId?: string

    @Prop({ type: Object })
    metadata?: Record<string, any>
}

export const AuditLogDocument = SchemaFactory.createForClass(Auditlog)