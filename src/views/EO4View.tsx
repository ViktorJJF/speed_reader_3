import React, { useState, useEffect } from 'react';
import { Button, Select } from 'antd';
import styled from 'styled-components';
import { useStore } from '../store';
import { PageHeader, StyledCard, Controls } from '../assets/styles/components';
import { useNavigate } from 'react-router-dom';

const ControlGroup = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;

  label {
    margin-right: 8px;
  }
`;

const Canvas = styled.div`
  width: 100%;
  min-height: 600px;
  background: white;
  margin: 0 auto;
  position: relative;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WordPair = styled.div`
  position: absolute;
  font-size: 48px;
  font-weight: bold;
  color: #000;
  transition: none;
  display: flex;
  gap: 40px;
`;

const AnswerContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 200px;
  padding: 20px;
  width: 100%;
  max-width: 800px;
`;

const QuestionColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const QuestionTitle = styled.div`
  font-size: 24px;
  color: blue;
  margin-bottom: 20px;
  text-align: center;
`;

const WordList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
  max-width: 400px;
`;

const WordButton = styled.button<{ $selected?: boolean; $isCorrectAnswer?: boolean }>`
  width: 120px;
  height: 40px;
  font-size: 18px;
  border: 1px solid #ccc;
  background: ${(props) => (props.$selected ? '#e6e6e6' : 'white')};
  color: ${(props) => {
    if (props.$isCorrectAnswer) return 'green';
    return props.$selected ? 'black' : 'black';
  }};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;

  &:hover {
    background: #f0f0f0;
  }
`;

const ResultLabel = styled.div<{ $correct?: boolean }>`
  margin-top: 20px;
  padding: 5px 15px;
  border: 1px solid #ccc;
  background: white;
  color: ${(props) => (props.$correct ? 'green' : 'red')};
  font-weight: bold;
  text-transform: uppercase;
`;

const VerifyButton = styled(Button)`
  margin-top: 30px;
`;

// Lista predefinida de palabras individuales
const AVAILABLE_WORDS = [
  'foto',
  'lusas',
  'loro',
  'cubas',
  'saco',
  'peras',
  'malos',
  'tubas',
  'patas',
  'manos',
  'bota',
  'casos',
  'mapa',
  'mona',
];

// Lista predefinida de pares de palabras
const WORD_PAIRS = ['foto lusas', 'loro cubas', 'saco peras', 'malos tubas', 'patas manos', 'bota casos', 'mapa mona'];

// Generate random positions for the word pairs
const generatePositions = () => {
  const padding = 100;
  const width = 600;
  const height = 400;
  return Array.from({ length: 5 }, () => ({
    x: Math.floor(Math.random() * (width - 2 * padding)) + padding,
    y: Math.floor(Math.random() * (height - 2 * padding)) + padding,
  }));
};

// Generate 5 word pairs where at least one word repeats and one is missing
const generateWordPairs = () => {
  const pairs = [];
  const availablePairs = [...WORD_PAIRS];

  // Remove one random pair (this will contain the missing word)
  const missingPairIndex = Math.floor(Math.random() * availablePairs.length);
  const missingPair = availablePairs[missingPairIndex];
  const [missingWord] = missingPair.split(' ');
  availablePairs.splice(missingPairIndex, 1);

  // Select one pair to contain the repeated word
  const repeatPairIndex = Math.floor(Math.random() * availablePairs.length);
  const repeatPair = availablePairs[repeatPairIndex];
  const [repeatedWord] = repeatPair.split(' ');

  // Add first 3 unique pairs
  while (pairs.length < 3) {
    if (pairs.length === repeatPairIndex) {
      pairs.push(repeatPair);
    } else {
      const index = Math.floor(Math.random() * availablePairs.length);
      const pair = availablePairs[index];
      if (pair !== repeatPair) {
        pairs.push(pair);
        availablePairs.splice(index, 1);
      }
    }
  }

  // Add the pair with repeated word again
  pairs.push(repeatPair);

  // Add one more random pair from the remaining available pairs
  const lastIndex = Math.floor(Math.random() * availablePairs.length);
  pairs.push(availablePairs[lastIndex]);

  return {
    pairs,
    repeatedWord,
    missingWord,
  };
};

