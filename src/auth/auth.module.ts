import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { SpotifyStrategy } from './spotify.strategy'; // Assure-toi de l'importer ici
import { PrismaModule } from 'prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { StatsModule } from 'src/stats/stats.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    PrismaModule,
    ConfigModule.forRoot(),
    StatsModule,
  ],
  providers: [AuthService, JwtStrategy, SpotifyStrategy],
  exports: [AuthService],
})

export class AuthModule {}
