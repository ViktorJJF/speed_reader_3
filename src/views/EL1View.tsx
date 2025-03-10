import React, { useState, useEffect } from 'react';
import { Button, Select } from 'antd';
import styled from 'styled-components';
import { useStore } from '../store';
import { PageHeader, StyledCard, Controls } from '../assets/styles/components';
import { useNavigate } from 'react-router-dom';

const NumberPairContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 200px;
  font-size: 48px;
  font-weight: bold;
  margin: 40px 0;
  color: #000;
`;

const ResultBox = styled.div`
  border: 1px solid black;
  padding: 15px 40px;
  text-align: center;
  min-width: 300px;
  background: white;
`;

const ControlGroup = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;

  label {
    margin-right: 8px;
  }
`;

// Generate 40 random number pairs
const generateNumberPairs = () => {
  return Array.from({ length: 40 }, () => ({
    first: Math.floor(Math.random() * 100),
    second: Math.floor(Math.random() * 100),
  }));
};

const EL1View: React.FC = () => {
  const navigate = useNavigate();
  const { isRunning, level, setLevel, startExercise, stopExercise } = useStore();
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [showPair, setShowPair] = useState(false);
  const [numberPairs] = useState(generateNumberPairs());
  const [isCompleted, setIsCompleted] = useState(false);

  // Calculate display time based on level (lower level = more time)
  const getDisplayTime = () => {
    const baseTime = 400; // 0.4 seconds base time
    const additionalTime = Math.max(0, 9 - level) * 100; // Add 0.1s for each level below 9
    return baseTime + additionalTime;
  };

  useEffect(() => {
    if (isRunning && !isCompleted) {
      const displayTime = getDisplayTime();
      const intervalTime = displayTime + 500; // 500ms pause between pairs

      setShowPair(true);

      const displayTimer = setTimeout(() => {
        setShowPair(false);
      }, displayTime);

      const nextPairTimer = setTimeout(() => {
        if (currentPairIndex < numberPairs.length - 1) {
          setCurrentPairIndex((prev) => prev + 1);
          setShowPair(true);
        } else {
          setIsCompleted(true);
          stopExercise();
        }
      }, intervalTime);

      return () => {
        clearTimeout(displayTimer);
        clearTimeout(nextPairTimer);
      };
    }
  }, [isRunning, currentPairIndex, level, numberPairs.length, isCompleted]);

  const handleStartClick = () => {
    if (!isRunning) {
      setCurrentPairIndex(0);
      setIsCompleted(false);
      startExercise();
    } else {
      stopExercise();
      setIsCompleted(false);
    }
  };

  const handleNextClick = () => {
    setCurrentPairIndex(0);
    setIsCompleted(false);
    stopExercise();
    startExercise();
  };

  const handleLevelChange = (value: number) => {
    setLevel(value);
  };

  const handleExerciseChange = (value: string) => {
    navigate(`/${value.toLowerCase()}`);
  };

  return (
    <div>
      <PageHeader>EL1 - Ejercicio de Lectura</PageHeader>
      <StyledCard>
        <Controls>
          <ControlGroup>
            <div>
              <label>Ejercicio</label>
              <Select
                value="EL1"
                style={{ width: 120 }}
                disabled={isRunning}
                onChange={handleExerciseChange}
                options={[
                  { value: 'EL1', label: 'EL1' },
                  { value: 'EL2', label: 'EL2' },
                  { value: 'EL3', label: 'EL3' },
                  { value: 'EL4', label: 'EL4' },
                  { value: 'EL5', label: 'EL5' },
                  { value: 'EL6', label: 'EL6' },
                  { value: 'EL7', label: 'EL7' },
                  { value: 'EL8', label: 'EL8' },
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

        {showPair && !isCompleted && (
          <NumberPairContainer>
            <span>{numberPairs[currentPairIndex].first}</span>
            <span>{numberPairs[currentPairIndex].second}</span>
          </NumberPairContainer>
        )}

        {isCompleted && (
          <ResultBox>
            <div>¡Ejercicio completado!</div>
            <div>Has visto {numberPairs.length} pares de números</div>
          </ResultBox>
        )}
      </StyledCard>
    </div>
  );
};

export default EL1View;
