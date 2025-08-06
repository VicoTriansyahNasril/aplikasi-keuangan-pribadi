/* src/components/layout/AnimatedBackground/index.jsx */
import React, { useCallback, useMemo } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { useTransactions } from '../../../context/TransactionContext';

const darkThemeOptions = {
  particles: {
    number: { value: 60, density: { enable: true, value_area: 800 } },
    color: { value: '#4cc9f0' },
    shape: { type: 'circle' },
    opacity: { value: { min: 0.1, max: 0.5 }, animation: { enable: true, speed: 1, sync: false } },
    size: { value: { min: 0.5, max: 1.5 } },
    move: { enable: true, speed: 0.5, direction: 'none', random: true, straight: false, out_mode: 'out' },
  },
  interactivity: {
    events: { onhover: { enable: true, mode: 'bubble' } },
    modes: { bubble: { distance: 200, size: 2, duration: 2, opacity: 0.8 } },
  },
  background: { color: { value: 'transparent' } },
};

const lightThemeOptions = {
  particles: {
    number: { value: 10, density: { enable: true, value_area: 800 } },
    color: { value: '#ffffff' },
    shape: { type: 'circle' },
    opacity: { value: { min: 0.4, max: 0.8 } },
    size: { value: { min: 50, max: 100 } },
    move: { enable: true, speed: 1.5, direction: 'right', random: true, straight: true, out_mode: 'out' },
  },
  interactivity: { events: { onhover: { enable: false } } },
  background: { color: { value: 'transparent' } },
};

const AnimatedBackground = () => {
  const { theme } = useTransactions() || {};
  const particlesInit = useCallback(async (engine) => { await loadSlim(engine); }, []);

  const options = useMemo(() => {
    const baseConfig = {
      fullScreen: { enable: true, zIndex: -1 },
      detectRetina: true,
    };
    return theme === 'dark' 
      ? { ...baseConfig, ...darkThemeOptions } 
      : { ...baseConfig, ...lightThemeOptions };
  }, [theme]);

  if (!theme) return null;

  return <Particles id="tsparticles" init={particlesInit} options={options} />;
};

export default AnimatedBackground;