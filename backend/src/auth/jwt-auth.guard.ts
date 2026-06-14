import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const skip = process.env.SKIP_AUTH === 'true'

        if (skip) {
            const req = context.switchToHttp().getRequest()
            req.user = { userId: String(process.env.TEST_USER_ID) }
            return true;
        }
        return super.canActivate(context)
    }
}