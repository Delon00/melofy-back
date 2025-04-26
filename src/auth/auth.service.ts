import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}
    
    async generateJwt(user: any) {
        try {
            const payload = {
                sub: user.id,
                email: user.email,
                accessToken: user.accessToken,
            };

            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                console.error('JWT_SECRET is undefined');
                throw new Error('JWT_SECRET is not defined!');
            }

            return {
            access_token: this.jwtService.sign(payload, { secret: jwtSecret, expiresIn: '7d' }),
            };
        } catch (error) {
            console.error('Erreur lors de la génération du JWT:', error);
            throw new Error('Erreur lors de la génération du JWT');
        }
    }

}
