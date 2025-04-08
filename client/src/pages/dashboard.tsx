import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Bar, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  LineElement,
  PointElement
} from 'chart.js';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { SpotifyData } from "@/types/spotify";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  LineElement,
  PointElement
);

export default function Dashboard() {
  const { toast } = useToast();

  const { data: musicData, isLoading, error } = useQuery<SpotifyData>({
    queryKey: ['/api/songs'],
  });

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load music data. Please try again later.",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-8 w-64 bg-gray-800 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-[400px] w-full bg-gray-800" />
            <Skeleton className="h-[400px] w-full bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!musicData) return null;

  const topSongsData = {
    labels: musicData.topSongs.slice(0, 10).map(song => song.trackName),
    datasets: [{
      label: 'Popularity',
      data: musicData.topSongs.slice(0, 10).map(song => song.popularity),
      backgroundColor: ['#1DB954', '#9B4BFF'],
      borderRadius: 8,
    }]
  };

  const audioFeaturesData = {
    labels: ['Danceability', 'Energy', 'Acousticness', 'Instrumentalness', 'Liveness', 'Speechiness', 'Valence'],
    datasets: [{
      label: 'Audio Features',
      data: Object.values(musicData.audioFeatures),
      backgroundColor: 'rgba(155, 75, 255, 0.5)',
      borderColor: '#9B4BFF',
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#fff'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#fff'
        }
      }
    }
  };

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
        display: false
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white p-6"
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Music Insights</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 bg-gray-900 border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Top Songs by Popularity</h2>
            <Bar data={topSongsData} options={chartOptions} />
          </Card>

          <Card className="p-6 bg-gray-900 border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Audio Features Analysis</h2>
            <Radar data={audioFeaturesData} options={radarOptions} />
          </Card>
        </div>

        <div className="mt-8">
          <Card className="p-6 bg-gray-900 border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Song Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {musicData.topSongs.map((song, index) => (
                <div key={index} className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-400">{song.trackName}</h3>
                  <p className="text-gray-400">{song.artists}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Released: </span>
                      {new Date(song.releasedDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="text-gray-400">BPM: </span>
                      {song.bpm}
                    </div>
                    <div>
                      <span className="text-gray-400">Key: </span>
                      {song.key}
                    </div>
                    <div>
                      <span className="text-gray-400">Mode: </span>
                      {song.mode}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline" className="text-white border-white hover:bg-gray-800">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}