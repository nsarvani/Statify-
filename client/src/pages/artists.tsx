import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SpotifyData } from "@/types/spotify";

export default function Artists() {
  const { data: artistData, isLoading } = useQuery<SpotifyData>({
    queryKey: ['/data/spotify_data.json'],
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Top Artists</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[200px] bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  if (!artistData?.topArtists) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <h1 className="text-3xl font-bold mb-8">Top Artists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {artistData.topArtists.map((artist, index) => (
          <Card 
            key={index}
            className="p-6 bg-gradient-to-br from-purple-900/50 to-green-900/30 hover:from-purple-800/50 hover:to-green-800/30 transition-all duration-300"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center overflow-hidden">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=1DB954&color=191414&size=64&bold=true`} 
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold">{artist.name}</h3>
                  <p className="text-gray-400">{artist.genres.join(", ")}</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm text-gray-400 mb-2">Top Track</h4>
                <p className="text-lg font-medium text-green-400">{artist.topTrack}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-400">Total Streams</p>
                  <p className="text-xl font-bold text-purple-400">
                    {(artist.totalStreams / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Avg. Energy</p>
                  <p className="text-xl font-bold text-green-400">
                    {(artist.avgEnergy * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-sm text-gray-400 mb-2">Danceability Score</p>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-green-500 rounded-full"
                    style={{ width: `${artist.avgDanceability * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}