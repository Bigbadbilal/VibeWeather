import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppleRainEffect from './AppleRainEffect';

interface WeatherBackgroundProps {
  weatherMain: string;
  isDay: boolean;
  weatherDescription?: string;
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ weatherMain, isDay, weatherDescription }) => {
  // Helper to detect heavy rain
  const desc = weatherDescription ? weatherDescription.toLowerCase() : '';
  const isRain = weatherMain === 'rain' || (desc.includes('rain') && !desc.includes('drizzle'));
  const isHeavyRain = isRain && (desc.includes('heavy') || desc.includes('intensity'));

  // Apple-style rain: thin, vertical, semi-transparent lines with a soft fade
  const renderAppleRain = (count: number, heavy: boolean = false) => (
    <>
      {[...Array(count)].map((_, i) => {
        // Parallax: slower drops in the back, faster in the front
        const layer = i % 3;
        const width = layer === 0 ? 2.5 : layer === 1 ? 3.5 : 4.5;
        const length = heavy ? (layer === 0 ? 48 : layer === 1 ? 64 : 80) : (layer === 0 ? 32 : layer === 1 ? 44 : 56);
        const opacity = layer === 0 ? 0.45 : layer === 1 ? 0.65 : 0.85;
        const duration = heavy
          ? (layer === 0 ? 1.1 : layer === 1 ? 0.8 : 0.6)
          : (layer === 0 ? 1.7 : layer === 1 ? 1.2 : 0.9);
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width,
              height: length,
              left: `${left}%`,
              top: `${top}%`,
              opacity,
              background: 'linear-gradient(180deg, #e3f0ff 0%, #b3d8ff 60%, #b3d8ff 100%)',
              borderRadius: 9999,
              pointerEvents: 'none',
              transform: `rotate(${layer === 2 ? 16 : layer === 1 ? 10 : 5}deg)`
            }}
            animate={{ y: [0, heavy ? 180 : 120] }}
            transition={{ duration, repeat: Infinity, delay: Math.random() * duration }}
          />
        );
      })}
    </>
  );

  switch (true) {
    case weatherMain === 'thunderstorm':
      return (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Dark clouds */}
          <motion.div className="absolute w-full h-1/2 top-0 left-0 bg-gradient-to-b from-gray-800/80 to-transparent" />
          {/* Lightning flashes */}
          <AnimatePresence>
            <motion.div
              key="lightning"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
              className="absolute w-full h-full left-0 top-0 pointer-events-none"
              style={{ background: 'linear-gradient(120deg, #fff 0%, #fff0 100%)', opacity: 0.5 }}
            />
          </AnimatePresence>
          {/* Rain effect for thunderstorm */}
          <AppleRainEffect heavy={true} />
          <AppleRainEffect heavy={true} backRow={true} />
        </div>
      );
    case isHeavyRain:
      return (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AppleRainEffect heavy={true} />
          <AppleRainEffect heavy={true} backRow={true} />
        </div>
      );
    case isRain:
      return (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AppleRainEffect />
          <AppleRainEffect backRow={true} />
        </div>
      );
    case weatherMain === 'snow':
      return (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Snowflakes */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full opacity-80"
              style={{ width: 8, height: 8, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, 60], opacity: [0.8, 0.5, 0.8] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
      );
    case weatherMain === 'clouds':
      return (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Moving clouds */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/40 rounded-full"
              style={{ width: 180, height: 60, left: `${i * 25}%`, top: `${20 + i * 10}%` }}
              animate={{ x: [0, 40, 0] }}
              transition={{ duration: 10 + i * 2, repeat: Infinity }}
            />
          ))}
        </div>
      );
    case weatherMain === 'clear':
      return isDay ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Sun */}
          <motion.div
            className="absolute left-1/2 top-1/4 -translate-x-1/2 bg-yellow-300 rounded-full shadow-2xl"
            style={{ width: 120, height: 120 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Moon and stars */}
          <motion.div
            className="absolute left-1/2 top-1/4 -translate-x-1/2 bg-gray-200 rounded-full shadow-xl"
            style={{ width: 80, height: 80 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full opacity-80"
              style={{ width: 2, height: 2, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
      );
    default:
      return null;
  }
};

export default WeatherBackground; 