import React, { useMemo } from 'react';

interface AppleRainEffectProps {
  backRow?: boolean;
  splat?: boolean;
}

// Generate stable rain drop positions
const generateRainPositions = (isBackRow: boolean) => {
  const drops: Array<{
    right?: string;
    left?: string;
    bottom: string;
    animationDelay: string;
    animationDuration: string;
    shouldSplat: boolean;
  }> = [];
  
  let increment = 0;
  // Create more drops for denser rain
  while (increment < 200) {
    const randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);
    increment += randoFiver;
    
    // Faster duration for more realistic rain
    const duration = (0.7 + Math.random() * 0.3).toFixed(2);
    
    // Randomly decide if this drop should create a splat (about 30% of drops)
    const shouldSplat = Math.random() < 0.3;

    // Create more varied initial delays
    const initialDelay = (Math.random() * 3).toFixed(2);
    
    drops.push({
      ...(isBackRow 
        ? { right: `${increment}%` }
        : { left: `${increment}%` }
      ),
      bottom: '100%', // Always start from the top
      animationDelay: `${initialDelay}s`,
      animationDuration: `${duration}s`,
      shouldSplat
    });
  }
  
  return drops;
};

// Store rain positions outside component to keep them stable
const frontRowPositions = generateRainPositions(false);
const backRowPositions = generateRainPositions(true);

const AppleRainEffect: React.FC<AppleRainEffectProps> = ({ backRow = false, splat = false }) => {
  // Use memoized rain drops
  const drops = useMemo(() => {
    const positions = backRow ? backRowPositions : frontRowPositions;
    return positions.map((style, index) => (
      <div 
        className="drop" 
        style={{
          ...style,
          animation: `drop ${style.animationDuration} linear infinite`,
          animationDelay: style.animationDelay
        }} 
        key={index + (backRow ? 'b' : 'f')}
      >
        <div
          className="stem"
          style={{
            animation: `stem ${style.animationDuration} linear infinite`,
            animationDelay: style.animationDelay
          }}
        />
        {(splat || style.shouldSplat) && (
          <div
            className="splat"
            style={{
              animation: `splat ${style.animationDuration} linear infinite`,
              animationDelay: style.animationDelay
            }}
          />
        )}
      </div>
    ));
  }, [backRow, splat]);

  return <div className={`rain${backRow ? ' back-row' : ' front-row'}`}>{drops}</div>;
};

export default AppleRainEffect; 