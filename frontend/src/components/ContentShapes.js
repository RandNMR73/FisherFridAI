import React from 'react';
import styled from 'styled-components';
import { useTrail, animated } from 'react-spring';

const ShapesContainer = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(${props => props.count}, 1fr);
  gap: 12px;
  padding: 12px;
  overflow-y: auto;
`;

const Shape = styled(animated.div)`
  padding: 12px;
  text-align: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 120px;
  max-height: 160px;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;   
  } 
`;

const ContentShapes = ({ result, onShapeClick }) => {
    const trail = useTrail(result.length, {
        from: { opacity: 0, transform: 'translate3d(0,40px,0)' },
        to: { opacity: 1, transform: 'translate3d(0,0px,0)' },
        config: { mass: 1, tension: 280, friction: 20 },
    });

    return (
        <ShapesContainer count={result.length}>
            {trail.map((props, index) => (
                <Shape
                    key={index}
                    style={props}
                    onClick={() => {
                        console.log("Clicking shape with content:", result[index]);  // Debug log
                        onShapeClick(result[index]);
                    }}
                >
                    <p>{result[index]}</p>
                </Shape>
            ))}
        </ShapesContainer>
    );
};

export default ContentShapes;