/* src/components/layout/AnimatedBackground/index.jsx */
import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

const AnimatedBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const options = {
    fullScreen: {
      enable: true,
      zIndex: -1,
    },
    particles: {
      number: {
        value: 60,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: '#4cc9f0',
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: { min: 0.1, max: 0.5 },
        animation: {
          enable: true,
          speed: 1,
          sync: false,
        },
      },
      size: {
        value: { min: 0.5, max: 1.5 },
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out',
      },
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'bubble',
        },
        resize: true,
      },
      modes: {
        bubble: {
          distance: 200,
          size: 2,
          duration: 2,
          opacity: 0.8,
        },
      },
    },
    detectRetina: true,
    background: {
      color: {
        value: '#0A192F',
      },
    },
  };

  return <Particles id="tsparticles" init={particlesInit} options={options} />;
};

export default AnimatedBackground;