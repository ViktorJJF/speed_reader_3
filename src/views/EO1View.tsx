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
  width: 800px;
  height: 500px;
  background: white;
  margin: 0 auto;
  position: relative;
  border: 1px solid #ccc;
`;

const Letter = styled.div`
  position: absolute;
  font-size: 48px;
  font-weight: bold;
  color: #000;
  transition: none;
`;

const ResultBox = styled.div`
  border: 1px solid black;
  padding: 15px 40px;
  text-align: center;
  min-width: 300px;
  background: white;
  margin: 20px auto;
`;

// Generate random positions for the letter
const generatePositions = () => {
  const padding = 50; // Padding from edges
  return Array.from({ length: 140 }, () => ({
    x: Math.floor(Math.random() * (800 - 2 * padding)) + padding,
    y: Math.floor(Math.random() * (500 - 2 * padding)) + padding,
  }));
};

const EO1View: React.FC = () => {
  const navigate = useNavigate();
  const { isRunning, level, setLevel, startExercise, stopExercise } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [positions] = useState(generatePositions());
  const [isCompleted, setIsCompleted] = useState(false);

  // Calculate display time based on level (lower level = more time)
  const getDisplayTime = () => {
    const baseTime = 200; // 0.2 seconds base time
    const additionalTime = Math.max(0, 9 - level) * 100; // Add 0.1s for each level below 9
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
      startExercise();
    } else {
      stopExercise();
      setIsCompleted(false);
    }
  };

  const handleNextClick = () => {
    setCurrentIndex(0);
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
      <PageHeader>EO1 - Seguimiento de la letra "O"</PageHeader>
      <StyledCard>
        <Controls>
          <ControlGroup>
            <div>
              <label>Ejercicio</label>
              <Select
                value="EO1"
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
            <Letter
              style={{
                left: positions[currentIndex].x,
                top: positions[currentIndex].y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              O
            </Letter>
          )}
        </Canvas>

        {isCompleted && (
          <ResultBox>
            <div>¡Ejercicio completado!</div>
            <div>Has seguido la letra O {positions.length} veces</div>
          </ResultBox>
        )}
      </StyledCard>
    </div>
  );
};

export default EO1View;
