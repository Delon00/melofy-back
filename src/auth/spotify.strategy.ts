import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-spotify';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class SpotifyStrategy extends PassportStrategy(Strategy, 'spotify') {
  constructor(private prisma: PrismaService) {
    const options: StrategyOptions = {
      clientID: process.env.SPOTIFY_CLIENT_ID || '',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
      callbackURL: process.env.SPOTIFY_CALLBACK_URL || 'https://melofy-back-production.up.railway.app/auth/spotify/callback',
      scope: ['user-read-email', 'user-read-private', 'user-top-read'],
    };

    if (!options.clientID || !options.clientSecret) {
      throw new Error('SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be defined');
    }

    super(options);
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    const spotifyId = profile.id;
    const email = profile.emails?.[0]?.value ?? null;
    const displayName = profile.displayName;
    const photoUrl = profile.photos?.[0]?.value ?? null;
  
    try {
      let user = await this.prisma.user.findUnique({
        where: { spotifyId },
      });
  
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            spotifyId,
            email,
            displayName,
            photo: photoUrl,
            accessToken,
            refreshToken,
          },
        });
      } else {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            accessToken,
            refreshToken,
            photo: photoUrl, 
          },
        });
      }
  
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }  
  
}
