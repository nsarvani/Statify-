import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import csv from "csv-parser";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static JSON data
  app.get("/data/spotify_data.json", (req, res) => {
    res.sendFile(path.resolve("client/public/data/spotify_data.json"));
  });

  // Parse CSV and convert to JSON endpoint
  app.get("/api/songs", (req, res) => {
    const results: any[] = [];
    fs.createReadStream(path.resolve("attached_assets/songs.csv"))
      .pipe(csv())
      .on("data", (data) => {
        // Clean up and transform the data
        const song = {
          id: parseInt(data.track_id),
          trackName: data.track_name,
          artists: data.track_artist,
          releasedDate: data.track_album_release_date,
          streams: parseInt(data.track_popularity) || 0,
          bpm: parseFloat(data.tempo) || 0,
          key: data.key || "Unknown",
          mode: data.mode === "1" ? "Major" : "Minor",
          danceability: parseFloat(data.danceability) || 0,
          valence: parseFloat(data.valence) || 0,
          energy: parseFloat(data.energy) || 0,
          acousticness: parseFloat(data.acousticness) || 0,
          instrumentalness: parseFloat(data.instrumentalness) || 0,
          liveness: parseFloat(data.liveness) || 0,
          speechiness: parseFloat(data.speechiness) || 0,
          popularity: parseInt(data.track_popularity) || 0,
          genre: data.playlist_genre || "Unknown"
        };
        results.push(song);
      })
      .on("end", () => {
        // Calculate audio features averages
        const audioFeatures = {
          danceability: average(results.map(s => s.danceability)),
          energy: average(results.map(s => s.energy)),
          acousticness: average(results.map(s => s.acousticness)),
          instrumentalness: average(results.map(s => s.instrumentalness)),
          liveness: average(results.map(s => s.liveness)),
          speechiness: average(results.map(s => s.speechiness)),
          valence: average(results.map(s => s.valence))
        };

        // Get top artists
        const artistStats = calculateArtistStats(results);

        // Get genre distribution
        const genres = calculateGenreDistribution(results);

        res.json({
          topSongs: results,
          audioFeatures,
          topArtists: artistStats,
          popularGenres: genres
        });
      });
  });

  const httpServer = createServer(app);
  return httpServer;
}

function average(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function calculateArtistStats(songs: any[]) {
  const artistMap = new Map();

  songs.forEach(song => {
    const artist = song.artists;
    if (!artistMap.has(artist)) {
      artistMap.set(artist, {
        name: artist,
        topTrack: song.trackName,
        totalStreams: song.streams,
        songs: [song],
        genres: new Set([song.genre])
      });
    } else {
      const stats = artistMap.get(artist);
      stats.songs.push(song);
      stats.genres.add(song.genre);
      if (song.streams > stats.totalStreams) {
        stats.totalStreams = song.streams;
        stats.topTrack = song.trackName;
      }
    }
  });

  return Array.from(artistMap.values()).map(artist => ({
    name: artist.name,
    topTrack: artist.topTrack,
    totalStreams: artist.totalStreams,
    genres: Array.from(artist.genres),
    avgDanceability: average(artist.songs.map((s: any) => s.danceability)),
    avgEnergy: average(artist.songs.map((s: any) => s.energy))
  }))
  .sort((a, b) => b.totalStreams - a.totalStreams)
  .slice(0, 20); // Get top 20 artists
}

function calculateGenreDistribution(songs: any[]) {
  const genreCounts = songs.reduce((acc: any, song: any) => {
    acc[song.genre] = (acc[song.genre] || 0) + 1;
    return acc;
  }, {});

  return Object.fromEntries(
    Object.entries(genreCounts)
      .sort(([,a]: any, [,b]: any) => b - a)
      .map(([genre, count]: any) => [
        genre,
        Math.round((count / songs.length) * 100)
      ])
  );
}