import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NumberOutlined, CalculatorOutlined, BookOutlined, EyeOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { PageHeader, StyledCard, ExerciseGrid } from '../assets/styles/components';

const exercises = [
  {
    key: 'el1',
    title: 'Lectura de Números',
    icon: <NumberOutlined />,
    description: 'Mejora tu velocidad de lectura de números con ejercicios progresivos.',
  },
  {
    key: 'eo',
    title: 'Operaciones',
    icon: <CalculatorOutlined />,
    description: 'Practica operaciones matemáticas rápidas y mejora tu agilidad mental.',
  },
  {
    key: 'epm',
    title: 'Palabras y Memoria',
    icon: <BookOutlined />,
    description: 'Entrena tu memoria con ejercicios de palabras y secuencias.',
  },
  {
    key: 'evm',
    title: 'Visión y Memoria',
    icon: <EyeOutlined />,
    description: 'Desarrolla tu memoria visual y capacidad de retención.',
  },
  {
    key: 'emd',
    title: 'Memoria y Deporte',
    icon: <ThunderboltOutlined />,
    description: 'Combina ejercicios de memoria con actividad física.',
  },
];

const TrainingView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader>Selecciona un Ejercicio</PageHeader>
      <ExerciseGrid>
        {exercises.map((exercise) => (
          <StyledCard
            key={exercise.key}
            title={
              <>
                {exercise.icon}
                {exercise.title}
              </>
            }
            onClick={() => navigate(`/exercise/${exercise.key}`)}
            hoverable
          >
            {exercise.description}
          </StyledCard>
        ))}
      </ExerciseGrid>
    </>
  );
};

export default TrainingView;
