import { Controller, Get, Req, Query, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { StatsService } from './stats.service';
import { AuthGuard } from '@nestjs/passport';
import User from 'src/interfaces/User.interfaces';

@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) {}

    // Obtenir les albums populaires
    @Get('album')
    @UseGuards(AuthGuard('jwt'))
    async getTopAlbums(
        @Req() req: Request,
        @Query('timeRange') timeRange: string = 'short_term',
    ) {
        const user = req.user as User;
        return this.statsService.getTopAlbums(user.accessToken, timeRange);
    }

    // Obtenir les titres populaires
    @Get('top_song')
    @UseGuards(AuthGuard('jwt'))
    async getTopTracks(
        @Req() req: Request,
        @Query('timeRange') timeRange: string = 'short_term',
    ) {
        const user = req.user as User;
        return this.statsService.getTopTracks(user.accessToken, timeRange);
    }

    // Obtenir les artistes populaires
    @Get('top_artist')
    @UseGuards(AuthGuard('jwt'))
    async getTopArtists(
        @Req() req: Request,
        @Query('timeRange') timeRange: string = 'short_term',
    ) {
        const user = req.user as User;
        return this.statsService.getTopArtists(user.accessToken, timeRange);
    }

    // Obtenir les genres populaires
    @Get('top_genre')
    @UseGuards(AuthGuard('jwt'))
    async getTopGenres(
        @Req() req: Request,
        @Query('timeRange') timeRange: string = 'short_term',
    ) {
        const user = req.user as User;
        return this.statsService.getTopGenres(user.accessToken, timeRange);
    }
}
