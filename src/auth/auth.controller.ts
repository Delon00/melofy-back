import { Controller, Get, Req, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('spotify')
    @UseGuards(AuthGuard('spotify'))
    async spotifyLogin() {}

    @Get('spotify/callback')
    @UseGuards(AuthGuard('spotify'))
    async spotifyCallback(@Req() req, @Res() res: Response) {
        try {
            const user = req.user;
            const token = await this.authService.generateJwt(user);

            res.json({
                message: 'Login réussi avec Spotify',
                token,
                user,
            });
        } catch (error) {
            res.status(500).json({
                message: 'Erreur lors de l\'authentification',
                error: error.message,
            });
        }
    }
    
}
