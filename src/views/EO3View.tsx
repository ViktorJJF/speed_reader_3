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

const Word = styled.div`
  position: absolute;
  font-size: 48px;
  font-weight: bold;
  color: #000;
  transition: none;
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
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const WordButton = styled.button<{ $selected?: boolean; $isCorrectAnswer?: boolean }>`
  width: 120px;
  height: 40px;
  font-size: 18px;
  border: 1px solid #ccc;
  background: ${(props) => (props.$selected ? '#e6e6e6' : 'white')};
  color: ${(props) => (props.$isCorrectAnswer ? 'green' : 'black')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

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

// Lista predefinida de palabras
const AVAILABLE_WORDS = ['bata', 'bota', 'casas', 'casos', 'loco', 'malas', 'mapa', 'mona', 'patos', 'pinos'];

// Generate random positions for the words
const generatePositions = () => {
  const padding = 100;
  const width = 600;
  const height = 400;
  return Array.from({ length: 8 }, () => ({
    x: Math.floor(Math.random() * (width - 2 * padding)) + padding,
    y: Math.floor(Math.random() * (height - 2 * padding)) + padding,
  }));
};

// Generate 8 words where at least one repeats and one is missing
const generateWords = () => {
  const words = [];
  const availableWords = [...AVAILABLE_WORDS];

  // Remove one random word (this will be the missing word)
  const missingWordIndex = Math.floor(Math.random() * availableWords.length);
  const missingWord = availableWords[missingWordIndex];
  availableWords.splice(missingWordIndex, 1);

  // Select one word to repeat
  const repeatWordIndex = Math.floor(Math.random() * availableWords.length);
  const repeatWord = availableWords[repeatWordIndex];

  // Add first 6 unique words
  while (words.length < 6) {
    if (words.length === repeatWordIndex) {
      words.push(repeatWord);
    } else {
      const index = Math.floor(Math.random() * availableWords.length);
      const word = availableWords[index];
      if (word !== repeatWord) {
        words.push(word);
        availableWords.splice(index, 1);
      }
    }
  }

  // Add the repeated word again
  words.push(repeatWord);

  // Add one more random word from the remaining available words
  const lastIndex = Math.floor(Math.random() * availableWords.length);
  words.push(availableWords[lastIndex]);

  return {
    words,
    repeatedWord: repeatWord,
    missingWord: missingWord,
  };
};

const EO3View: React.FC = () => {
  const navigate = useNavigate();
  const { isRunning, level, setLevel, startExercise, stopExercise } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [positions] = useState(generatePositions());
  const [wordSequence] = useState(generateWords());
  const [isCompleted, setIsCompleted] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [repeatedAnswer, setRepeatedAnswer] = useState<string | null>(null);
  const [missingAnswer, setMissingAnswer] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Calculate display time based on level (lower level = more time)
  const getDisplayTime = () => {
    const baseTime = 300;
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

  const handleWordClick = (columnType: 'repeated' | 'missing', word: string) => {
    if (columnType === 'repeated') {
      setRepeatedAnswer(word);
    } else {
      setMissingAnswer(word);
    }
  };

  const handleVerifyClick = () => {
    setShowResults(true);
  };

  return (
    <div>
      <PageHeader>EO3 - Seguimiento de palabras</PageHeader>
      <StyledCard>
        <Controls>
          <ControlGroup>
            <div>
              <label>Ejercicio</label>
              <Select
                value="EO3"
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
            <Word
              style={{
                left: positions[currentIndex].x,
                top: positions[currentIndex].y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {wordSequence.words[currentIndex]}
            </Word>
          )}

          {showQuestions && (
            <AnswerContainer>
              <QuestionColumn>
                <QuestionTitle>¿Qué palabra se ha repetido?</QuestionTitle>
                <WordList>
                  {AVAILABLE_WORDS.map((word) => (
                    <WordButton
                      key={word}
                      onClick={() => handleWordClick('repeated', word)}
                      $selected={repeatedAnswer === word}
                      $isCorrectAnswer={showResults && word === wordSequence.repeatedWord}
                    >
                      {word}
                    </WordButton>
                  ))}
                </WordList>
                {showResults && (
                  <ResultLabel $correct={repeatedAnswer === wordSequence.repeatedWord}>
                    {repeatedAnswer === wordSequence.repeatedWord ? 'Correcta' : 'Incorrecta'}
                  </ResultLabel>
                )}
              </QuestionColumn>

              <QuestionColumn>
                <QuestionTitle>¿Qué palabra no ha salido?</QuestionTitle>
                <WordList>
                  {AVAILABLE_WORDS.map((word) => (
                    <WordButton
                      key={word}
                      onClick={() => handleWordClick('missing', word)}
                      $selected={missingAnswer === word}
                      $isCorrectAnswer={showResults && word === wordSequence.missingWord}
                    >
                      {word}
                    </WordButton>
                  ))}
                </WordList>
                {showResults && (
                  <ResultLabel $correct={missingAnswer === wordSequence.missingWord}>
                    {missingAnswer === wordSequence.missingWord ? 'Correcta' : 'Incorrecta'}
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

export default EO3View;
