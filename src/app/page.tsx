// pages/index.tsx
"use client";

import { ReactNode, useEffect, useRef, useState } from 'react';
import { AiOutlineLeft, AiOutlinePause, AiOutlinePlayCircle, AiOutlineRight, AiOutlineUndo } from 'react-icons/ai';
import { getQuestions } from "@/app/questions";
import clsx from "clsx";
import LoadingSpinner from "@/app/spinner";

export default function Home() {
  const maxTime = 10;
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(maxTime);
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

  const handlePlay = () => {
    setIsPaused(false);
    startTimer();
  }

  const handlePause = () => {
    setIsPaused(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimer(maxTime);
    startTimer();
  };

  const updateIndex = (index: number) => {
    setCurrentIndex(index);
    handleReset();
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        handleReset();
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        handleReset();
      }
      if (e.key === 'ArrowUp') {
        handleReset();
      }
      if (e.key === 'ArrowDown') {
        if (isPaused) handlePlay();
        else handlePause();
      }
      if (e.key === ' ') {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentIndex, isPaused]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 sm:p-24 gap-10">
      <h1 className="text-xl font-thin text-center">
        Pitch me.
      </h1>
      <div className="flex-1 grid place-items-center">
        <p className="text-2xl font-semibold text-center">{questions[currentIndex]}</p>
      </div>
      <div className="flex flex-col items-center justify-center relative">
        {
          timer > 0 ? (
            <>
              <div className="top-0 right-0 h-20 w-20">
                <LoadingSpinner timer={maxTime - timer} totalDuration={maxTime} />
              </div>
              {
                isPaused ? <AiOutlinePause size={25} className="absolute" /> :
                  <div className="absolute font-bold">{timer.toFixed(1)}</div>
              }
            </>
          ) : (
            <span className="border-red-500 border text-white text-2xl p-3 rounded-full px-5 bg-red-500/20">
              Goodbye seed round 😢
            </span>
          )
        }
      </div>
      <div className=" font-thin text-sm">
        <p>Press <span className="font-semibold">Right Arrow</span> for next question.</p>
        <p>Press <span className="font-semibold">Left Arrow</span> for previous question.</p>
        <p>Press <span className="font-semibold">Up Arrow</span> to restart timer.</p>
        <p>Press <span className="font-semibold">Down Arrow</span> to pause/resume timer.</p>
      </div>
      <div className="flex flex-col items-center">
        <Button onClick={handleReset}><AiOutlineUndo /></Button>
        <div>
          <Button onClick={() => updateIndex(currentIndex - 1)}><AiOutlineLeft /></Button>
          <Button onClick={() => (isPaused ? handlePlay() : handlePause())}>
            {
              isPaused ? <AiOutlinePlayCircle /> : <AiOutlinePause />
            }
          </Button>
          <Button onClick={() => updateIndex(currentIndex + 1)}><AiOutlineRight /></Button>
        </div>
      </div>
    </main>
  )
}

type ButtonProps = {
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}
const Button = ({ className, onClick, children }: ButtonProps) => {
  return (
    <button
      className={clsx("p-4 rounded text-white border border-white/30 m-1 hover:bg-white/10 transition-colors duration-300", className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};