import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Select } from 'antd';
import styled from 'styled-components';
import { useStore } from '../store';

const PageHeader = styled.h1`
  margin: 20px;
  text-align: center;
`;

const StyledCard = styled.div`
  background: white;
  padding: 24px;
  min-height: 500px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const Controls = styled.div`
  margin-bottom: 20px;
`;

const ControlGroup = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-end;
`;

const Canvas = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  position: relative;
`;

const WordContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 200px;
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

const FeedbackBox = styled.div<{ $isError?: boolean }>`
  border: 1px solid black;
  padding: 4px 8px;
  color: ${(props) => (props.$isError ? 'red' : 'green')};
  font-size: 16px;
  text-align: center;
  background: white;
  margin-top: 20px;
`;

interface Response {
  correct: boolean;
  time: number;
}

interface EPM2Pair {
  noun: string;
  adjective: string;
  correct: boolean;
}

const WORD_PAIRS: EPM2Pair[] = [
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

const EPM2View: React.FC = () => {
  const navigate = useNavigate();
  const { isRunning, level, setLevel, startExercise, stopExercise } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWords, setShowWords] = useState(false);
  const [responses, setResponses] = useState<Response[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [lastResponse, setLastResponse] = useState<Response | null>(null);
  const [vg3, setVg3] = useState(0);

  const moveToNextWord = useCallback(() => {
    if (currentIndex < WORD_PAIRS.length - 1) {
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
      const totalTime = responses.reduce((acc, curr) => acc + curr.time, 0);
      const incorrectCount = responses.filter((r) => !r.correct).length;
      const averageTime = totalTime / responses.length;
      const vg3WithPenalty = averageTime + (incorrectCount * 2000) / responses.length;
      setVg3(vg3WithPenalty);
      setShowingFeedback(true);
      stopExercise();
    }
  }, [currentIndex, responses, stopExercise]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!isRunning || showingFeedback || lastResponse !== null) return;

      const currentPair = WORD_PAIRS[currentIndex];
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
        setResponses((prev) => {
          const newResponses = [...prev, response];
          const totalTime = newResponses.reduce((acc, curr) => acc + curr.time, 0);
          const incorrectCount = newResponses.filter((r) => !r.correct).length;
          const averageTime = totalTime / newResponses.length;
          const vg3WithPenalty = averageTime + (incorrectCount * 2000) / newResponses.length;
          setVg3(vg3WithPenalty);
          return newResponses;
        });
        setShowingFeedback(true);

        // Show feedback for 2 seconds before moving to next word
        setTimeout(() => {
          moveToNextWord();
        }, 2000);
      }
    },
    [isRunning, currentIndex, startTime, showingFeedback, lastResponse, moveToNextWord],
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

  const handleStartClick = () => {
    if (!isRunning) {
      startExercise();
    } else {
      stopExercise();
      setShowWords(false);
    }
  };

  const handleLevelChange = (value: number) => {
    setLevel(value);
  };

  const handleExerciseChange = (value: string) => {
    navigate(`/${value.toLowerCase()}`);
  };

  const getPerformanceMessage = (averageTime: number) => {
    if (averageTime < 800) return 'Velocidad supersónica';
    if (averageTime < 1200) return 'Velocidad de la luz';
    if (averageTime < 1500) return 'Muy rápido';
    if (averageTime < 2000) return 'Tranquilón';
    if (averageTime < 2500) return 'Tortuga coja';
    return 'Necesitas más práctica';
  };

  return (
    <div>
      <PageHeader>EPM2 - Sustantivo y adjetivo</PageHeader>
      <StyledCard>
        <Controls>
          <ControlGroup>
            <div>
              <label>Ejercicio</label>
              <Select
                value="EPM2"
                style={{ width: 120 }}
                disabled={isRunning}
                onChange={handleExerciseChange}
                options={[
                  { value: 'EPM1', label: 'EPM1' },
                  { value: 'EPM2', label: 'EPM2' },
                  { value: 'EPM3', label: 'EPM3' },
                ]}
              />
            </div>
            <div>
              <label>Nivel</label>
              <Select
                value={level}
                style={{ width: 120 }}
                disabled={isRunning}
                onChange={handleLevelChange}
                options={Array.from({ length: 9 }, (_, i) => ({ value: i + 1, label: i + 1 }))}
              />
            </div>
            <Button onClick={handleStartClick}>{!isRunning ? 'Comenzar' : 'Stop'}</Button>
          </ControlGroup>
        </Controls>

        <Canvas>
          {showWords && (
            <WordContainer>
              <span>{WORD_PAIRS[currentIndex].noun}</span>
              <span>{WORD_PAIRS[currentIndex].adjective}</span>
            </WordContainer>
          )}

          {showingFeedback && lastResponse && (
            <FeedbackBox $isError={!lastResponse.correct}>
              {lastResponse.correct
                ? `Has acertado - T: ${lastResponse.time}`
                : 'Has fallado, 2 segundos de penalización'}
            </FeedbackBox>
          )}

          {responses.length === WORD_PAIRS.length && (
            <ResultBox>
              <div>Tiempo medio de respuesta:</div>
              <AverageTime>{Math.round(vg3)} ms</AverageTime>
              <ResultMessage>{getPerformanceMessage(vg3)}</ResultMessage>
            </ResultBox>
          )}
        </Canvas>
      </StyledCard>
    </div>
  );
};

export default EPM2View;
