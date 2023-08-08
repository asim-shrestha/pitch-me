"use client";

import { ReactNode, useEffect, useRef, useState } from 'react';
import { AiOutlineLeft, AiOutlinePause, AiOutlinePlayCircle, AiOutlineRight, AiOutlineUndo } from 'react-icons/ai';
import { getQuestions } from "@/app/questions";
import clsx from "clsx";
import LoadingSpinner from "@/app/spinner";

const MAX_TIME = 10;

export default function Home() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [timer, setTimer] = useState(MAX_TIME);

  const pausedTimeRef = useRef<number>(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Fetch questions and start the timer
    setQuestions(getQuestions());
    startTimer();
  }, []);

  const startTimer = (forceStart: boolean = false) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!forceStart && isPaused) return;

    // Adjusting the startTimeRef when resuming
    if (pausedTimeRef.current > 0 && startTimeRef.current) {
      startTimeRef.current = Date.now() - pausedTimeRef.current * 1000;
      pausedTimeRef.current = 0;
    } else {
      startTimeRef.current = Date.now();
    }

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - (startTimeRef.current || Date.now())) / 1000;
      const newTime = MAX_TIME - elapsed;
      if (newTime <= 0) {
        clearInterval(intervalRef.current || undefined);
        setTimer(0);
      } else {
        setTimer(newTime);
      }
    }, 10);
  };

  const handleResume = () => {
    setIsPaused(false);
    startTimer(true);
  }

  const handlePause = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      startTimeRef.current = null;
    }
  };

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      startTimeRef.current = null;
    }
    setTimer(MAX_TIME);
    startTimer();
  };

  const updateIndex = (index: number) => {
    setCurrentQuestionIndex(index);
    handleReset();
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentQuestionIndex < questions.length - 1) {
        console.log('right');
        setCurrentQuestionIndex(prev => prev + 1);
        handleReset();
      }
      if (e.key === 'ArrowLeft' && currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
        handleReset();
      }
      if (e.key === 'ArrowUp') {
        handleReset();
      }
      if (e.key === 'ArrowDown') {
        if (isPaused) handleResume();
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
  }, [questions, currentQuestionIndex, isPaused]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 sm:p-24 gap-10">
      <h1 className="text-xl font-thin text-center">
        Pitch me.
      </h1>
      <div className="flex-1 grid place-items-center">
        <p className="text-2xl font-semibold text-center">{questions[currentQuestionIndex]}</p>
      </div>
      <div className="flex flex-col items-center justify-center relative">
        {
          timer > 0 ? (
            <>
              <div className="top-0 right-0 h-20 w-20">
                <LoadingSpinner timer={MAX_TIME - timer} totalDuration={MAX_TIME} />
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
          <Button onClick={() => updateIndex(currentQuestionIndex - 1)}><AiOutlineLeft /></Button>
          <Button onClick={() => (isPaused ? handleResume() : handlePause())}>
            {
              isPaused ? <AiOutlinePlayCircle /> : <AiOutlinePause />
            }
          </Button>
          <Button onClick={() => updateIndex(currentQuestionIndex + 1)}><AiOutlineRight /></Button>
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