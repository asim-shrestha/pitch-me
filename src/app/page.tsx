// pages/index.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import {
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineUp,
  AiOutlineDown,
  AiOutlineUndo,
  AiOutlinePause, AiOutlinePlayCircle
} from 'react-icons/ai';
import { getQuestions, QUESTIONS } from "@/app/questions";

export default function Home() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(20.000); // 20 seconds with milliseconds
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQuestions(getQuestions());
    startTimer();
  }, []);

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 0.01) {
          clearInterval(intervalRef.current || undefined);
          return 0;
        }
        return prev - 0.01;
      });
    }, 10);
  };

  const playTimer = () => {
    setIsPaused(false);
    startTimer();
  }

  const pauseTimer = () => {
    setIsPaused(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimer(20.000);
    startTimer();
    console.log("Reset")
  };

  const updateIndex = (index: number) => {
    console.log(index);
    console.log(index);
    console.log(index);
    setCurrentIndex(index);
    resetTimer();
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        resetTimer();
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        resetTimer();
      }
      if (e.key === 'ArrowUp') {
        resetTimer();
      }
      if (e.key === 'ArrowDown') {
        if (isPaused) playTimer();
        else pauseTimer();
      }
      if (e.key === ' ') {
        resetTimer();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentIndex, isPaused]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 sm:p-24">
      <h1 className="text-4xl font-bold text-center">
        Pitch me
      </h1>
      <div className="flex-1 grid place-items-center">
        <p className="text-2xl font-semibold text-center">{questions[currentIndex]}</p>
      </div>
      <div className="mt-10 flex items-center">
        <p className="text-xl mr-4">Timer: {timer.toFixed(3)}s</p>
        {isPaused && <span className="bg-red-500 text-white px-2 py-1 rounded">Paused</span>}
      </div>
      <div className="mt-10 font-thin text-sm">
        <p>Press <span className="font-semibold">Right Arrow</span> for next question.</p>
        <p>Press <span className="font-semibold">Left Arrow</span> for previous question.</p>
        <p>Press <span className="font-semibold">Up Arrow</span> to restart timer.</p>
        <p>Press <span className="font-semibold">Down Arrow</span> to pause/resume timer.</p>
      </div>
      <div className="mt-10 flex space-x-4">
        <button className="bg-blue-500 hover:bg-blue-600 p-4 rounded text-white" onClick={() => updateIndex( currentIndex - 1)}><AiOutlineLeft /></button>
        <button className="bg-blue-500 hover:bg-blue-600 p-4 rounded text-white" onClick={() => updateIndex(currentIndex + 1)}><AiOutlineRight /></button>
        <button className="bg-green-500 hover:bg-green-600 p-4 rounded text-white" onClick={resetTimer}><AiOutlineUndo /></button>
        <button className="bg-yellow-500 hover:bg-yellow-600 p-4 rounded text-white" onClick={() => (isPaused ? playTimer() : pauseTimer())}>{
          isPaused ? <AiOutlinePlayCircle /> : <AiOutlinePause />
        }</button>
      </div>
    </main>
  )
}
