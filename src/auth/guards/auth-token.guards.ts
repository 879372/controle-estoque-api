import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import jwtConfig from "../config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { REQUEST_TOKEN_PAYLOAD_KEY } from "../hashing/auth.constants";

@Injectable()
export class AuthTokenGuard implements  CanActivate{
    constructor(
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)

        if(!token){
            throw new UnauthorizedException('Token inválido')
        }

        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                this.jwtConfiguration
            );
            console.log(payload)

            request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;
        } catch (error) {
            throw new UnauthorizedException(error.message)
        }

        return true;
    }

    extractTokenFromHeader(request: Request): string | undefined {
        const authorization = request.headers?.authorization;
    
        if (!authorization || typeof authorization !== 'string') {
            return;
        }
    
        const parts = authorization.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return;
        }
    
        return parts[1]; // Retorna apenas o token
    }
    
}