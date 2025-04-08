import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import StatifyLogo from "@/components/StatifyLogo";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            x: [-100, window.innerWidth - 250, -100],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          className="mb-8"
        >
          <StatifyLogo className="scale-[2]" />
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Your Music Statistics
        </h1>

        <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-md mx-auto">
          Discover insights about your favorite songs, artists, and music genres
        </p>

        <Link href="/dashboard">
          <Button
            className="bg-[#1DB954] hover:bg-[#1ed760] text-white px-8 py-6 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            View Stats
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}