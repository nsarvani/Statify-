import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { SpotifyData } from "@/types/spotify";

const questions = [
  {
    id: 1,
    question: "What's your preferred music tempo?",
    options: [
      { value: "slow", label: "Slow and Relaxing" },
      { value: "medium", label: "Moderate and Balanced" },
      { value: "fast", label: "Fast and Energetic" }
    ]
  },
  {
    id: 2,
    question: "Which sound characteristics do you prefer?",
    options: [
      { value: "acoustic", label: "Acoustic and Natural" },
      { value: "electronic", label: "Electronic and Synthetic" },
      { value: "mixed", label: "Mix of Both" }
    ]
  },
  {
    id: 3,
    question: "What mood do you usually seek in music?",
    options: [
      { value: "happy", label: "Upbeat and Happy" },
      { value: "melancholic", label: "Emotional and Deep" },
      { value: "energetic", label: "Energetic and Powerful" }
    ]
  },
  {
    id: 4,
    question: "Do you prefer vocals or instrumental music?",
    options: [
      { value: "vocal", label: "Strong Vocal Presence" },
      { value: "instrumental", label: "Mostly Instrumental" },
      { value: "balanced", label: "Balance of Both" }
    ]
  }
];

export default function ForYou() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const { data: musicData } = useQuery<SpotifyData>({
    queryKey: ['/api/songs'],
  });

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }));
  };

  const handleNext = () => {
    if (!answers[questions[currentQuestion].id]) {
      toast({
        variant: "destructive",
        title: "Please select an answer",
        description: "Choose an option before proceeding.",
      });
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Save preferences to localStorage
      const preferences = {
        tempo: answers[1],
        soundType: answers[2],
        mood: answers[3],
        vocalPreference: answers[4]
      };
      localStorage.setItem('musicPreferences', JSON.stringify(preferences));
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const getRecommendations = () => {
    if (!musicData?.topSongs) return { songs: [] };

    // Enhanced song matching based on quiz answers
    const recommendedSongs = musicData.topSongs.filter(song => {
      let score = 0;

      // Match tempo preference
      if (
        (answers[1] === "slow" && song.bpm < 100) ||
        (answers[1] === "medium" && song.bpm >= 100 && song.bpm <= 120) ||
        (answers[1] === "fast" && song.bpm > 120)
      ) {
        score += 2;
      }

      // Match sound characteristics
      if (
        (answers[2] === "acoustic" && song.acousticness > 0.5) ||
        (answers[2] === "electronic" && song.acousticness < 0.3) ||
        answers[2] === "mixed"
      ) {
        score += 2;
      }

      // Match mood
      if (
        (answers[3] === "happy" && song.valence > 0.6) ||
        (answers[3] === "melancholic" && song.valence < 0.4) ||
        (answers[3] === "energetic" && song.energy > 0.7)
      ) {
        score += 2;
      }

      // Match vocal preference
      if (
        (answers[4] === "vocal" && song.instrumentalness < 0.2) ||
        (answers[4] === "instrumental" && song.instrumentalness > 0.5) ||
        answers[4] === "balanced"
      ) {
        score += 2;
      }

      return score >= 6; // Higher threshold for better matches
    })
    .sort((a, b) => b.popularity - a.popularity) // Sort by popularity
    .slice(0, 50); // Get top 50 matches

    return { songs: recommendedSongs };
  };

  const { songs } = showResults ? getRecommendations() : { songs: [] };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <h1 className="text-3xl font-bold mb-8">Personalized For You</h1>

      {!showResults ? (
        <Card className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-purple-900/50 to-green-900/30">
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{((currentQuestion + 1) / questions.length * 100).toFixed(0)}% Complete</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-green-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-6">
            {questions[currentQuestion].question}
          </h2>

          <RadioGroup
            value={answers[questions[currentQuestion].id]}
            onValueChange={handleAnswer}
            className="space-y-4"
          >
            {questions[currentQuestion].options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="border-purple-500 text-purple-500"
                />
                <Label htmlFor={option.value} className="text-white">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="text-white border-white hover:bg-gray-800"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600"
            >
              {currentQuestion === questions.length - 1 ? "Get Recommendations" : "Next"}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-green-900/30">
            <h2 className="text-2xl font-semibold mb-6">
              Here's What We Found For You
            </h2>
            <p className="text-gray-400 mb-6">
              Based on your preferences, we've created a personalized playlist that matches your taste.
              Check out your custom playlist for a carefully curated selection of songs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {songs.slice(0, 4).map((song, index) => (
                <div key={index} className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-400">{song.trackName}</h3>
                  <p className="text-gray-400">{song.artists}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">BPM: </span>
                      {song.bpm}
                    </div>
                    <div>
                      <span className="text-gray-400">Key: </span>
                      {song.key}
                    </div>
                    <div>
                      <span className="text-gray-400">Energy: </span>
                      {(song.energy * 100).toFixed(0)}%
                    </div>
                    <div>
                      <span className="text-gray-400">Mood: </span>
                      {song.valence > 0.5 ? "Happy" : "Melancholic"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <Button
                onClick={() => window.location.href = '/playlists'}
                className="bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600"
              >
                View Full Playlist
              </Button>
              <Button
                onClick={() => {
                  setShowResults(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                }}
                variant="outline"
                className="text-white border-white hover:bg-gray-800"
              >
                Retake Quiz
              </Button>
            </div>
          </Card>
        </div>
      )}
    </motion.div>
  );
}