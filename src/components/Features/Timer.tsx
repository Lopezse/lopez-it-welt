"use client";
import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";

interface TimerProps {
  sessionId?: number;
  onSessionComplete?: (duration: number) => void;
  onStop?: () => void;
  autoStart?: boolean;
}

export default function Timer({ sessionId, onSessionComplete, onStop, autoStart = false }: TimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedSeconds, setPausedSeconds] = useState(0);

  useEffect(() => {
    if (autoStart && sessionId) {
      startTimer();
    }
  }, [autoStart, sessionId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
    // console.log('⏱️ Timer gestartet');
  };

  const pauseTimer = () => {
    if (isRunning) {
      setIsPaused(true);
      setPausedSeconds(seconds);
      // console.log('⏸️ Timer pausiert');
    }
  };

  const resumeTimer = () => {
    if (isPaused) {
      setIsPaused(false);
      // console.log('▶️ Timer fortgesetzt');
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    const totalSeconds = seconds;
    setSeconds(0);
    setPausedSeconds(0);

    // Zuerst onStop aufrufen (um Session zu beenden)
    if (onStop) {
      onStop();
    }

    // Dann onSessionComplete mit Dauer aufrufen
    if (onSessionComplete) {
      onSessionComplete(Math.round(totalSeconds / 60)); // Minuten
    }

    // console.log('⏹️ Timer gestoppt - Dauer:', formatTime(totalSeconds));
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getDisplayTime = () => {
    return formatTime(isPaused ? pausedSeconds : seconds);
  };

  return (
    <Card className="p-6">
      <div className="text-center">
        <div className="text-4xl font-mono font-bold text-gray-900 mb-4">{getDisplayTime()}</div>

        <div className="flex justify-center space-x-3">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              ▶️ Start
            </button>
          ) : isPaused ? (
            <button
              onClick={resumeTimer}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ▶️ Fortsetzen
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              ⏸️ Pause
            </button>
          )}

          {isRunning && (
            <button
              onClick={stopTimer}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              ⏹️ Stop
            </button>
          )}
        </div>

        {isPaused && (
          <div className="mt-3 text-sm text-gray-600">
            ⏸️ Pausiert bei {formatTime(pausedSeconds)}
          </div>
        )}

        {isRunning && !isPaused && <div className="mt-3 text-sm text-green-600">⏱️ Läuft...</div>}
      </div>
    </Card>
  );
}
