import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

import { DecodedIdToken, getAuth } from 'firebase-admin/auth';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) { }

    async loginWithFirebase(idToken: string) {
        let decoded: DecodedIdToken
        try {
            decoded = await getAuth().verifyIdToken(idToken)
        } catch {
            throw new UnauthorizedException(`Invalid Firebase token`)
        }

        const user = await this.usersService.findOrCreate({
            firebaseUid: decoded.uid,
            name: decoded.name ?? decoded.email ?? 'Unknown',
            email: decoded.email ?? ""
        })

        const payload = {
            sub: user._id.toString(),
            uid: decoded.uid,
            role: user.role
        }

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    }
}
