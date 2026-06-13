import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { UserRole } from '../enum/user.enum'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    firebaseUid!: string

    @Prop({ required: true })
    name!: string

    @Prop({ required: true, unique: true })
    email!: string

    @Prop({ enum: UserRole, default: UserRole.USER })
    role!: UserRole
}

export const UserSchema = SchemaFactory.createForClass(User)

