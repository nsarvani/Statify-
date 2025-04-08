import { z } from "zod";

export interface Song {
  id: number;
  trackName: string;
  artists: string;
  releasedDate: string;
  streams: number;
  bpm: number;
  key: string;
  mode: string;
  danceability: number;
  valence: number;
  energy: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
}

export interface Artist {
  name: string;
  topTrack: string;
  totalStreams: number;
  genres: string[];
  avgDanceability: number;
  avgEnergy: number;
}

export interface AudioFeatures {
  danceability: number;
  energy: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
  valence: number;
}

export interface SpotifyData {
  topSongs: Song[];
  audioFeatures: AudioFeatures;
  topArtists: Artist[];
  popularGenres: Record<string, number>;
}
