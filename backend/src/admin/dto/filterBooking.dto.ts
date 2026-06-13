import { IsOptional, IsString } from "class-validator"

export class FilterBookingDto {

    @IsOptional()
    @IsString()
    status?: string

    @IsOptional()
    @IsString()
    seatNumber?: string

    @IsOptional()
    @IsString()
    userId?: string
}