const EO4View: React.FC = () => {
  const navigate = useNavigate();
  const { isRunning, level, setLevel, startExercise, stopExercise } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [positions] = useState(generatePositions());
  const [pairSequence] = useState(generateWordPairs());
  const [isCompleted, setIsCompleted] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [repeatedAnswer, setRepeatedAnswer] = useState<string | null>(null);
  const [missingAnswer, setMissingAnswer] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Calculate display time based on level (lower level = more time)
  const getDisplayTime = () => {
    const baseTime = 800;
    const additionalTime = Math.max(0, 9 - level) * 100;
    return baseTime + additionalTime;
  };

  useEffect(() => {
    if (isRunning && !isCompleted) {
      const displayTime = getDisplayTime();

      const timer = setTimeout(() => {
        if (currentIndex < positions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setIsCompleted(true);
          setShowQuestions(true);
          stopExercise();
        }
      }, displayTime);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isRunning, currentIndex, positions.length, isCompleted]);

  const handleStartClick = () => {
    if (!isRunning) {
      setCurrentIndex(0);
      setIsCompleted(false);
      setShowQuestions(false);
      setShowResults(false);
      setRepeatedAnswer(null);
      setMissingAnswer(null);
      startExercise();
    } else {
      stopExercise();
      setIsCompleted(false);
    }
  };

  const handleNextClick = () => {
    setCurrentIndex(0);
    setIsCompleted(false);
    setShowQuestions(false);
    setShowResults(false);
    setRepeatedAnswer(null);
    setMissingAnswer(null);
    stopExercise();
    startExercise();
  };

  const handleLevelChange = (value: number) => {
    setLevel(value);
  };

  const handleExerciseChange = (value: string) => {
    navigate(`/${value.toLowerCase()}`);
  };

  const handlePairClick = (columnType: 'repeated' | 'missing', pair: string) => {
    if (columnType === 'repeated') {
      setRepeatedAnswer(pair);
    } else {
      setMissingAnswer(pair);
    }
  };

  const handleVerifyClick = () => {
    setShowResults(true);
  };

  return (
    <div>
      <PageHeader>EO4 - Seguimiento de pares de palabras</PageHeader>
      <StyledCard>
        <Controls>
          <ControlGroup>
            <div>
              <label>Ejercicio</label>
              <Select
                value="EO4"
                style={{ width: 120 }}
                disabled={isRunning}
                onChange={handleExerciseChange}
                options={[
                  { value: 'EO1', label: 'EO1' },
                  { value: 'EO2', label: 'EO2' },
                  { value: 'EO3', label: 'EO3' },
                  { value: 'EO4', label: 'EO4' },
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
            {!isCompleted ? (
              <Button onClick={handleStartClick}>{!isRunning ? 'Comenzar' : 'Stop'}</Button>
            ) : (
              <Button onClick={handleNextClick}>Siguiente</Button>
            )}
          </ControlGroup>
        </Controls>

        <Canvas>
          {isRunning && !isCompleted && (
            <WordPair
              style={{
                left: positions[currentIndex].x,
                top: positions[currentIndex].y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {pairSequence.pairs[currentIndex]}
            </WordPair>
          )}

          {showQuestions && (
            <AnswerContainer>
              <QuestionColumn>
                <QuestionTitle>¿Qué palabra se ha repetido?</QuestionTitle>
                <WordList>
                  {AVAILABLE_WORDS.slice(0, 10).map((word) => (
                    <WordButton
                      key={word}
                      onClick={() => handlePairClick('repeated', word)}
                      $selected={repeatedAnswer === word}
                      $isCorrectAnswer={showResults && word === pairSequence.repeatedWord}
                    >
                      {word}
                    </WordButton>
                  ))}
                </WordList>
                {showResults && (
                  <ResultLabel $correct={repeatedAnswer === pairSequence.repeatedWord}>
                    {repeatedAnswer === pairSequence.repeatedWord ? 'Correcta' : 'Incorrecta'}
                  </ResultLabel>
                )}
              </QuestionColumn>

              <QuestionColumn>
                <QuestionTitle>¿Qué palabra no ha salido?</QuestionTitle>
                <WordList>
                  {AVAILABLE_WORDS.slice(0, 10).map((word) => (
                    <WordButton
                      key={word}
                      onClick={() => handlePairClick('missing', word)}
                      $selected={missingAnswer === word}
                      $isCorrectAnswer={showResults && word === pairSequence.missingWord}
                    >
                      {word}
                    </WordButton>
                  ))}
                </WordList>
                {showResults && (
                  <ResultLabel $correct={missingAnswer === pairSequence.missingWord}>
                    {missingAnswer === pairSequence.missingWord ? 'Correcta' : 'Incorrecta'}
                  </ResultLabel>
                )}
              </QuestionColumn>
            </AnswerContainer>
          )}

          {showQuestions && !showResults && repeatedAnswer !== null && missingAnswer !== null && (
            <VerifyButton onClick={handleVerifyClick}>Corregir</VerifyButton>
          )}
        </Canvas>
      </StyledCard>
    </div>
  );
};

export default EO4View;
