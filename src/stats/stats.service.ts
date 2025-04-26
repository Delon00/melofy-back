import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class StatsService {
    private getValidTimeRange(timeRange: string): string {
        const validTimeRanges = {
            '1m': 'short_term',  // 1 mois
            '6m': 'medium_term', // 6 mois
            '1y': 'long_term',   // 1 an
            'all': 'long_term',  // Depuis la création du compte
        };

        if (!validTimeRanges[timeRange]) {
            throw new HttpException('Période invalide', HttpStatus.BAD_REQUEST);
        }

        return validTimeRanges[timeRange];
    }

    // Récupère les top albums
    async getTopAlbums(accessToken: string, timeRange: string = 'medium_term') {
        try {
            const range = this.getValidTimeRange(timeRange);
            const response = await axios.get(`https://api.spotify.com/v1/me/top/albums?limit=50&time_range=${range}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const albums = response.data.items;

            return albums.map(album => ({
                name: album.name,
                artist: album.artists.map(artist => artist.name).join(', '),
                image: album.images?.[0]?.url ?? '',
            }));
        } catch (error) {
            console.error('Erreur Spotify :', error.response?.data || error.message);
            throw new HttpException('Impossible de récupérer les albums', HttpStatus.BAD_GATEWAY);
        }
    }

    // Récupère les top tracks
    async getTopTracks(accessToken: string, timeRange: string = 'medium_term') {
        try {
            const range = this.getValidTimeRange(timeRange);
            const response = await axios.get(`https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${range}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const tracks = response.data.items;

            return tracks.map(track => ({
                name: track.name,
                artist: track.artists.map(artist => artist.name).join(', '),
                album: track.album.name,
                image: track.album.images?.[0]?.url ?? '',
            }));
        } catch (error) {
            console.error('Erreur Spotify :', error.response?.data || error.message);
            throw new HttpException('Impossible de récupérer les titres', HttpStatus.BAD_GATEWAY);
        }
    }

    // Récupère les top artists
    async getTopArtists(accessToken: string, timeRange: string = 'medium_term') {
        try {
            const range = this.getValidTimeRange(timeRange);
            const response = await axios.get(`https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${range}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const artists = response.data.items;

            return artists.map(artist => ({
                name: artist.name,
                genres: artist.genres.join(', '),
                image: artist.images?.[0]?.url ?? '',
            }));
        } catch (error) {
            console.error('Erreur Spotify :', error.response?.data || error.message);
            throw new HttpException('Impossible de récupérer les artistes', HttpStatus.BAD_GATEWAY);
        }
    }

    // Récupère les top genres
    async getTopGenres(accessToken: string, timeRange: string = 'medium_term') {
        try {
            const range = this.getValidTimeRange(timeRange);
            const response = await axios.get(`https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${range}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const artists = response.data.items;

            const genresMap: Record<string, number> = {};

            artists.forEach(artist => {
                artist.genres.forEach(genre => {
                    if (genresMap[genre]) {
                        genresMap[genre]++;
                    } else {
                        genresMap[genre] = 1;
                    }
                });
            });

            const sortedGenres = Object.entries(genresMap)
                .map(([genre, count]) => ({ genre, count }))
                .sort((a, b) => b.count - a.count);

            return sortedGenres;
        } catch (error) {
            console.error('Erreur Spotify :', error.response?.data || error.message);
            throw new HttpException('Impossible de récupérer les genres', HttpStatus.BAD_GATEWAY);
        }
    }
}
