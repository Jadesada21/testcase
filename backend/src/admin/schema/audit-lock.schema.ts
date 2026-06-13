import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type AuditLogDocument = HydratedDocument<AuditLog>

@Schema({ timestamps: true })
export class AuditLog {
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

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog)