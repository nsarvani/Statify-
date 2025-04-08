import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Radar } from "react-chartjs-2";
import type { SpotifyData } from "@/types/spotify";

export default function Songs() {
  const { data: songData, isLoading } = useQuery<SpotifyData>({
    queryKey: ['/data/spotify_data.json'],
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Song Analysis</h1>
        <Skeleton className="h-[400px] w-full bg-gray-800" />
      </div>
    );
  }

  if (!songData?.topSongs) return null;

  const radarOptions = {
    responsive: true,
    scales: {
      r: {
        pointLabels: {
          color: '#fff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff',
          backdropColor: 'transparent'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#fff'
        }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <h1 className="text-3xl font-bold mb-8">Song Analysis</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {songData.topSongs.map((song, index) => {
          const audioFeatures = {
            labels: [
              'Danceability',
              'Energy',
              'Acousticness',
              'Instrumentalness',
              'Liveness',
              'Speechiness',
              'Valence'
            ],
            datasets: [{
              label: song.trackName,
              data: [
                song.danceability,
                song.energy,
                song.acousticness,
                song.instrumentalness,
                song.liveness,
                song.speechiness,
                song.valence
              ],
              backgroundColor: 'rgba(155, 75, 255, 0.2)',
              borderColor: '#9B4BFF',
              borderWidth: 2,
            }]
          };

          return (
            <Card 
              key={index}
              className="p-6 bg-gray-900 border-gray-800"
            >
              <h2 className="text-xl font-semibold mb-4 text-green-400">
                {song.trackName}
              </h2>
              <p className="text-gray-400 mb-6">{song.artists}</p>

              <div className="mb-6">
                <Radar data={audioFeatures} options={radarOptions} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Key</p>
                  <p className="text-white font-medium">{song.key}</p>
                </div>
                <div>
                  <p className="text-gray-400">Mode</p>
                  <p className="text-white font-medium">{song.mode}</p>
                </div>
                <div>
                  <p className="text-gray-400">BPM</p>
                  <p className="text-white font-medium">{song.bpm}</p>
                </div>
                <div>
                  <p className="text-gray-400">Release Date</p>
                  <p className="text-white font-medium">
                    {new Date(song.releasedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}