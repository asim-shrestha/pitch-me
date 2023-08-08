"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
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
  const timeOffsetRef = useRef<number>(0);


  useEffect(() => {
    setQuestions(getQuestions());
    startTimer(true);
  }, []);

  const startTimer = useCallback((forceStart: boolean = false) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!forceStart && isPaused) return;

    startTimeRef.current = Date.now() - pausedTimeRef.current;

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - (startTimeRef.current || Date.now()));
      const newTime = MAX_TIME - elapsed / 1000;
      if (newTime <= 0) {
        clearInterval(intervalRef.current || undefined);
        setTimer(0);
      } else {
        setTimer(newTime);
      }
    }, 100);
  }, [isPaused]);


  const handleResume = useCallback(() => {
    setIsPaused(false);
    startTimer(true);
  }, [startTimer]);


  const handlePause = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      pausedTimeRef.current = Date.now() - (startTimeRef.current || Date.now());
    }
  };


  const handleReset = useCallback(() => {
    setIsPaused(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    pausedTimeRef.current = 0;
    startTimeRef.current = null;
    setTimer(MAX_TIME);
    startTimer(true);
  }, [startTimer]);


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
  }, [handleReset, handleResume, questions, currentQuestionIndex, isPaused]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 sm:p-24 gap-10">
      <h1 className="text-xl font-thin text-center">
        Pitch me.
      </h1>
      <div className="flex-1 grid place-items-center">
        <p className="text-xl font-semibold text-center">{questions[currentQuestionIndex]}</p>
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
            <span className="border-red-500 border text-white text-lg md:text-xl p-3 rounded-full px-5 bg-red-500/20">
              Goodbye seed round 😢
            </span>
          )
        }
      </div>
      <div className="hidden lg:block font-thin text-sm">
        <p>Press <Highlight>Right Arrow</Highlight> for next question.</p>
        <p>Press <Highlight>Left Arrow</Highlight> for previous question.</p>
        <p>Press <Highlight>Up Arrow</Highlight> or <Highlight>Space</Highlight> to restart the timer.</p>
        <p>Press <Highlight>Down Arrow</Highlight> to pause/resume the timer.</p>
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
      <div className="text-xs">
        By <a href="https://asim-shrestha.com/" target="_blank" rel="noopener noreferrer"
              className="text-blue-500 hover:underline">Asim Shrestha</a>
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

const Highlight = ({ children }: { children: ReactNode }) => {
  return <span className="bg-neutral-300 text-black font-medium rounded px-1">{children}</span>;
}