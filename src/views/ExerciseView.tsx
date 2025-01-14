import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Select } from 'antd';
import { useStore } from '../store';
import Exercise from '../components/exercises/Exercise';
import { PageHeader, StyledCard, Controls } from '../assets/styles/components';
import styled from 'styled-components';

const ExerciseDescription = styled.div`
  font-size: 16px;
  margin-bottom: 20px;
  color: black;
`;

const ExerciseView: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const { isRunning, level, setLevel, startExercise, stopExercise } = useStore();
  const [isCompleted, setIsCompleted] = useState(false);

  // Set default exercise to EPM1 if no exercise is selected
  useEffect(() => {
    if (!exerciseId) {
      navigate('/exercise/epm1');
    }
  }, [exerciseId, navigate]);

  const handleLevelChange = (value: number) => {
    setLevel(value);
  };

  const handleExerciseChange = (value: string) => {
    if (isRunning) {
      stopExercise();
    }
    setIsCompleted(false);
    navigate(`/exercise/${value}`);
  };

  const handleStartClick = () => {
    if (!isRunning) {
      setIsCompleted(false);
      startExercise();
    } else {
      stopExercise();
      setIsCompleted(false);
    }
  };

  const handleNextClick = () => {
    setIsCompleted(false);
    stopExercise();
    startExercise();
  };

  const getExerciseTitle = () => {
    switch (exerciseId) {
      case 'epm1':
        return 'Procesamiento mental. Artículo+sustantivo';
      case 'epm2':
        return 'Procesamiento mental. Sustantivo+adjetivo';
      case 'epm3':
        return 'Procesamiento mental. Sustantivo+sustantivo';
      default:
        return '';
    }
  };

  // Don't render until we have an exerciseId
  if (!exerciseId) return null;

  return (
    <div>
      <PageHeader>{getExerciseTitle()}</PageHeader>
      <StyledCard>
        <Controls>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div>
              <label>Ejercicio</label>
              <Select
                value={exerciseId}
                style={{ width: 120, marginLeft: 8 }}
                disabled={isRunning}
                onChange={handleExerciseChange}
                options={[
                  { value: 'epm1', label: 'EPM1' },
                  { value: 'epm2', label: 'EPM2' },
                  { value: 'epm3', label: 'EPM3' },
                ]}
              />
            </div>
            <div>
              <label>Nivel</label>
              <Select
                value={level}
                style={{ width: 120, marginLeft: 8 }}
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
          </div>
        </Controls>
        <ExerciseDescription>
          {exerciseId === 'epm1' && 'Procesamiento mental. Artículo+sustantivo'}
          {exerciseId === 'epm2' && 'Procesamiento mental. Sustantivo+adjetivo'}
          {exerciseId === 'epm3' && 'Procesamiento mental. Sustantivo+sustantivo'}
        </ExerciseDescription>
        <Exercise onComplete={() => setIsCompleted(true)} />
      </StyledCard>
    </div>
  );
};

export default ExerciseView;
