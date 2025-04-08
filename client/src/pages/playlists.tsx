import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Music, Play } from "lucide-react";
import type { SpotifyData } from "@/types/spotify";

export default function Playlists() {
  const { data: musicData, isLoading } = useQuery<SpotifyData>({
    queryKey: ['/api/songs'],
  });

  const savedPreferences = localStorage.getItem('musicPreferences');
  const preferences = savedPreferences ? JSON.parse(savedPreferences) : null;

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Your Custom Playlists</h1>
        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-[400px] w-full bg-gray-800" />
        </div>
      </div>
    );
  }

  if (!musicData?.topSongs || !preferences) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Your Custom Playlists</h1>
        <Card className="p-6 bg-gray-900 text-center">
          <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Playlists Yet</h2>
          <p className="text-gray-400 mb-4">
            Take the music preference quiz to get your personalized playlists!
          </p>
          <Button
            className="bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600"
            onClick={() => window.location.href = '/recommendations'}
          >
            Take Quiz
          </Button>
        </Card>
      </div>
    );
  }

  // Get recommended songs based on preferences with genre diversity
  const getRecommendedSongs = () => {
    const { tempo, soundType, mood, vocalPreference } = preferences;

    // First, filter songs based on preferences
    const matchedSongs = musicData.topSongs.filter(song => {
      let score = 0;

      // Match tempo preference
      if (
        (tempo === "slow" && song.bpm < 100) ||
        (tempo === "medium" && song.bpm >= 100 && song.bpm <= 120) ||
        (tempo === "fast" && song.bpm > 120)
      ) {
        score += 2;
      }

      // Match sound characteristics
      if (
        (soundType === "acoustic" && song.acousticness > 0.5) ||
        (soundType === "electronic" && song.acousticness < 0.3) ||
        soundType === "mixed"
      ) {
        score += 2;
      }

      // Match mood
      if (
        (mood === "happy" && song.valence > 0.6) ||
        (mood === "melancholic" && song.valence < 0.4) ||
        (mood === "energetic" && song.energy > 0.7)
      ) {
        score += 2;
      }

      // Match vocal preference
      if (
        (vocalPreference === "vocal" && song.instrumentalness < 0.2) ||
        (vocalPreference === "instrumental" && song.instrumentalness > 0.5) ||
        vocalPreference === "balanced"
      ) {
        score += 2;
      }

      return score >= 4;
    });

    // Group songs by genre
    const songsByGenre = matchedSongs.reduce((acc, song) => {
      if (!acc[song.genre]) {
        acc[song.genre] = [];
      }
      acc[song.genre].push(song);
      return acc;
    }, {} as Record<string, typeof matchedSongs>);

    // Get top songs from each genre to ensure diversity
    const recommendedSongs: typeof matchedSongs = [];
    const genres = Object.keys(songsByGenre);
    const songsPerGenre = Math.ceil(20 / genres.length);

    genres.forEach(genre => {
      const genreSongs = songsByGenre[genre]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, songsPerGenre);
      recommendedSongs.push(...genreSongs);
    });

    return recommendedSongs
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 20);
  };

  const recommendedSongs = getRecommendedSongs();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <h1 className="text-3xl font-bold mb-8">Your Custom Playlists</h1>

      <div className="mb-8">
        <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-green-900/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Your Perfect Mix</h2>
              <p className="text-gray-400">
                Based on your preferences for {preferences.tempo} tempo, 
                {preferences.soundType} sound, {preferences.mood} mood, 
                and {preferences.vocalPreference} focus.
              </p>
            </div>
            <Play className="w-8 h-8 text-green-400" />
          </div>

          <div className="space-y-4">
            {recommendedSongs.map((song, index) => (
              <div
                key={index}
                className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-400 mb-1">
                      {song.trackName}
                    </h3>
                    <p className="text-gray-400 text-sm">{song.artists}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 text-xs rounded bg-purple-900/50 text-purple-300">
                      {song.genre}
                    </span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">BPM</p>
                    <p className="text-purple-400">{song.bpm}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Key</p>
                    <p className="text-purple-400">{song.key}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Energy</p>
                    <p className="text-green-400">{(song.energy * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Mood</p>
                    <p className="text-green-400">{(song.valence * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="text-center">
        <Button
          onClick={() => window.location.href = '/recommendations'}
          className="bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600"
        >
          Retake Quiz
        </Button>
      </div>
    </motion.div>
  );
}