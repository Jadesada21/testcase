import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) { }

    async register(registerDto: RegisterDto) {
        const existing = await this.usersService.findByName(registerDto.name)
        if (existing) throw new ConflictException(`name already exist`)

        const hashed = await bcrypt.hash(registerDto.password, 10)
        const user = await this.usersService.create({
            ...registerDto,
            password: hashed,
        })

        return { message: 'Register successful' }
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByName(loginDto.name)
        if (!user) throw new UnauthorizedException('Invalid Credentials')

        const isMatch = await bcrypt.compare(loginDto.password, user.password)
        if (!isMatch) throw new UnauthorizedException('Invalid Credentials')

        const payload = { sub: user._id, name: user.name }
        return { access_token: this.jwtService.sign(payload) }
    }

}
