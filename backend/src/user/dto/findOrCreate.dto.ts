import { IsString, IsEmail, IsNotEmpty } from 'class-validator'

export class FindOrCreateDto {
    @IsString()
    @IsNotEmpty()
    name!: string

    @IsEmail()
    @IsNotEmpty()
    email!: string

    @IsNotEmpty()
    @IsString()
    firebaseUid!: string
}
