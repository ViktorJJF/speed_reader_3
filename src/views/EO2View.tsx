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

const Number = styled.div`
  position: absolute;
  font-size: 64px;
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
  max-width: 600px;
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

const NumberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NumberButton = styled.button<{ $selected?: boolean; $correct?: boolean }>`
  width: 50px;
  height: 50px;
  font-size: 24px;
  border: 1px solid #ccc;
  background: ${(props) => (props.$selected ? '#e6e6e6' : 'white')};
  color: ${(props) => (props.$correct ? '#00aa00' : 'black')};
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

// Generate random positions for the numbers
const generatePositions = () => {
  const padding = 100;
  const width = 600;
  const height = 400;
  return Array.from({ length: 8 }, () => ({
    x: Math.floor(Math.random() * (width - 2 * padding)) + padding,
    y: Math.floor(Math.random() * (height - 2 * padding)) + padding,
  }));
};

// Generate 8 numbers where at least one repeats and one is missing
const generateNumbers = () => {
  const numbers = [];
  const availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Remove one random number (this will be the missing number)
  const missingNumberIndex = Math.floor(Math.random() * availableNumbers.length);
  const missingNumber = availableNumbers[missingNumberIndex];
  availableNumbers.splice(missingNumberIndex, 1);

  // Select one number to repeat
  const repeatNumberIndex = Math.floor(Math.random() * availableNumbers.length);
  const repeatNumber = availableNumbers[repeatNumberIndex];

  // Add first 6 unique numbers
  while (numbers.length < 6) {
    if (numbers.length === repeatNumberIndex) {
      numbers.push(repeatNumber);
    } else {
      const index = Math.floor(Math.random() * availableNumbers.length);
      const num = availableNumbers[index];
      if (num !== repeatNumber) {
        numbers.push(num);
        availableNumbers.splice(index, 1);
      }
    }
  }

  // Add the repeated number again
  numbers.push(repeatNumber);

  // Add one more random number from the remaining available numbers
  const lastIndex = Math.floor(Math.random() * availableNumbers.length);
  numbers.push(availableNumbers[lastIndex]);

  return {
    numbers,
    repeatedNumber: repeatNumber,
    missingNumber: missingNumber,
  };
};

const EO2View: React.FC = () => {
  const navigate = useNavigate();
  const { isRunning, level, setLevel, startExercise, stopExercise } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [positions] = useState(generatePositions());
  const [numberSequence] = useState(generateNumbers());
  const [isCompleted, setIsCompleted] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [repeatedAnswer, setRepeatedAnswer] = useState<number | null>(null);
  const [missingAnswer, setMissingAnswer] = useState<number | null>(null);
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

  const handleNumberClick = (columnType: 'repeated' | 'missing', number: number) => {
    if (columnType === 'repeated') {
      setRepeatedAnswer(number);
    } else {
      setMissingAnswer(number);
    }
  };

  const handleVerifyClick = () => {
    setShowResults(true);
  };

  return (
    <div>
      <PageHeader>EO2 - Seguimiento de números</PageHeader>
      <StyledCard>
        <Controls>
          <ControlGroup>
            <div>
              <label>Ejercicio</label>
              <Select
                value="EO2"
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
            <Number
              style={{
                left: positions[currentIndex].x,
                top: positions[currentIndex].y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {numberSequence.numbers[currentIndex]}
            </Number>
          )}

          {showQuestions && (
            <AnswerContainer>
              <QuestionColumn>
                <QuestionTitle>¿Qué número se ha repetido?</QuestionTitle>
                <NumberList>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <NumberButton
                      key={num}
                      onClick={() => handleNumberClick('repeated', num)}
                      $selected={repeatedAnswer === num}
                      $correct={showResults && num === numberSequence.repeatedNumber}
                    >
                      {num}
                    </NumberButton>
                  ))}
                </NumberList>
                {showResults && (
                  <ResultLabel $correct={repeatedAnswer === numberSequence.repeatedNumber}>
                    {repeatedAnswer === numberSequence.repeatedNumber ? 'Correcta' : 'Incorrecta'}
                  </ResultLabel>
                )}
              </QuestionColumn>

              <QuestionColumn>
                <QuestionTitle>¿Qué número no ha salido?</QuestionTitle>
                <NumberList>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <NumberButton
                      key={num}
                      onClick={() => handleNumberClick('missing', num)}
                      $selected={missingAnswer === num}
                      $correct={showResults && num === numberSequence.missingNumber}
                    >
                      {num}
                    </NumberButton>
                  ))}
                </NumberList>
                {showResults && (
                  <ResultLabel $correct={missingAnswer === numberSequence.missingNumber}>
                    {missingAnswer === numberSequence.missingNumber ? 'Correcta' : 'Incorrecta'}
                  </ResultLabel>
                )}
              </QuestionColumn>
            </AnswerContainer>
          )}

          {showQuestions && !showResults && repeatedAnswer !== null && missingAnswer !== null && (
            <VerifyButton onClick={handleVerifyClick}>Comprobar</VerifyButton>
          )}
        </Canvas>
      </StyledCard>
    </div>
  );
};

export default EO2View;
