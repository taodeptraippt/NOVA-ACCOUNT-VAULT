'use client';

import React from 'react';

/**
 * BackgroundFX — Layered futuristic background effects.
 * Uses only transform/opacity animations for GPU efficiency.
 * Respects prefers-reduced-motion via CSS.
 */
export const BackgroundFX: React.FC = () => {
  return (
    <div className="nova-bg-fx" aria-hidden="true">
      {/* Grid overlay */}
      <div className="nova-grid-overlay" />

      {/* Ambient orbs */}
      <div
        className="nova-ambient-orb"
        style={{
          width: '500px',
          height: '500px',
          top: '-150px',
          left: '10%',
          background: 'radial-gradient(circle, rgba(77,124,255,0.6) 0%, transparent 70%)',
        }}
      />
      <div
        className="nova-ambient-orb"
        style={{
          width: '400px',
          height: '400px',
          top: '20%',
          right: '-100px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)',
        }}
      />
      <div
        className="nova-ambient-orb"
        style={{
          width: '350px',
          height: '350px',
          bottom: '10%',
          left: '-80px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
        }}
      />

      {/* Light streaks */}
      <div
        className="nova-light-streak"
        style={{ top: '20%', left: '0', width: '40%', transform: 'rotate(15deg)' }}
      />
      <div
        className="nova-light-streak"
        style={{ top: '60%', right: '0', width: '30%', transform: 'rotate(-10deg)', opacity: '0.2' }}
      />

      {/* Sparse particles (static, subtle) */}
      {[
        { top: '15%', left: '20%', size: 2, opacity: 0.3 },
        { top: '30%', left: '75%', size: 1.5, opacity: 0.2 },
        { top: '45%', left: '12%', size: 1.5, opacity: 0.25 },
        { top: '55%', left: '85%', size: 2, opacity: 0.2 },
        { top: '70%', left: '30%', size: 1.5, opacity: 0.3 },
        { top: '82%', left: '60%', size: 2, opacity: 0.2 },
        { top: '10%', left: '55%', size: 1.5, opacity: 0.2 },
        { top: '65%', left: '45%', size: 1.5, opacity: 0.15 },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#4D7CFF]"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            boxShadow: '0 0 6px rgba(77,124,255,0.4)',
          }}
        />
      ))}

      {/* Bottom vignette for depth */}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          background: 'linear-gradient(to top, rgba(5,8,18,0.8) 0%, transparent 100%)',
        }}
      />
    </div>
  );
};
