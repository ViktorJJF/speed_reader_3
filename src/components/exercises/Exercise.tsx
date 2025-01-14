import React, { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../../store';
import styled from 'styled-components';

const WordContainer = styled.div<{ $wordCount?: number }>`
  display: flex;
  justify-content: center;
  gap: ${(props) => (props.$wordCount === 3 ? '100px' : '200px')};
  font-size: 32px;
  font-weight: bold;
  margin: 20px 0;
`;

const ResultBox = styled.div`
  border: 1px solid black;
  padding: 15px 40px;
  text-align: center;
  min-width: 300px;
  background: white;
`;

const AverageTime = styled.div`
  color: #1890ff;
  font-size: 32px;
  margin: 8px 0;
`;

const ResultMessage = styled.div`
  font-size: 16px;
  margin-top: 4px;
`;

const FeedbackBox = styled.div<{ isError?: boolean }>`
  border: 1px solid black;
  padding: 4px 8px;
  color: ${(props) => (props.isError ? 'red' : 'green')};
  font-size: 16px;
  text-align: center;
  background: white;
`;

interface Response {
  correct: boolean;
  time: number;
}

interface EPM1Pair {
  article: string;
  noun: string;
  correct: boolean;
}

interface EPM2Pair {
  noun: string;
  adjective: string;
  correct: boolean;
}

interface EPM3Pair {
  article: string;
  noun: string;
  adjective: string;
  correct: boolean;
}

const WORD_PAIRS_EPM1: EPM1Pair[] = [
  { article: 'el', noun: 'perro', correct: true },
  { article: 'la', noun: 'gato', correct: false },
  { article: 'el', noun: 'libro', correct: true },
  { article: 'la', noun: 'mesa', correct: true },
  { article: 'el', noun: 'casa', correct: false },
  { article: 'la', noun: 'flor', correct: true },
  { article: 'el', noun: 'sol', correct: true },
  { article: 'la', noun: 'árbol', correct: false },
  { article: 'el', noun: 'luna', correct: false },
  { article: 'la', noun: 'playa', correct: true },
];

const WORD_PAIRS_EPM2: EPM2Pair[] = [
  { noun: 'perro', adjective: 'grande', correct: true },
  { noun: 'casa', adjective: 'alto', correct: false },
  { noun: 'flor', adjective: 'roja', correct: true },
  { noun: 'libro', adjective: 'vieja', correct: false },
  { noun: 'mesa', adjective: 'redonda', correct: true },
  { noun: 'gato', adjective: 'negra', correct: false },
  { noun: 'sol', adjective: 'brillante', correct: true },
  { noun: 'árbol', adjective: 'verde', correct: true },
  { noun: 'luna', adjective: 'lleno', correct: false },
  { noun: 'playa', adjective: 'arenosa', correct: true },
];

const WORD_PAIRS_EPM3: EPM3Pair[] = [
  { article: 'el', noun: 'perro', adjective: 'grande', correct: true },
  { article: 'la', noun: 'casa', adjective: 'alto', correct: false },
  { article: 'el', noun: 'libro', adjective: 'vieja', correct: false },
  { article: 'la', noun: 'mesa', adjective: 'redonda', correct: true },
  { article: 'el', noun: 'gato', adjective: 'negra', correct: false },
  { article: 'la', noun: 'flor', adjective: 'roja', correct: true },
  { article: 'el', noun: 'árbol', adjective: 'verde', correct: true },
  { article: 'la', noun: 'luna', adjective: 'lleno', correct: false },
  { article: 'el', noun: 'sol', adjective: 'brillante', correct: true },
  { article: 'la', noun: 'playa', adjective: 'arenosa', correct: true },
];

interface ExerciseProps {
  onComplete: () => void;
}

type WordPair = EPM1Pair | EPM2Pair | EPM3Pair;

const Exercise: React.FC<ExerciseProps> = ({ onComplete }) => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const { isRunning, startExercise, stopExercise } = useStore();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showWords, setShowWords] = React.useState(false);
  const [responses, setResponses] = React.useState<Response[]>([]);
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [showingFeedback, setShowingFeedback] = React.useState(false);
  const [lastResponse, setLastResponse] = React.useState<Response | null>(null);

  const getWordPairs = () => {
    switch (exerciseId) {
      case 'epm1':
        return WORD_PAIRS_EPM1;
      case 'epm2':
        return WORD_PAIRS_EPM2;
      case 'epm3':
        return WORD_PAIRS_EPM3;
      default:
        return WORD_PAIRS_EPM1;
    }
  };

  const moveToNextWord = useCallback(() => {
    if (currentIndex < getWordPairs().length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowWords(true);
      setStartTime(Date.now());
      setLastResponse(null);
      setShowingFeedback(false);

      // Hide words after 0.7 seconds
      setTimeout(() => {
        setShowWords(false);
      }, 700);
    } else {
      // Exercise completed
      const averageTime = Math.floor(responses.reduce((acc, curr) => acc + curr.time, 0) / responses.length);
      setShowingFeedback(true);
      stopExercise();
      onComplete();
    }
  }, [currentIndex, responses, stopExercise, onComplete]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!isRunning || !exerciseId?.startsWith('epm') || showingFeedback || lastResponse !== null) return;

      const currentPair = getWordPairs()[currentIndex];
      const isCorrectKey = event.key === 'z';
      const isIncorrectKey = event.key === 'x';

      if (isCorrectKey || isIncorrectKey) {
        const endTime = Date.now();
        const responseTime = startTime ? endTime - startTime : 0;
        const isCorrect = (isCorrectKey && currentPair.correct) || (isIncorrectKey && !currentPair.correct);

        const response: Response = {
          correct: isCorrect,
          time: responseTime,
        };

        setLastResponse(response);
        setResponses((prev) => [...prev, response]);
        setShowingFeedback(true);

        // Show feedback for 2 seconds before moving to next word
        setTimeout(() => {
          moveToNextWord();
        }, 2000);
      }
    },
    [isRunning, exerciseId, currentIndex, startTime, showingFeedback, lastResponse, moveToNextWord],
  );

  useEffect(() => {
    if (isRunning) {
      setCurrentIndex(0);
      setResponses([]);
      setShowWords(true);
      setStartTime(Date.now());
      setLastResponse(null);
      setShowingFeedback(false);

      // Hide words after 0.7 seconds
      setTimeout(() => {
        setShowWords(false);
      }, 700);
    }
  }, [isRunning]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const getPerformanceMessage = (averageTime: number) => {
    if (averageTime < 800) return 'Velocidad supersónica';
    if (averageTime < 1200) return 'Velocidad de la luz';
    if (averageTime < 1500) return 'Muy rápido';
    if (averageTime < 2000) return 'Tranquilón';
    if (averageTime < 2500) return 'Tortuga coja';
    return 'Necesitas más práctica';
  };

  if (!isRunning && responses.length === 0) {
    return null;
  }

  const currentPair = getWordPairs()[currentIndex] as WordPair;

  if (responses.length === getWordPairs().length) {
    const averageTime = Math.floor(responses.reduce((acc, curr) => acc + curr.time, 0) / responses.length);
    return (
      <ResultBox>
        <div>Tiempo medio de respuesta:</div>
        <AverageTime>{averageTime} ms</AverageTime>
        <ResultMessage>{getPerformanceMessage(averageTime)}</ResultMessage>
      </ResultBox>
    );
  }

  const isEPM1Pair = (pair: EPM1Pair | EPM2Pair | EPM3Pair): pair is EPM1Pair => {
    return 'article' in pair && !('adjective' in pair);
  };

  const isEPM2Pair = (pair: EPM1Pair | EPM2Pair | EPM3Pair): pair is EPM2Pair => {
    return !('article' in pair) && 'adjective' in pair;
  };

  return (
    <div>
      {showWords && (
        <WordContainer $wordCount={isEPM1Pair(currentPair) ? 2 : isEPM2Pair(currentPair) ? 2 : 3}>
          {isEPM1Pair(currentPair) ? (
            <>
              <span>{currentPair.article}</span>
              <span>{currentPair.noun}</span>
            </>
          ) : isEPM2Pair(currentPair) ? (
            <>
              <span>{currentPair.noun}</span>
              <span>{currentPair.adjective}</span>
            </>
          ) : (
            <>
              <span>{(currentPair as EPM3Pair).article}</span>
              <span>{(currentPair as EPM3Pair).noun}</span>
              <span>{(currentPair as EPM3Pair).adjective}</span>
            </>
          )}
        </WordContainer>
      )}
      {showingFeedback && lastResponse && (
        <FeedbackBox isError={!lastResponse.correct}>
          {lastResponse.correct
            ? `¡Correcto! - T: ${lastResponse.time} ms`
            : 'Has fallado. +2 segundos de penalización'}
        </FeedbackBox>
      )}
    </div>
  );
};

export default Exercise;
