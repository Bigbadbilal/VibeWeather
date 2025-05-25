import React from 'react';

interface AppleRainEffectProps {
  backRow?: boolean;
  splat?: boolean;
}

const AppleRainEffect: React.FC<AppleRainEffectProps> = ({ backRow = false, splat = false }) => {
  const drops: JSX.Element[] = [];
  let increment = 0;
  while (increment < 100) {
    const randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);
    const randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);
    increment += randoFiver;
    const style: React.CSSProperties = backRow
      ? {
          right: `${increment}%`,
          bottom: `${randoFiver + randoFiver - 1 + 100}%`,
          animationDelay: `0.${randoHundo}s`,
          animationDuration: `0.5${randoHundo}s`,
        }
      : {
          left: `${increment}%`,
          bottom: `${randoFiver + randoFiver - 1 + 100}%`,
          animationDelay: `0.${randoHundo}s`,
          animationDuration: `0.5${randoHundo}s`,
        };
    drops.push(
      <div className="drop" style={style} key={increment + (backRow ? 'b' : 'f')}>
        <div
          className="stem"
          style={{
            animationDelay: `0.${randoHundo}s`,
            animationDuration: `0.5${randoHundo}s`,
          }}
        ></div>
        {splat && (
          <div
            className="splat"
            style={{
              animationDelay: `0.${randoHundo}s`,
              animationDuration: `0.5${randoHundo}s`,
            }}
          ></div>
        )}
      </div>
    );
  }
  return <div className={`rain${backRow ? ' back-row' : ' front-row'}`}>{drops}</div>;
};

export default AppleRainEffect; 