import React, { useState, useEffect, useRef } from 'react';
import { Button, Select, Input } from 'antd';
import type { InputRef } from 'antd';
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
  flex-direction: column;
  gap: 20px;
`;

const NumberDisplay = styled.div`
  font-size: 48px;
  font-weight: bold;
  color: #000;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const StyledInput = styled(Input)`
  width: 100px;
  height: 60px;
  font-size: 24px;
  text-align: center;
`;

const ResultMessage = styled.div<{ $correct?: boolean }>`
  margin-top: 20px;
  font-size: 24px;
  color: ${(props) => (props.$correct ? 'green' : 'red')};
`;

const generateNumbers = () => {
  const num1 = Math.floor(Math.random() * 1000);
  const num2 = Math.floor(Math.random() * 1000);
  const num3 = Math.floor(Math.random() * 1000);
  return [num1.toString().padStart(3, '0'), num2.toString().padStart(3, '0'), num3.toString().padStart(3, '0')];
};

const EDM4View: React.FC = () => {
  const navigate = useNavigate();
  const { isRunning, level, setLevel, startExercise, stopExercise } = useStore();
  const [numbers, setNumbers] = useState(generateNumbers());
  const [showNumbers, setShowNumbers] = useState(false);
  const [showInputs, setShowInputs] = useState(false);
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const input1Ref = useRef<InputRef>(null);
  const input2Ref = useRef<InputRef>(null);
  const input3Ref = useRef<InputRef>(null);

  useEffect(() => {
    if (isRunning) {
      setShowNumbers(true);
      setShowInputs(false);
      setShowResults(false);

      // Show numbers for 0.4 seconds
      const timer = setTimeout(() => {
        setShowNumbers(false);
        setShowInputs(true);
        stopExercise();
        // Focus first input after numbers disappear
        setTimeout(() => input1Ref.current?.focus(), 100);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [isRunning]);

  const handleStartClick = () => {
    if (!isRunning) {
      setInput1('');
      setInput2('');
      setInput3('');
      setShowResults(false);
      startExercise();
    }
  };

  const handleNextClick = () => {
    setInput1('');
    setInput2('');
    setInput3('');
    setShowResults(false);
    setShowInputs(false);
    setShowNumbers(false);
    setNumbers(generateNumbers());
  };

  const handleLevelChange = (value: number) => {
    setLevel(value);
  };

  const handleExerciseChange = (value: string) => {
    navigate(`/${value.toLowerCase()}`);
  };

  const handleVerifyClick = () => {
    const isAnswerCorrect = input1 === numbers[0] && input2 === numbers[1] && input3 === numbers[2];

    setIsCorrect(isAnswerCorrect);
    setShowResults(true);
  };

  const handleInputChange = (index: number, value: string) => {
    // Only allow three digits
    if (value.length <= 3 && /^\d*$/.test(value)) {
      if (index === 0) {
        setInput1(value);
        if (value.length === 3) {
          input2Ref.current?.focus();
        }
      } else if (index === 1) {
        setInput2(value);
        if (value.length === 3) {
          input3Ref.current?.focus();
        }
      } else {
        setInput3(value);
      }
    }
  };

  return (
    <div>
      <PageHeader>EDM4 - Memoria eidética. 9 dígitos</PageHeader>
      <StyledCard>
        <Controls>
          <ControlGroup>
            <div>
              <label>Ejercicio</label>
              <Select
                value="EDM4"
                style={{ width: 120 }}
                disabled={isRunning}
                onChange={handleExerciseChange}
                options={[
                  { value: 'EDM1', label: 'EDM1' },
                  { value: 'EDM2', label: 'EDM2' },
                  { value: 'EDM3', label: 'EDM3' },
                  { value: 'EDM4', label: 'EDM4' },
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
            {!showResults ? (
              showInputs ? (
                <Button onClick={handleVerifyClick}>Corregir</Button>
              ) : (
                <Button onClick={handleStartClick} disabled={isRunning}>
                  {!isRunning ? 'Comenzar' : 'Mostrando...'}
                </Button>
              )
            ) : (
              <Button onClick={handleNextClick}>Siguiente</Button>
            )}
          </ControlGroup>
        </Controls>

        <Canvas>
          {showNumbers && (
            <NumberDisplay>
              {numbers[0]} - {numbers[1]} - {numbers[2]}
            </NumberDisplay>
          )}

          {showInputs && (
            <InputContainer>
              <StyledInput
                ref={input1Ref}
                value={input1}
                onChange={(e) => handleInputChange(0, e.target.value)}
                maxLength={3}
                placeholder="000"
              />
              <StyledInput
                ref={input2Ref}
                value={input2}
                onChange={(e) => handleInputChange(1, e.target.value)}
                maxLength={3}
                placeholder="000"
              />
              <StyledInput
                ref={input3Ref}
                value={input3}
                onChange={(e) => handleInputChange(2, e.target.value)}
                maxLength={3}
                placeholder="000"
              />
            </InputContainer>
          )}

          {showResults && (
            <ResultMessage $correct={isCorrect}>
              {isCorrect ? 'Correcto' : `Has fallado. La respuesta era ${numbers[0]} - ${numbers[1]} - ${numbers[2]}`}
            </ResultMessage>
          )}
        </Canvas>
      </StyledCard>
    </div>
  );
};

export default EDM4View;
